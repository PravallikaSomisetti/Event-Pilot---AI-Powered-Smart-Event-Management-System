import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        
        {/* Spinner rings */}
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 rounded-full" />
        <div className="absolute w-10 h-10 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase animate-pulse">
        Loading Assets...
      </p>
    </div>
  );
}

export default LoadingSpinner;
