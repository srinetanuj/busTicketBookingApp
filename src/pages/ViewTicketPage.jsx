import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetBooking } from "../store/bookingSlice";
import { getBookingDetails } from "../services/busService";
import { Header } from "../components/Header";
import { LoadingSpinner, ErrorMessage } from "../components/index";
import { formatCurrency, formatDate } from "../utils/helpers";

const ViewTicketPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookingDetails } = useSelector((state) => state.booking);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let stored = bookingDetails;
        if (!stored) {
          stored = await getBookingDetails();
        }
        if (!stored) {
          setError("No booking found. Please make a booking first.");
          return;
        }
        setTicket(stored);
      } catch (err) {
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookingDetails]);

  const handleNewBooking = () => {
    dispatch(resetBooking());
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Your Ticket" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSpinner message="Loading ticket..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Your Ticket" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={error} />
          <div className="mt-4">
            <button
              onClick={handleNewBooking}
              className="bg-blue-600 text-white py-2 px-3 rounded"
            >
              Start New Booking
            </button>
          </div>
        </main>
      </div>
    );
  }

  const bus = ticket?.bus || {};
  const totalFare = ticket?.totalFare || 0;
  const finalTotal = totalFare;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      <Header title="Your Ticket" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 w-full">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 md:p-12">
            <div className="text-center">
              <div className="text-5xl mb-2">✓</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Booking Confirmed
              </h2>
              <p className="text-blue-100 text-base md:text-lg">
                Your ticket has been successfully booked
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-8 md:px-12 py-6 border-b-2 border-blue-100">
            <p className="text-sm text-gray-600 mb-2">Ticket ID</p>
            <p className="text-3xl md:text-5xl font-bold text-blue-600 tracking-widest">
              {ticket?.ticketId}
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 items-center">
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  From
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {bus.fromCity}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  To
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {bus.toCity}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-8 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">
                    Bus Name
                  </p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {bus.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {formatDate(ticket?.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">
                    Departure
                  </p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {bus.departureTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">
                    Arrival
                  </p>
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {bus.arrivalTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs text-gray-600 mb-3 font-semibold uppercase tracking-wide">
                Seats Booked
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(ticket?.selectedSeats) &&
                  ticket.selectedSeats.map((seat) => {
                    const row = (seat.row ?? 0) + 1;
                    const col = String.fromCharCode(65 + (seat.col ?? 0));
                    return (
                      <span
                        key={seat.seatNumber ?? `${row}${col}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded font-semibold text-sm"
                      >
                        {row}
                        {col}
                      </span>
                    );
                  })}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-xs text-gray-600 mb-4 font-semibold uppercase tracking-wide">
                Contact & Passenger Information
              </p>

              {ticket?.contactInfo && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                    Contact Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">
                        {ticket.contactInfo.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">
                        {ticket.contactInfo.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-600 mb-3 font-semibold uppercase tracking-wide">
                  Passengers
                </p>
                <div className="space-y-3">
                  {Array.isArray(ticket?.passengerInfo) &&
                  ticket.passengerInfo.length > 0 ? (
                    ticket.passengerInfo.map((p, i) => (
                      <div
                        key={i}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1 font-semibold">
                              Name
                            </p>
                            <p className="font-semibold text-gray-900">
                              {p.firstName} {p.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1 font-semibold">
                              Age
                            </p>
                            <p className="font-semibold text-gray-900">
                              {p.age}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1 font-semibold">
                              Gender
                            </p>
                            <p className="font-semibold text-gray-900">
                              {p.gender}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No passenger information available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-6 bg-gradient-to-r from-blue-50 to-gray-50 p-6 md:p-8 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    Base Fare ({(ticket?.selectedSeats || []).length} seats)
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totalFare)}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Total Amount Paid
                  </span>
                  <span className="text-3xl font-bold text-blue-600">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewBooking}
          className="w-full max-w-5xl mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg print:hidden"
        >
          Book Another Ticket
        </button>
      </main>
    </div>
  );
};

export default ViewTicketPage;
