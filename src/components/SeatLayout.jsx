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
    <div className="bg-white border border-gray-200 p-4">
      <div className="mb-4 flex gap-4 justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 border border-gray-300 rounded"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 border border-blue-600 rounded"></div>
          <span className="text-sm text-gray-700">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-200 border border-red-400 rounded"></div>
          <span className="text-sm text-gray-700">Booked</span>
        </div>
      </div>

      <div className="space-y-2 flex flex-col items-center">
        {rows.map((row) => (
          <div key={row} className="flex gap-2 items-center">
            <span className="w-5 text-center text-xs font-semibold text-gray-600">
              {parseInt(row) + 1}
            </span>
            <div className="flex gap-2">
              {seatsByRow[row].map((seat) => {
                const isSelected = isSeatSelected(seat.seatNumber);
                const isBooked = seat.isBooked;

                let seatClass = "w-5 h-5 border rounded cursor-pointer ";

                if (isBooked) {
                  seatClass +=
                    "bg-red-200 border-red-400 cursor-not-allowed opacity-50";
                } else if (isSelected) {
                  seatClass += "bg-blue-500 border-blue-600";
                } else {
                  seatClass += "bg-gray-200 border-gray-300";
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
            <span className="w-5 text-center text-xs font-semibold text-gray-600">
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
