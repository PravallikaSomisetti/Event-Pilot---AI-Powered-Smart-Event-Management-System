const STORAGE_KEY = "eventpilot_events";

export function getEvents() {
  const events = localStorage.getItem(STORAGE_KEY);
  return events ? JSON.parse(events) : [];
}

export function saveEvent(event) {
  const events = getEvents();

  const newEvent = {
    id: Date.now(),
    participants: 0,
    status: "Upcoming",
    ...event,
  };

  events.push(newEvent);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function deleteEvent(id) {
  const events = getEvents().filter((event) => event.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function updateEvent(updatedEvent) {
  const events = getEvents().map((event) =>
    event.id === updatedEvent.id ? updatedEvent : event
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}