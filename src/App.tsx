import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { PlannerHero } from './components/PlannerHero';
import { PlannerForm } from './components/PlannerForm';
import { TripPage } from './components/TripPage';
import { ExploreCities } from './components/ExploreCities';
import { CheckoutModal } from './components/CheckoutModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { MyBookings } from './components/MyBookings';
import { SavedPlacesView } from './components/SavedPlacesView';
import { ReplaceActivityModal } from './components/ReplaceActivityModal';
import { AIConciergeDrawer } from './components/AIConciergeDrawer';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { ErrorBanner } from './components/layout/ErrorBanner';
import { ItinerarySkeleton } from './components/layout/ItinerarySkeleton';
import { AppFooter } from './components/layout/AppFooter';
import { useWanderWise } from './hooks/useWanderWise';
import { MapPin, Sparkles } from 'lucide-react';

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }
};

export function App() {
  const app = useWanderWise();
  const showTripPage = app.viewingTripPage && !!app.currentTrip;

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col relative">
      <div className="app-backdrop">
        <motion.div
          className="absolute top-[-10%] left-[5%] w-[36rem] h-[36rem] bg-indigo-200/40 rounded-full blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[0%] w-[40rem] h-[40rem] bg-emerald-200/30 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <Header
        activeTab={app.activeTab}
        setActiveTab={app.handleTabChange}
        bookingsCount={app.bookings.length}
        savedPlacesCount={app.savedPlaces.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        <AnimatePresence>
          {app.errorMessage && (
            <ErrorBanner key="error-banner" message={app.errorMessage} onDismiss={() => app.setErrorMessage(null)} />
          )}
          {app.successMessage && (
            <ErrorBanner
              key="success-banner"
              variant="success"
              message={app.successMessage}
              onDismiss={() => app.setSuccessMessage(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showTripPage ? (
            <motion.div key="trip-page" {...pageTransition}>
              <TripPage
                trip={app.currentTrip!}
                onBack={app.handleCloseTripPage}
                onBookNow={() => {
                  app.setCheckoutError(null);
                  app.setShowCheckoutModal(true);
                }}
                onDownloadPDF={app.handleDownloadCurrentPDF}
                onOpenAIConcierge={() => app.setShowAIConcierge(true)}
                onRequestReplaceActivity={act => {
                  app.setReplaceError(null);
                  app.setSelectedActivityForReplace(act);
                  app.setShowReplaceModal(true);
                }}
                onToggleSavePlace={app.handleToggleSavePlace}
                savedPlaceIds={app.savedPlaceIds}
              />
            </motion.div>
          ) : app.activeTab === 'planner' ? (
            <motion.div key="planner" {...pageTransition} className="space-y-6">
              <PlannerHero />
              <PlannerForm
                key={`${app.plannerForm.destination}-${app.plannerForm.duration}-${app.plannerForm.budget}-${app.plannerForm.travelers}`}
                initialData={app.plannerForm}
                onGenerate={app.handleGenerateTrip}
                isLoading={app.isGenerating}
              />

              {app.isGenerating && <ItinerarySkeleton />}

              {!app.isGenerating && app.currentTrip && (
                <button
                  type="button"
                  onClick={app.handleOpenTripPage}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-[2rem] p-5 shadow-sm hover:shadow-md flex items-center justify-between gap-4 text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{app.currentTrip.title}</p>
                      <p className="text-xs text-slate-500">Your last generated itinerary is ready to review.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">View Full Itinerary →</span>
                </button>
              )}

              {!app.isGenerating && !app.currentTrip && (
                <div className="bg-white border border-dashed border-slate-300 rounded-[2rem] p-10 text-center shadow-sm">
                  <MapPin className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                  <h3 className="text-lg font-extrabold text-slate-900">No itinerary yet</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    Choose a destination, budget, and interests, then click Generate Magic Budget Itinerary to build your trip.
                  </p>
                </div>
              )}
            </motion.div>
          ) : app.activeTab === 'explore' ? (
            <motion.div key="explore" {...pageTransition}>
              <ExploreCities
                templates={app.templates}
                onSelectTemplate={app.handleSelectTemplate}
                isLoading={app.isGenerating}
                isBootstrapping={app.isBootstrapping}
              />
            </motion.div>
          ) : app.activeTab === 'bookings' ? (
            <motion.div key="bookings" {...pageTransition}>
              <MyBookings
                bookings={app.bookings}
                onPlanNewTrip={() => app.handleTabChange('planner')}
              />
            </motion.div>
          ) : (
            <motion.div key="saved" {...pageTransition}>
              <SavedPlacesView
                savedPlaces={app.savedPlaces}
                onRemovePlace={app.handleToggleSavePlace}
                onPlanTripToCity={app.handlePlanTripToCity}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AppFooter
        onOpenArchitecture={() => app.setShowArchitectureModal(true)}
        onOpenConcierge={() => app.setShowAIConcierge(true)}
      />

      <AnimatePresence>
        {app.showCheckoutModal && app.currentTrip && (
          <CheckoutModal
            trip={app.currentTrip}
            onClose={() => {
              if (app.isCheckingOut) return;
              app.setShowCheckoutModal(false);
            }}
            onSubmitCheckout={app.handleProcessCheckout}
            isProcessing={app.isCheckingOut}
            errorMessage={app.checkoutError}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {app.showSuccessModal && app.latestBooking && app.currentTrip && (
          <BookingSuccessModal
            booking={app.latestBooking}
            trip={app.currentTrip}
            onClose={() => app.setShowSuccessModal(false)}
            onViewBookings={() => {
              app.setShowSuccessModal(false);
              app.handleTabChange('bookings');
            }}
            onDownloadPDF={app.handleDownloadCurrentPDF}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {app.showReplaceModal && app.selectedActivityForReplace && app.currentTrip && (
          <ReplaceActivityModal
            activity={app.selectedActivityForReplace}
            trip={app.currentTrip}
            onClose={() => {
              if (app.isReplacing) return;
              app.setShowReplaceModal(false);
              app.setSelectedActivityForReplace(null);
            }}
            onConfirmReplace={app.handleConfirmReplace}
            isLoading={app.isReplacing}
            errorMessage={app.replaceError}
          />
        )}
      </AnimatePresence>

      <AIConciergeDrawer
        isOpen={app.showAIConcierge}
        onClose={() => app.setShowAIConcierge(false)}
        trip={app.currentTrip}
      />

      <AnimatePresence>
        {app.showArchitectureModal && (
          <ArchitectureDocsModal onClose={() => app.setShowArchitectureModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
