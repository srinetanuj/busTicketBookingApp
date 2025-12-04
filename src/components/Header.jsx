export const Header = ({ title, showBackButton, onBack }) => {
  return (
    <header className="bg-gray-900 text-white border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button onClick={onBack} className="bg-gray-800 p-2 rounded">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-bold">🚌 {title}</h1>
          </div>
          <div className="text-sm text-gray-400">Bus Ticket Booking</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
