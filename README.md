# Bus Ticket Booking App

A React-based bus booking app with seat selection, passenger details, and ticket confirmation.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Design

- **Frontend:** React + Tailwind CSS
- **State:** Redux Toolkit (centralized)
- **Storage:** Browser localStorage
- **Routing:** React Router
- **Key:** Single contact per booking, max 4 seats, auto-clear error (5 sec)

## Dummy Data

**10 Cities:** Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, Lucknow

**Seat Layout:** 7 cols × 6 rows = 42 seats

## Booking Flow

1. Search: Delhi → Mumbai → Date (default Friday) → "Search Buses"
2. Results: View buses (date shown on each card)
3. Seats: Select up to 4 → Error on 5th → Auto-clears 5 sec
4. Passenger: Contact (email/phone) + 4 Passengers (name/age/gender each)
5. Review: Verify all (contact once, no duplicate)
6. Confirm: Get Ticket ID (BUS{timestamp}{random}) → Saved in localStorage
7. Book Again: Reset & start new

## File Structure

```
src/
├── pages/
│   ├── HomePage.jsx              # Search form
│   ├── SearchDetailsPage.jsx     # Bus results (date displayed)
│   ├── SeatSelectionPage.jsx     # Seat grid (max 4, error auto-clear)
│   ├── PassengerInfoPage.jsx     # Contact + 4 passengers form
│   ├── ReviewTicketPage.jsx      # Final review & validation
│   └── ViewTicketPage.jsx        # Confirmed ticket
├── components/
│   ├── BusCard.jsx               # Bus result card
│   ├── Header.jsx                # Navigation header
│   ├── SeatLayout.jsx            # Seat grid
│   ├── TicketSummary.jsx         # Booking summary
│   └── index.js                  # Exports
├── store/
│   ├── bookingSlice.js           # Booking state
│   ├── busSlice.js               # Bus state
│   └── index.js                  # Store config
├── services/
│   └── busService.js             # Cities, buses, functions
├── utils/
│   └── helpers.js                # Date, currency, validation
└── App.jsx, index.jsx            # App setup
```

## Features

- Search buses by city & date (default: upcoming Friday)
- Max 4 seats/booking with auto-clear error
- One contact (email/phone) per booking
- Per-passenger details (name, age, gender)
- Real-time fare calculation
- Unique ticket ID generation
- localStorage booking persistence

**Srinetanuj** - [GitHub Profile](https://github.com/srinetanuj)

## Repository

- **GitHub:** https://github.com/srinetanuj/busTicketBookingApp
- **Live App:** https://bus-ticket-booking-app01.vercel.app/
