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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Your Ticket" />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl min-h-[80vh] bg-white border border-gray-200 overflow-auto">
          <div className="bg-blue-600 text-white p-8">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-1">
                ✓ Booking Confirmed
              </h2>
              <p className="text-blue-100 text-base md:text-lg">
                Your ticket has been successfully booked
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-10 py-6 border-b border-dashed border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Ticket ID</p>
            <p className="text-3xl md:text-4xl font-bold text-gray-900 tracking-widest">
              {ticket?.ticketId}
            </p>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 items-center">
              <div>
                <p className="text-sm text-gray-600 mb-2">From</p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  {bus.fromCity}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
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
              <div>
                <p className="text-sm text-gray-600 mb-2">To</p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  {bus.toCity}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-8 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    BUS NAME
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bus.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    JOURNEY DATE
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(ticket?.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    DEPARTURE
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bus.departureTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    ARRIVAL
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bus.arrivalTime}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 mb-6">
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  SEATS BOOKED
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

              <div className="bg-gray-50 p-4 mb-6">
                <p className="text-xs text-gray-600 mb-3 font-semibold">
                  BOOKING & PASSENGER INFORMATION
                </p>

                {ticket?.contactInfo && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">
                      CONTACT INFORMATION
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Email:{" "}
                      <span className="font-semibold text-gray-900">
                        {ticket.contactInfo.email}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone:{" "}
                      <span className="font-semibold text-gray-900">
                        {ticket.contactInfo.phone}
                      </span>
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-600 mb-3 font-semibold">
                    PASSENGERS
                  </p>
                  <div className="space-y-3">
                    {Array.isArray(ticket?.passengerInfo) &&
                    ticket.passengerInfo.length > 0 ? (
                      ticket.passengerInfo.map((p, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white border rounded grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Name</p>
                            <p className="font-semibold text-gray-900">
                              {p.firstName} {p.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Age</p>
                            <p className="font-semibold text-gray-900">
                              {p.age}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Gender</p>
                            <p className="font-semibold text-gray-900">
                              {p.gender}
                            </p>
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
            </div>

            <div className="border-t border-gray-300 pt-6 bg-blue-50 p-4">
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    Base Fare ({(ticket?.selectedSeats || []).length} seats)
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totalFare)}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">
                    Total Amount Paid
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mt-6 space-y-3 print:hidden">
          <button
            onClick={handleNewBooking}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-3 rounded"
          >
            Book Another Ticket
          </button>
        </div>
      </main>
    </div>
  );
};

export default ViewTicketPage;
