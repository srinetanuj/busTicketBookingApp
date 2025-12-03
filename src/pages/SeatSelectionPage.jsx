// Seat Selection Page

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSeatLayout } from "../services/busService";
import { addSeat, removeSeat } from "../store/bookingSlice";
import { Header } from "../components/Header";
import { SeatLayout } from "../components/SeatLayout";
import { LoadingSpinner, ErrorMessage } from "../components/index";
import { formatCurrency } from "../utils/helpers";

const SeatSelectionPage = () => {
  const navigate = useNavigate();
  const { busId } = useParams();
  const dispatch = useDispatch();
  const { selectedBus } = useSelector((state) => state.bus);
  const { selectedSeats, totalFare } = useSelector((state) => state.booking);

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    if (!selectedBus) {
      navigate("/");
      return;
    }

    const fetchSeats = async () => {
      try {
        setLoading(true);
        const seatsData = await getSeatLayout(parseInt(busId));
        setSeats(seatsData);
        setError(null);
      } catch (err) {
        setError("Failed to load seats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [selectedBus, busId, navigate]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.length >= 4) {
      setError("You can book a maximum of 4 tickets at a time");
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
      return;
    }
    setError(null);
    dispatch(addSeat(seat));
  };

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  const handleSeatDeselect = (seatNumber) => {
    dispatch(removeSeat(seatNumber));
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }
    navigate("/passenger-info");
  };

  const handleBack = () => {
    navigate("/search-results");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Select Seats" showBackButton onBack={handleBack} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner message="Loading seat layout..." />
        </main>
      </div>
    );
  }

  if (!selectedBus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Select Seats" showBackButton onBack={handleBack} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message="Bus information not found" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Select Your Seats" showBackButton onBack={handleBack} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SeatLayout
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              onSeatDeselect={handleSeatDeselect}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fare Summary
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Bus</p>
              <p className="font-semibold text-gray-900">{selectedBus.name}</p>
              <p className="text-xs text-gray-600 mt-2">
                {selectedBus.departureTime} - {selectedBus.arrivalTime}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Selected Seats ({selectedSeats.length})
              </p>
              {selectedSeats.length > 0 ? (
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => {
                      const row = seat.row + 1;
                      const col = String.fromCharCode(65 + seat.col);
                      return (
                        <span
                          key={seat.seatNumber}
                          className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-semibold"
                        >
                          {row}
                          {col}
                        </span>
                      );
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No seats selected
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Price per seat</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(selectedBus.pricePerSeat)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Number of seats</span>
                <span className="font-semibold text-gray-900">
                  {selectedSeats.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(totalFare)}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalFare)}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-2"
            >
              Continue to Passenger Details
            </button>
            <button
              onClick={handleBack}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatSelectionPage;
