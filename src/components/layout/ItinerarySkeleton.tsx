export function ItinerarySkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="rounded-[2rem] bg-slate-900 p-8 shadow-sm">
        <div className="h-4 w-40 bg-slate-700 rounded-full mb-4 animate-pulse" />
        <div className="h-10 w-2/3 bg-slate-700 rounded-2xl mb-4 animate-pulse" />
        <div className="flex gap-3">
          <div className="h-4 w-32 bg-slate-700 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-slate-700 rounded-full animate-pulse" />
        </div>
        <p className="text-indigo-200 text-sm font-semibold mt-6">
          Building a budget-optimized itinerary…
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-56 bg-white border border-slate-200 rounded-[2rem] animate-pulse" />
        <div className="h-56 bg-white border border-slate-200 rounded-[2rem] animate-pulse" />
      </div>
      <div className="h-72 bg-white border border-slate-200 rounded-[2rem] animate-pulse" />
    </div>
  );
}
