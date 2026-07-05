import re
from typing import Dict, List, Tuple

# Simple keyword lists for backup sentiment analysis
POSITIVE_WORDS = {
    "great", "excellent", "awesome", "good", "nice", "love", "wonderful", "fantastic", "amazing",
    "perfect", "superb", "helpful", "friendly", "informative", "enjoyed", "smooth", "learned",
    "best", "well", "organized", "interesting", "satisfied", "recommend", "brilliant", "valuable"
}

NEGATIVE_WORDS = {
    "bad", "poor", "worst", "terrible", "horrible", "waste", "boring", "disappointed", "slow",
    "unorganized", "confusing", "hard", "difficult", "noisy", "short", "long", "expensive",
    "disaster", "fail", "hate", "annoying", "rudely", "useless", "broken", "delayed"
}

SUGGESTION_TRIGGERS = [
    "should", "would be better", "could improve", "need to", "please add", "suggest", 
    "hope in future", "wish there was", "we need", "recommend adding", "in future"
]

def clean_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'[^\w\s]', '', text.lower()).strip()

def analyze_sentiment(text: str) -> Tuple[str, List[str], List[str]]:
    """
    Analyzes sentiment, extracts key phrases, and extracts suggestions from comments.
    Returns: (sentiment: str, keywords: List[str], suggestions: List[str])
    """
    if not text or len(text.strip()) == 0:
        return "Neutral", [], []
        
    cleaned = clean_text(text)
    words = cleaned.split()
    
    # Calculate sentiment score
    pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
    neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)
    
    # Check for sentiment modifiers (not, don't, won't)
    negations = {"not", "no", "dont", "cant", "wont", "never", "didnt"}
    score = pos_count - neg_count
    
    # Basic negation modifier check
    for idx, w in enumerate(words):
        if w in negations and idx < len(words) - 1:
            next_word = words[idx + 1]
            if next_word in POSITIVE_WORDS:
                score -= 1.5  # Flip positive to negative
            elif next_word in NEGATIVE_WORDS:
                score += 1.0  # Double negative (neutral/positive)

    if score > 0.5:
        sentiment = "Positive"
    elif score < -0.5:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
        
    # Extract Keywords (Filter out stop words, capture nouns/adjectives of length > 3)
    stopwords = {
        "the", "and", "a", "of", "to", "is", "in", "it", "that", "was", "for", "on", "are", 
        "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", "or", "had", 
        "by", "but", "not", "some", "what", "there", "we", "can", "an", "your", "my", "so",
        "about", "would", "their", "will", "all", "me", "if", "did", "has", "get", "very"
    }
    
    keywords = []
    for w in words:
        if w not in stopwords and len(w) > 3 and (w in POSITIVE_WORDS or w in NEGATIVE_WORDS or w not in stopwords):
            if w not in keywords:
                keywords.append(w)
                
    # Limit keywords to top 4
    keywords = keywords[:4]
    
    # Extract suggestions
    suggestions = []
    sentences = re.split(r'[.!?;\n]', text)
    for sentence in sentences:
        s_lower = sentence.lower()
        for trigger in SUGGESTION_TRIGGERS:
            if trigger in s_lower:
                clean_s = sentence.strip()
                if clean_s and clean_s not in suggestions:
                    suggestions.append(clean_s)
                break
                
    # If no suggestions found but negative, generate a dummy suggestion based on negative keyword
    if not suggestions and sentiment == "Negative":
        neg_matches = [w for w in words if w in NEGATIVE_WORDS]
        if neg_matches:
            suggestions.append(f"Improve the organization and address issues related to '{neg_matches[0]}'.")
        else:
            suggestions.append("Address organization and event logistics.")
            
    return sentiment, keywords, suggestions

def aggregate_event_feedbacks(feedbacks: List) -> Dict:
    """Aggregates all feedbacks for dashboard consumption."""
    if not feedbacks:
        return {
            "overall_sentiment": "Neutral",
            "sentiment_counts": {"positive": 0, "neutral": 0, "negative": 0},
            "keywords": [],
            "suggestions": ["No suggestions submitted yet."]
        }
        
    pos = 0
    neu = 0
    neg = 0
    all_keywords = {}
    all_suggestions = []
    
    for f in feedbacks:
        sent = f.sentiment
        if sent == "Positive":
            pos += 1
        elif sent == "Negative":
            neg += 1
        else:
            neu += 1
            
        if f.keywords:
            for kw in f.keywords.split(","):
                kw = kw.strip()
                if kw:
                    all_keywords[kw] = all_keywords.get(kw, 0) + 1
                    
        if f.suggestions:
            for sug in f.suggestions.split("||"):
                sug = sug.strip()
                if sug and sug not in all_suggestions:
                    all_suggestions.append(sug)
                    
    # Determine overall sentiment
    total = len(feedbacks)
    if pos / total >= 0.5:
        overall = "Positive"
    elif neg / total >= 0.35:
        overall = "Negative"
    else:
        overall = "Neutral"
        
    sorted_kws = sorted(all_keywords.items(), key=lambda x: x[1], reverse=True)
    top_kws = [kw[0] for kw in sorted_kws[:6]]
    
    if not all_suggestions:
        all_suggestions = ["Keep maintaining event standards and gathering ratings."]
        
    return {
        "overall_sentiment": overall,
        "sentiment_counts": {
            "positive": pos,
            "neutral": neu,
            "negative": neg
        },
        "keywords": top_kws,
        "suggestions": all_suggestions[:4]
    }
