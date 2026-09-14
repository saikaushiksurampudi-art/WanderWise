import { useEffect, useRef, useState } from 'react';
import {
  ActivityItem,
  BookingRecord,
  CityTemplate,
  CheckoutFormData,
  InterestCategory,
  SavedPlace,
  TripFormData,
  TripPlan
} from '../types';
import { TabType } from '../components/Header';
import { api } from '../services/api';
import { generateTripPDF } from '../services/pdfGenerator';
import { CITY_TRIP_DEFAULTS, DEFAULT_PREVIEW_TRIP } from '../constants/tripDefaults';

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useWanderWise() {
  const [activeTab, setActiveTab] = useState<TabType>('planner');
  const [viewingTripPage, setViewingTripPage] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [plannerForm, setPlannerForm] = useState<TripFormData>(DEFAULT_PREVIEW_TRIP);
  const [templates, setTemplates] = useState<CityTemplate[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showAIConcierge, setShowAIConcierge] = useState(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);

  const [selectedActivityForReplace, setSelectedActivityForReplace] = useState<ActivityItem | null>(null);
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [replaceError, setReplaceError] = useState<string | null>(null);

  const generateRequestId = useRef(0);

  useEffect(() => {
    async function initData() {
      setIsBootstrapping(true);
      const [templatesResult, bookingsResult, savedResult] = await Promise.allSettled([
        api.getTemplates(),
        api.getBookings(),
        api.getSavedPlaces()
      ]);

      if (templatesResult.status === 'fulfilled') setTemplates(templatesResult.value);
      if (bookingsResult.status === 'fulfilled') setBookings(bookingsResult.value);
      if (savedResult.status === 'fulfilled') setSavedPlaces(savedResult.value);

      const failures = [templatesResult, bookingsResult, savedResult].filter(
        (r): r is PromiseRejectedResult => r.status === 'rejected'
      );
      if (failures.length > 0) {
        setErrorMessage(toErrorMessage(failures[0].reason, 'Some saved trips, bookings, or city templates could not be loaded.'));
      }

      setIsBootstrapping(false);
    }

    initData();
  }, []);

  const handleGenerateTrip = async (formData: TripFormData) => {
    const requestId = ++generateRequestId.current;
    setPlannerForm(formData);
    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const plan = await api.generateTrip(formData);
      if (requestId !== generateRequestId.current) return;
      setCurrentTrip(plan);
      setViewingTripPage(true);
    } catch (err) {
      if (requestId !== generateRequestId.current) return;
      setErrorMessage(toErrorMessage(err, 'Failed to generate itinerary. Please try again.'));
    } finally {
      if (requestId === generateRequestId.current) setIsGenerating(false);
    }
  };

  const handleSelectTemplate = async (template: CityTemplate) => {
    const formData: TripFormData = {
      destination: template.destination,
      startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      duration: template.duration,
      budget: template.baseBudget,
      travelers: template.travelers,
      interests: template.interests,
      accommodationType: 'Boutique Hotel',
      travelPace: 'balanced'
    };

    await handleGenerateTrip(formData);
  };

  const handleConfirmReplace = async (activityId: string, preferredCategory: InterestCategory) => {
    if (!currentTrip) return;
    setIsReplacing(true);
    setReplaceError(null);
    try {
      const updatedTrip = await api.replaceActivity(currentTrip, activityId, preferredCategory);
      setCurrentTrip(updatedTrip);
      setShowReplaceModal(false);
      setSelectedActivityForReplace(null);
      setSuccessMessage('Activity replaced with a budget-friendly alternative.');
    } catch (err) {
      setReplaceError(toErrorMessage(err, 'Could not replace that activity. Try another category.'));
    } finally {
      setIsReplacing(false);
    }
  };

  const handleToggleSavePlace = async (place: ActivityItem | SavedPlace) => {
    const savedPlace: SavedPlace = 'city' in place
      ? place
      : {
          id: place.id,
          title: place.title,
          category: place.category,
          city: currentTrip?.destination || 'Travel Spot',
          cost: place.cost,
          rating: place.rating,
          reason: place.reason,
          imageUrl: place.imageUrl,
          lat: place.location.lat,
          lng: place.location.lng,
          addedAt: new Date().toISOString()
        };

    try {
      const res = await api.toggleSavedPlace(savedPlace);
      setSavedPlaces(res.data);
    } catch (err) {
      setErrorMessage(toErrorMessage(err, 'Could not update your saved places.'));
    }
  };

  const handleProcessCheckout = async (checkoutData: CheckoutFormData) => {
    if (!currentTrip) return;
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const result = await api.processCheckout(currentTrip, checkoutData);
      setLatestBooking(result.booking);
      setBookings(prev => [result.booking, ...prev]);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setCheckoutError(toErrorMessage(err, 'Payment could not be processed. Please try again.'));
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleDownloadCurrentPDF = () => {
    if (!currentTrip) {
      setErrorMessage('Generate an itinerary before downloading a PDF.');
      return;
    }
    try {
      generateTripPDF(currentTrip, latestBooking || undefined);
    } catch (err) {
      setErrorMessage(toErrorMessage(err, 'Could not generate the itinerary PDF.'));
    }
  };

  const handlePlanTripToCity = (city: string) => {
    handleGenerateTrip({
      ...CITY_TRIP_DEFAULTS,
      destination: city
    });
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'architecture') {
      setShowArchitectureModal(true);
      return;
    }
    setViewingTripPage(false);
    setActiveTab(tab);
  };

  const handleOpenTripPage = () => setViewingTripPage(true);
  const handleCloseTripPage = () => setViewingTripPage(false);

  const savedPlaceIds = savedPlaces.map(p => p.id);

  return {
    activeTab,
    viewingTripPage,
    currentTrip,
    plannerForm,
    templates,
    bookings,
    savedPlaces,
    isBootstrapping,
    isGenerating,
    isCheckingOut,
    isReplacing,
    showCheckoutModal,
    showSuccessModal,
    showReplaceModal,
    showAIConcierge,
    showArchitectureModal,
    selectedActivityForReplace,
    latestBooking,
    errorMessage,
    successMessage,
    checkoutError,
    replaceError,
    savedPlaceIds,
    setShowCheckoutModal,
    setShowSuccessModal,
    setShowReplaceModal,
    setShowAIConcierge,
    setShowArchitectureModal,
    setSelectedActivityForReplace,
    setErrorMessage,
    setSuccessMessage,
    setCheckoutError,
    setReplaceError,
    setActiveTab,
    handleTabChange,
    handleOpenTripPage,
    handleCloseTripPage,
    handleGenerateTrip,
    handleSelectTemplate,
    handleConfirmReplace,
    handleToggleSavePlace,
    handleProcessCheckout,
    handleDownloadCurrentPDF,
    handlePlanTripToCity
  };
}
