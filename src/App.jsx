import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchDetailsPage from "./pages/SearchDetailsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PassengerInfoPage from "./pages/PassengerInfoPage";
import ReviewTicketPage from "./pages/ReviewTicketPage";
import ViewTicketPage from "./pages/ViewTicketPage";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search-results" element={<SearchDetailsPage />} />
        <Route path="/seat-selection/:busId" element={<SeatSelectionPage />} />
        <Route path="/passenger-info" element={<PassengerInfoPage />} />
        <Route path="/review-ticket" element={<ReviewTicketPage />} />
        <Route path="/view-ticket" element={<ViewTicketPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
