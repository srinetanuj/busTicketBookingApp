// TicketSummary Component

import { formatCurrency, formatDate } from "../utils/helpers";

export const TicketSummary = ({ bookingData, bus }) => {
  if (!bookingData || !bus) {
    return (
      <div className="text-center text-gray-500">
        Loading ticket information...
      </div>
    );
  }

  const totalFare = bookingData.totalFare || 0;
  const finalTotal = totalFare;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Route Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">From</p>
            <p className="text-lg font-semibold text-gray-900">
              {bus.fromCity}
            </p>
          </div>
          <div className="flex items-end justify-center mb-2">
            <svg
              className="w-6 h-6 text-gray-400"
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
            <p className="text-sm text-gray-600">To</p>
            <p className="text-lg font-semibold text-gray-900">{bus.toCity}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Bus Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Bus Name</p>
            <p className="font-semibold text-gray-900">{bus.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold text-gray-900">
              {formatDate(bookingData.date)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Departure</p>
            <p className="font-semibold text-gray-900">{bus.departureTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Arrival</p>
            <p className="font-semibold text-gray-900">{bus.arrivalTime}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Seat Information
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Seats Selected:{" "}
          <span className="font-semibold text-gray-900">
            {bookingData.selectedSeats.length}
          </span>
        </p>
        <div className="bg-gray-50 p-3 mb-3">
          <p className="text-sm text-gray-700">
            {bookingData.selectedSeats
              .map((seat) => {
                const row = seat.row + 1;
                const col = String.fromCharCode(65 + seat.col);
                return `${row}${col}`;
              })
              .join(", ")}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Passenger Details
        </h3>

        {bookingData.contactInfo && (
          <div className="mb-3 p-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Contact Email:{" "}
              <span className="font-semibold text-gray-900">
                {bookingData.contactInfo.email}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Contact Phone:{" "}
              <span className="font-semibold text-gray-900">
                {bookingData.contactInfo.phone}
              </span>
            </p>
          </div>
        )}

        <div className="space-y-4 text-sm">
          {Array.isArray(bookingData.passengerInfo) &&
          bookingData.passengerInfo.length > 0 ? (
            bookingData.passengerInfo.map((p, i) => (
              <div key={i} className="border rounded p-3">
                <p className="font-semibold">Passenger {i + 1}</p>
                <p className="text-gray-600">
                  Name:{" "}
                  <span className="font-semibold text-gray-900 ml-2">
                    {p.firstName} {p.lastName}
                  </span>
                </p>
                <p className="text-gray-600">
                  Age:{" "}
                  <span className="font-semibold text-gray-900 ml-2">
                    {p.age}
                  </span>
                </p>
                <p className="text-gray-600">
                  Gender:{" "}
                  <span className="font-semibold text-gray-900 ml-2">
                    {p.gender}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No passenger details provided.</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Fare Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              Base Fare ({bookingData.selectedSeats.length} seats)
            </span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalFare)}
            </span>
          </div>
          <div className="border-t border-blue-200 pt-2 flex justify-between">
            <span className="font-semibold text-gray-900">Total Amount</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;
