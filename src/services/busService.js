// Hardcoded cities data
export const cities = [
  { id: 1, name: "Mumbai", code: "BOM" },
  { id: 2, name: "Delhi", code: "DEL" },
  { id: 3, name: "Bengaluru", code: "BLR" },
  { id: 4, name: "Chennai", code: "MAA" },
  { id: 5, name: "Kolkata", code: "CCU" },
  { id: 6, name: "Hyderabad", code: "HYD" },
  { id: 7, name: "Pune", code: "PNQ" },
  { id: 8, name: "Ahmedabad", code: "AMD" },
  { id: 9, name: "Jaipur", code: "JAI" },
  { id: 10, name: "Lucknow", code: "LKO" },
];

// Hardcoded buses data
export const buses = [
  {
    id: 1,
    name: "Mumbai Express",
    fromCity: "Mumbai",
    toCity: "Pune",
    departureTime: "08:00",
    arrivalTime: "11:00",
    duration: "3h",
    pricePerSeat: 400,
    totalSeats: 42,
    availableSeats: 18,
    amenities: ["AC", "Charging"],
    busType: "Seater",
    rating: 4.5,
    reviews: 245,
    date: "2025-12-10",
  },
  {
    id: 2,
    name: "Delhi Superfast",
    fromCity: "Delhi",
    toCity: "Jaipur",
    departureTime: "07:00",
    arrivalTime: "11:30",
    duration: "4h 30m",
    pricePerSeat: 550,
    totalSeats: 36,
    availableSeats: 8,
    amenities: ["AC", "WiFi"],
    busType: "Seater",
    rating: 4.3,
    reviews: 189,
    date: "2025-12-10",
  },
  {
    id: 3,
    name: "Bengaluru Nightliner",
    fromCity: "Bengaluru",
    toCity: "Chennai",
    departureTime: "22:00",
    arrivalTime: "06:00",
    duration: "8h",
    pricePerSeat: 700,
    totalSeats: 48,
    availableSeats: 25,
    amenities: ["WiFi", "AC", "Meal"],
    busType: "Sleeper",
    rating: 4.1,
    reviews: 156,
    date: "2025-12-11",
  },
  {
    id: 4,
    name: "Kolkata Comfort",
    fromCity: "Kolkata",
    toCity: "Hyderabad",
    departureTime: "09:00",
    arrivalTime: "21:00",
    duration: "12h",
    pricePerSeat: 900,
    totalSeats: 42,
    availableSeats: 12,
    amenities: ["WiFi", "AC"],
    busType: "Seater",
    rating: 4.4,
    reviews: 212,
    date: "2025-12-12",
  },
  {
    id: 5,
    name: "Lucknow Night Service",
    fromCity: "Lucknow",
    toCity: "Delhi",
    departureTime: "20:00",
    arrivalTime: "04:00",
    duration: "8h",
    pricePerSeat: 650,
    totalSeats: 42,
    availableSeats: 5,
    amenities: ["AC", "Charging"],
    busType: "Sleeper",
    rating: 4.6,
    reviews: 298,
    date: "2025-12-11",
  },
  {
    id: 6,
    name: "Ahmedabad Express",
    fromCity: "Ahmedabad",
    toCity: "Mumbai",
    departureTime: "07:00",
    arrivalTime: "15:30",
    duration: "8h 30m",
    pricePerSeat: 800,
    totalSeats: 36,
    availableSeats: 22,
    amenities: ["AC", "WiFi"],
    busType: "Seater",
    rating: 4.2,
    reviews: 134,
    date: "2025-12-12",
  },
  {
    id: 7,
    name: "Delhi - Patna Superfast",
    fromCity: "Delhi",
    toCity: "Patna",
    departureTime: "18:00",
    arrivalTime: "06:00",
    duration: "12h",
    pricePerSeat: 900,
    totalSeats: 42,
    availableSeats: 30,
    amenities: ["AC", "WiFi", "Charging"],
    busType: "Sleeper",
    rating: 4.4,
    reviews: 98,
    date: "2025-12-13",
  },
  {
    id: 8,
    name: "Delhi - Mumbai Overnight",
    fromCity: "Delhi",
    toCity: "Mumbai",
    departureTime: "21:00",
    arrivalTime: "09:00",
    duration: "12h",
    pricePerSeat: 1200,
    totalSeats: 48,
    availableSeats: 40,
    amenities: ["AC", "WiFi", "Meal"],
    busType: "Sleeper",
    rating: 4.7,
    reviews: 210,
    date: "2025-12-13",
  },
];
// Booked seats data
const bookedSeatsMap = {
  1: [2, 5, 8, 12, 15, 21, 28, 35, 40],
  2: [1, 3, 6, 14],
  3: [7, 9, 16, 22],
  4: [4, 10, 20],
  5: [11, 13, 19],
  6: [2, 17, 24],
  7: [3, 4, 5],
  8: [1, 2],
};

//  Get all available cities

export const getCities = async () => {
  return cities;
};
// Filter buses
export const filterBuses = async (fromCity, toCity, date) => {
  // (no artificial delay)

  const filtered = buses
    .filter((bus) => bus.fromCity === fromCity && bus.toCity === toCity)
    .filter(
      (bus) =>
        bus.date === date || (fromCity === "Delhi" && toCity === "Mumbai")
    );

  // If the route is Delhi->Mumbai, show the bus for the searched date
  const mapped = filtered.map((bus) => {
    if (fromCity === "Delhi" && toCity === "Mumbai") {
      return { ...bus, date };
    }
    return bus;
  });

  return mapped;
};
// Get Seat Layout
export const getSeatLayout = async (busId) => {
  const bus = buses.find((b) => b.id === parseInt(busId));
  if (!bus) return [];

  // Determine rows/columns based on totalSeats (fallback to 6x7)
  const seats = [];
  const totalSeats = bus.totalSeats || 42;
  const seatsPerRow = 7;
  const bookedSeats = bookedSeatsMap[bus.id] || [];

  for (let i = 0; i < totalSeats; i++) {
    const seatNumber = i + 1;
    const row = Math.floor(i / seatsPerRow);
    const col = i % seatsPerRow;
    seats.push({
      seatNumber,
      row,
      col,
      isBooked: bookedSeats.includes(seatNumber),
      price: bus.pricePerSeat,
    });
  }
  return seats;
};
// Get Bus by ID
export const getBusById = async (busId) => {
  return buses.find((bus) => bus.id === parseInt(busId));
};
