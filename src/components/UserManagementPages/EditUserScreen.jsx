// EditUserScreen.jsx
import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const EditUserScreen = ({ user, onBack, onSave }) => {
  const [editFormData, setEditFormData] = useState({});
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (user) {
      const lat = user.locationData?.lat || 0;
      const lng = user.locationData?.lng || 0;

      setEditFormData({
        id: user.id,
        uid: user.uid,
        fullName: user.fullName || "",
        phone: user.phone || "",
        gender: user.gender || "male",
        dob: user.dob || "",
        birthTime: user.birthTime || "",
        birthLocation: user.birthLocation || "",
        credits: user.credits || 0,
        locationData: {
          address: user.locationData?.address || "",
          city: user.locationData?.city || "",
          state: user.locationData?.state || "",
          country: user.locationData?.country || "",
          lat: lat,
          lng: lng,
        },
      });

      setMapCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("locationData.")) {
      const field = name.split(".")[1];
      setEditFormData((prev) => ({
        ...prev,
        locationData: {
          ...prev.locationData,
          [field]: value,
        },
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onLoad = useCallback((autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Extract address components
        let city = "";
        let state = "";
        let country = "";

        place.address_components?.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });

        setEditFormData((prev) => ({
          ...prev,
          birthLocation: place.formatted_address,
          locationData: {
            ...prev.locationData,
            address: place.formatted_address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
          },
        }));

        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
      }
    }
  };

  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarkerPosition({ lat, lng });
    setEditFormData((prev) => ({
      ...prev,
      locationData: {
        ...prev.locationData,
        lat: lat,
        lng: lng,
      },
    }));

    // Reverse geocode to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        let city = "";
        let state = "";
        let country = "";

        results[0].address_components?.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });

        setEditFormData((prev) => ({
          ...prev,
          birthLocation: results[0].formatted_address,
          locationData: {
            ...prev.locationData,
            address: results[0].formatted_address,
            city: city,
            state: state,
            country: country,
          },
        }));
      }
    });
  };

  const handleSaveEdit = async () => {
    try {
      const userRef = doc(db, "users", editFormData.uid);

      const updateData = {
        fullName: editFormData.fullName,
        phone: editFormData.phone,
        gender: editFormData.gender,
        dob: editFormData.dob,
        birthTime: editFormData.birthTime,
        birthLocation: editFormData.birthLocation,
        credits: Number(editFormData.credits),
        locationData: {
          address: editFormData.locationData.address,
          city: editFormData.locationData.city,
          state: editFormData.locationData.state,
          country: editFormData.locationData.country,
          lat: Number(editFormData.locationData.lat) || 0,
          lng: Number(editFormData.locationData.lng) || 0,
        },
        updatedAt: new Date(),
      };

      await updateDoc(userRef, updateData);

      Swal.fire("Success!", "User updated successfully.", "success");

      // Call onSave callback to update parent component
      if (onSave) {
        onSave(editFormData.uid, updateData);
      }

      // Go back to user list
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to update user.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Edit User</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Update user information and location
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveEdit}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={editFormData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Birth Time
                    </label>
                    <input
                      type="time"
                      name="birthTime"
                      value={editFormData.birthTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Available Credits
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={editFormData.credits}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Location Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search Location
                  </label>
                  {isLoaded && (
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search for a location..."
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </Autocomplete>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Birth Location
                  </label>
                  <input
                    type="text"
                    name="birthLocation"
                    value={editFormData.birthLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="locationData.city"
                      value={editFormData.locationData?.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="locationData.state"
                      value={editFormData.locationData?.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="locationData.country"
                    value={editFormData.locationData?.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="locationData.lat"
                      value={editFormData.locationData?.lat}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="locationData.lng"
                      value={editFormData.locationData?.lng}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-6 h-fit">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Location on Map
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Drag the marker to adjust the location or search above
            </p>
            {isLoaded && editFormData.locationData && (
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={12}
                >
                  <Marker
                    position={markerPosition}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                  />
                </GoogleMap>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 font-medium">💡 Tips:</p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Search for a location using the search box above</li>
                <li>Drag the marker to fine-tune the exact position</li>
                <li>Coordinates will update automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserScreen;
