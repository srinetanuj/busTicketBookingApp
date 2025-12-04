import { formatCurrency } from "../utils/helpers";

export const BusCard = ({ bus, onSelectSeats }) => {
  return (
    <div className="bg-white border border-gray-200 p-4 mb-4">
      <div className="mb-3 text-right">
        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
          Date: {bus.date}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {bus.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">{bus.busType}</span>
          </p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm font-medium">{bus.rating}</span>
            <span className="text-gray-500 text-xs ml-1">
              ({bus.reviews} reviews)
            </span>
          </div>
        </div>

        <div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {bus.departureTime}
            </p>
            <p className="text-xs text-gray-500 mb-2">Departure</p>
            <div className="flex items-center justify-center text-gray-400 mb-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500">{bus.duration}</p>
          </div>
          <div className="text-center mt-2">
            <p className="text-2xl font-bold text-gray-900">
              {bus.arrivalTime}
            </p>
            <p className="text-xs text-gray-500">Arrival</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-1">
            {bus.amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold text-green-600">
              {bus.availableSeats}
            </span>{" "}
            seats available
          </p>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(bus.pricePerSeat)}
            </p>
            <p className="text-xs text-gray-500">per seat</p>
          </div>
          <button
            onClick={() => onSelectSeats(bus)}
            className="mt-3 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Select Seats
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
