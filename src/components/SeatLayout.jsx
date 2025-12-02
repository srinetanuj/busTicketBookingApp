// SeatLayout Component

import { getSeatLabel } from "../utils/helpers";

export const SeatLayout = ({
  seats,
  selectedSeats,
  onSeatSelect,
  onSeatDeselect,
}) => {
  const seatsByRow = {};
  seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  const rows = Object.keys(seatsByRow).sort((a, b) => a - b);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    const isSelected = selectedSeats.some(
      (s) => s.seatNumber === seat.seatNumber
    );
    if (isSelected) {
      onSeatDeselect(seat.seatNumber);
    } else {
      onSeatSelect(seat);
    }
  };

  const isSeatSelected = (seatNumber) => {
    return selectedSeats.some((s) => s.seatNumber === seatNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 flex gap-4 justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded"></div>
          <span className="text-sm text-gray-700">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-200 border-2 border-red-400 rounded cursor-not-allowed"></div>
          <span className="text-sm text-gray-700">Booked</span>
        </div>
      </div>

      <div className="space-y-3 flex flex-col items-center">
        {rows.map((row) => (
          <div key={row} className="flex gap-2 items-center">
            <span className="w-6 text-center text-sm font-semibold text-gray-600">
              {parseInt(row) + 1}
            </span>
            <div className="flex gap-2">
              {seatsByRow[row].map((seat) => {
                const isSelected = isSeatSelected(seat.seatNumber);
                const isBooked = seat.isBooked;

                let seatClass =
                  "w-6 h-6 border-2 rounded cursor-pointer transition-all ";

                if (isBooked) {
                  seatClass +=
                    "bg-red-200 border-red-400 cursor-not-allowed opacity-50";
                } else if (isSelected) {
                  seatClass += "bg-blue-500 border-blue-600 hover:bg-blue-600";
                } else {
                  seatClass += "bg-gray-200 border-gray-300 hover:bg-gray-300";
                }

                return (
                  <button
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(seat)}
                    disabled={isBooked}
                    className={seatClass}
                    title={getSeatLabel(seat.row, seat.col)}
                  >
                    {isSelected && (
                      <span className="text-white text-xs flex items-center justify-center h-full">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <span className="w-6 text-center text-sm font-semibold text-gray-600">
              {parseInt(row) + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block border-t-4 border-gray-400 w-32 pt-2 text-xs text-gray-500 font-semibold">
          SCREEN
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
