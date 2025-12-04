import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchCriteria } from "../store/busSlice";
import { Header } from "../components/Header";
import { LoadingSpinner, ErrorMessage } from "../components/index";
import { getMinDate, getMaxDate, getDefaultDate } from "../utils/helpers";
import { getCities } from "../services/busService";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    date: getDefaultDate(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoading(true);
      const citiesList = await getCities();
      setCities(citiesList);
      setError(null);
    } catch (err) {
      setError("Failed to load cities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fromCity) errors.fromCity = "Please select departure city";
    if (!formData.toCity) errors.toCity = "Please select destination city";
    if (!formData.date) errors.date = "Please select a date";
    if (formData.fromCity === formData.toCity && formData.fromCity) {
      errors.toCity = "Departure and destination must be different";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(setSearchCriteria(formData));
      navigate("/search-results");
    }
  };

  if (loading) return <LoadingSpinner message="Loading cities..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Bus Ticket Booking" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {error && <ErrorMessage message={error} onRetry={loadCities} />}

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Book Your Bus Ticket
          </h2>
        </div>

        <div className="bg-white border border-gray-200 p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From City
                </label>
                <select
                  name="fromCity"
                  value={formData.fromCity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors.fromCity ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {formErrors.fromCity && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.fromCity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To City
                </label>
                <select
                  name="toCity"
                  value={formData.toCity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors.toCity ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {formErrors.toCity && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.toCity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Journey Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.date && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 px-6 rounded"
            >
              Search Buses
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
