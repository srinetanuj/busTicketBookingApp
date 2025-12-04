import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setBookingDetails, setLoading, setError } from "../store/bookingSlice";
import { saveBookingDetails } from "../services/busService";
import { Header } from "../components/Header";
import { TicketSummary } from "../components/TicketSummary";
import { LoadingSpinner, ErrorMessage } from "../components/index";

const ReviewTicketPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedBus } = useSelector((state) => state.bus);
  const { selectedSeats, totalFare, passengerInfo, contactInfo, loading } =
    useSelector((state) => state.booking);
  const [processingError, setProcessingError] = useState(null);

  const passengerArrayValid =
    Array.isArray(passengerInfo) &&
    passengerInfo.length === selectedSeats.length &&
    passengerInfo.every(
      (p) => p && p.firstName && p.lastName && p.age && p.gender
    );
  const contactValid = contactInfo && contactInfo.email && contactInfo.phone;
  if (
    !selectedBus ||
    selectedSeats.length === 0 ||
    !passengerArrayValid ||
    !contactValid
  ) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Review Ticket" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message="Please complete all booking steps before reviewing." />
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white font-semibold py-2 px-3 rounded"
          >
            Start New Search
          </button>
        </main>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    try {
      setProcessingError(null);
      dispatch(setLoading(true));

      const bookingData = {
        bus: selectedBus,
        selectedSeats,
        totalFare,
        passengerInfo,
        contactInfo,
        date: selectedBus.date,
      };

      const confirmationData = await saveBookingDetails(bookingData);
      dispatch(setBookingDetails(confirmationData));
      navigate("/view-ticket");
    } catch (err) {
      setProcessingError("Failed to confirm booking. Please try again.");
      dispatch(setError("Failed to confirm booking"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Review Ticket" showBackButton onBack={handleBack} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSpinner message="Processing your booking..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Review Your Booking" showBackButton onBack={handleBack} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {processingError && <ErrorMessage message={processingError} />}

        <TicketSummary
          bookingData={{
            selectedSeats,
            totalFare,
            passengerInfo,
            date: selectedBus.date,
          }}
          bus={selectedBus}
        />

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={handleBack}
            className="bg-gray-200 text-gray-900 font-semibold py-2 px-3 rounded"
          >
            Back
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReviewTicketPage;
