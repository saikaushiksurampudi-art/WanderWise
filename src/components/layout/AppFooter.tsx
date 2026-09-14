interface AppFooterProps {
  onOpenArchitecture: () => void;
  onOpenConcierge: () => void;
}

export function AppFooter({ onOpenArchitecture, onOpenConcierge }: AppFooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 text-center relative z-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 font-display">WanderWise AI</span>
          <span>•</span>
          <span>Intelligent Budget Travel Planner</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <button onClick={onOpenArchitecture} className="hover:text-slate-900 transition font-medium">
            Architecture & API Specs
          </button>
          <button onClick={onOpenConcierge} className="hover:text-slate-900 transition font-medium">
            AI Concierge
          </button>
        </div>
      </div>
    </footer>
  );
}
