export const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString + "T00:00:00");
  const parts = d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .split(" ");
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
};

//  Get minimum date

export const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

//  Get maximum date

export const getMaxDate = () => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  return maxDate.toISOString().split("T")[0];
};

// Get seat display label
export const getSeatLabel = (row, col) => {
  return `${row + 1}${String.fromCharCode(65 + col)}`;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
// Get default date
export const getDefaultDate = () => {
  const today = new Date();
  const day = today.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  return nextFriday.toISOString().split("T")[0];
};
