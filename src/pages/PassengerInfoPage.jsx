// Passenger Information Page

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPassengerInfoArray, setContactInfo } from "../store/bookingSlice";
import { Header } from "../components/Header";
import { ErrorMessage } from "../components/index";

const PassengerInfoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { passengerInfo, selectedSeats, contactInfo } = useSelector(
    (state) => state.booking
  );

  const [forms, setForms] = useState([]);
  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);

  const [contact, setContact] = useState({ email: "", phone: "" });
  const [contactErrors, setContactErrors] = useState({});

  useEffect(() => {
    const length = selectedSeats.length || 0;
    const passngerArr = [];
    for (let i = 0; i < length; i++) {
      passngerArr.push(
        passengerInfo && passengerInfo[i]
          ? { ...passengerInfo[i] }
          : { firstName: "", lastName: "", age: "", gender: "" }
      );
    }
    setForms(passngerArr);
    setErrors(Array(passngerArr.length).fill({}));
    setContact(contactInfo || { email: "", phone: "" });
  }, [selectedSeats, passengerInfo, contactInfo]);

  const handleChange = (index, name, value) => {
    setForms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [name]: value };
      return next;
    });
    setErrors((prev) => {
      const next = [...prev];
      if (next[index]) next[index][name] = "";
      return next;
    });
  };

  const handleContactChange = (name, value) => {
    setContact((prev) => ({ ...prev, [name]: value }));
    setContactErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const allErrors = forms.map((f) => {
      const e = {};
      if (!f.firstName || !f.firstName.trim())
        e.firstName = "First name is required";
      if (!f.lastName || !f.lastName.trim())
        e.lastName = "Last name is required";
      if (!f.age || f.age < 1 || f.age > 110) e.age = "Valid age is required";
      if (!f.gender) e.gender = "Gender is required";
      return e;
    });

    // validate contact
    const cErr = {};
    if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      cErr.email = "Valid email is required";
    if (!contact.phone || contact.phone.replace(/\D/g, "").length < 10)
      cErr.phone = "Valid phone (10 digits) is required";

    setErrors(allErrors);
    setContactErrors(cErr);

    const passengersValid = allErrors.every((e) => Object.keys(e).length === 0);
    const contactValid = Object.keys(cErr).length === 0;
    return passengersValid && contactValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (forms.length === 0) {
      navigate(-1);
      return;
    }
    if (!validate()) return;
    setProcessing(true);
    dispatch(setPassengerInfoArray(forms));
    dispatch(setContactInfo(contact));
    setProcessing(false);
    navigate("/review-ticket");
  };

  const handleBack = () => navigate(-1);

  if (!selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Passenger Information"
          showBackButton
          onBack={handleBack}
        />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message="No seats selected. Please select seats first." />
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
          >
            Start New Search
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Passenger Information"
        showBackButton
        onBack={handleBack}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact info (one per booking) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Contact Details (one email & phone for booking)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  value={contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  className={`w-full px-4 py-2 border rounded ${
                    contactErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {contactErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {contactErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  value={contact.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                  className={`w-full px-4 py-2 border rounded ${
                    contactErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={10}
                  inputMode="numeric"
                />
                {contactErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {contactErrors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Per-passenger forms */}
          {forms.map((f, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Passenger {idx + 1} - Seat{" "}
                {selectedSeats[idx]
                  ? `${selectedSeats[idx].row + 1}${String.fromCharCode(
                      65 + selectedSeats[idx].col
                    )}`
                  : ""}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    value={f.firstName}
                    onChange={(e) =>
                      handleChange(idx, "firstName", e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded ${
                      errors[idx] && errors[idx].firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[idx] && errors[idx].firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[idx].firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    value={f.lastName}
                    onChange={(e) =>
                      handleChange(idx, "lastName", e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded ${
                      errors[idx] && errors[idx].lastName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[idx] && errors[idx].lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[idx].lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={f.age}
                    onChange={(e) => handleChange(idx, "age", e.target.value)}
                    min={1}
                    max={110}
                    className={`w-full px-4 py-2 border rounded ${
                      errors[idx] && errors[idx].age
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[idx] && errors[idx].age && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[idx].age}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={f.gender}
                    onChange={(e) =>
                      handleChange(idx, "gender", e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded ${
                      errors[idx] && errors[idx].gender
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors[idx] && errors[idx].gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[idx].gender}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
            >
              {processing ? "Saving..." : "Continue to Review"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PassengerInfoPage;
