// View Ticket Page - Displays the final confirmed ticket

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
  const [displayBooking, setDisplayBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookingDetails = async () => {
      try {
        setLoading(true);

        if (bookingDetails) {
          setDisplayBooking(bookingDetails);
        } else {
          const booking = await getBookingDetails();
          if (booking) {
            setDisplayBooking(booking);
          }
        }
      } catch (err) {
        console.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    loadBookingDetails();
  }, [bookingDetails]);

  const handleNewBooking = () => {
    dispatch(resetBooking());
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Your Ticket" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner message="Loading your ticket..." />
        </main>
      </div>
    );
  }

  if (!displayBooking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Your Ticket" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message="Booking details not found" />
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Book a New Ticket
          </button>
        </main>
      </div>
    );
  }

  const ticket = displayBooking;
  const bus = ticket.bus;
  const totalFare = ticket.totalFare || 0;
  const finalTotal = totalFare;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Your Ticket" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">✓ Booking Confirmed</h2>
              <p className="text-blue-100">
                Your ticket has been successfully booked
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-b-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Ticket ID</p>
            <p className="text-2xl font-bold text-gray-900 tracking-widest">
              {ticket.ticketId}
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <p className="text-sm text-gray-600 mb-2">From</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bus.fromCity}
                </p>
              </div>
              <div className="flex items-end justify-center mb-2">
                <svg
                  className="w-8 h-8 text-gray-400"
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
                <p className="text-2xl font-bold text-gray-900">{bus.toCity}</p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-8 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                    {formatDate(ticket.date)}
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

              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  SEATS BOOKED
                </p>
                <div className="flex flex-wrap gap-2">
                  {ticket.selectedSeats.map((seat) => {
                    const row = seat.row + 1;
                    const col = String.fromCharCode(65 + seat.col);
                    return (
                      <span
                        key={seat.seatNumber}
                        className="bg-blue-500 text-white px-3 py-1 rounded font-semibold text-sm"
                      >
                        {row}
                        {col}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-xs text-gray-600 mb-4 font-semibold">
                  BOOKING & PASSENGER INFORMATION
                </p>

                {ticket.contactInfo && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
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
                    {Array.isArray(ticket.passengerInfo) &&
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

            <div className="border-t border-gray-300 pt-8 bg-blue-50 rounded-lg p-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    Base Fare ({ticket.selectedSeats.length} seats)
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

        <div className="mt-8 space-y-4 print:hidden">
          <button
            onClick={handleNewBooking}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all"
          >
            Book Another Ticket
          </button>
        </div>
      </main>
    </div>
  );
};

export default ViewTicketPage;
