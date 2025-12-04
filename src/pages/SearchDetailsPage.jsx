import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { filterBuses, getBusById } from "../services/busService";
import {
  setBuses,
  setSelectedBus,
  setLoading,
  setError,
} from "../store/busSlice";
import { Header } from "../components/Header";
import { BusCard } from "../components/BusCard";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/index";

const SearchDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchCriteria, buses, loading, error } = useSelector(
    (state) => state.bus
  );

  const fetchBuses = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const filteredBuses = await filterBuses(
        searchCriteria.fromCity,
        searchCriteria.toCity,
        searchCriteria.date
      );
      dispatch(setBuses(filteredBuses));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError("Failed to fetch buses. Please try again."));
    } finally {
      dispatch(setLoading(false));
    }
  }, [
    dispatch,
    searchCriteria.fromCity,
    searchCriteria.toCity,
    searchCriteria.date,
  ]);

  useEffect(() => {
    if (
      searchCriteria.fromCity &&
      searchCriteria.toCity &&
      searchCriteria.date
    ) {
      fetchBuses();
    } else {
      navigate("/");
    }
  }, [
    fetchBuses,
    navigate,
    searchCriteria.fromCity,
    searchCriteria.toCity,
    searchCriteria.date,
  ]);

  const handleSelectSeats = async (bus) => {
    try {
      const fullBusData = await getBusById(bus.id);
      dispatch(setSelectedBus(fullBusData));
      navigate(`/seat-selection/${bus.id}`);
    } catch (err) {
      dispatch(setError("Failed to select bus. Please try again."));
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Search Results" showBackButton onBack={handleBack} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSpinner message="Finding available buses..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Search Results" showBackButton onBack={handleBack} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && <ErrorMessage message={error} onRetry={fetchBuses} />}

        <div className="bg-white border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {searchCriteria.fromCity} → {searchCriteria.toCity}
          </h2>
          <p className="text-gray-600 text-sm">
            Date:{" "}
            {new Date(searchCriteria.date + "T00:00:00").toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </div>

        {buses.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {buses.length} buses available
            </h3>
            {buses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                onSelectSeats={handleSelectSeats}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No buses found"
            message="Sorry, no buses are available for your selected route and date. Please try a different search."
            icon="🚌"
          />
        )}
      </main>
    </div>
  );
};

export default SearchDetailsPage;
