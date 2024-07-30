import React, { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import useMasterStore from "@/store/masters";
import useOnboardingStore from "@/store/onboarding";
import { sdk } from "@/utils/graphqlClient";

interface IFormInput {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: { id: string; value: string } | null;
  postcode: string;
  location: PlacesType;
}

type PlacesType = {
  label: string;
  value: string;
};

const loadOptions = (
  inputValue: string,
  callback: (options: PlacesType[]) => void
) => {
  sdk.AllPlaces({ input: inputValue }).then((d) => {
    callback(
      d.getPlacesList.map((el) => ({
        label: el.displayName,
        value: el.placeId,
      }))
    );
  });
};

const UserLocationForm: React.FC = () => {
  const { statesOptions } = useMasterStore();
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
    cords,
    place,
    setAddressLine1,
    setAddressLine2,
    setCity,
    setState,
    setPostcode,
    setCords,
    setPlace,
  } = useOnboardingStore();

  const [addressLine1State, setAddressLine1State] = useState(addressLine1);
  const [addressLine2State, setAddressLine2State] = useState(addressLine2);
  const [cityState, setCityState] = useState(city);
  const [stateState, setStateState] = useState(state);
  const [postcodeState, setPostcodeState] = useState(postcode);
  const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);
  const [coords, setCoords] = useState<number[]>([]);
  const [errors, setErrors] = useState<Partial<IFormInput>>({});

  useEffect(() => {
    setAddressLine1State(addressLine1);
    setAddressLine2State(addressLine2);
    setCityState(city);
    setStateState(state);
    setPostcodeState(postcode);
    if (place?.displayName && place?.placeId) {
      setSelectedPlace({ label: place.displayName, value: place.placeId });
    }
    if (cords[0] !== 0 && cords[1] !== 0) {
      setCoords(cords);
    }
  }, [addressLine1, addressLine2, city, state, postcode, place, cords]);

  const debouncedLoadOptions = debounce(loadOptions, 800);

  //   const handleSubmit = () => {
  //     const newErrors: Partial<IFormInput> = {};

  //     if (!addressLine1State)
  //       newErrors.addressLine1 = "Address Line 1 is required";
  //     if (!cityState) newErrors.city = "City is required";
  //     if (!stateState) newErrors.state = "State is required";
  //     if (!postcodeState) newErrors.postcode = "Zipcode is required";
  //     if (!selectedPlace) newErrors.location = "Location is required";

  //     if (Object.keys(newErrors).length > 0) {
  //       setErrors(newErrors);
  //       return;
  //     }

  //     setAddressLine1(addressLine1State);
  //     setAddressLine2(addressLine2State);
  //     setCity(cityState);
  //     setState(stateState);
  //     setPostcode(postcodeState);
  //     setPlace(selectedPlace);
  //     setCords(coords);
  //   };

  return (
    <div className="z-10 flex flex-col w-full max-w-lg items-center space-y-5 text-center">
      <form className="space-y-4 md:space-y-3 w-full max-w-2xl">
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            value={addressLine1State}
            onChange={(e) => setAddressLine1State(e.target.value)}
            className="input input-primary"
            placeholder="Address Line 1"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm text-start">
              {errors.addressLine1}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            value={addressLine2State}
            onChange={(e) => setAddressLine2State(e.target.value)}
            className="input input-primary"
            placeholder="Address Line 2 (optional)"
          />
          {errors.addressLine2 && (
            <p className="text-red-500 text-sm text-start">
              {errors.addressLine2}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="col-span-3 flex-1">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              City
            </label>
            <input
              type="text"
              value={cityState}
              onChange={(e) => setCityState(e.target.value)}
              className="input input-primary"
              placeholder="City"
            />
            {errors.city && (
              <p className="text-red-500 text-sm text-start">{errors.city}</p>
            )}
          </div>

          <div className="col-span-2 flex-1">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              State
            </label>
            <Select
              options={statesOptions.map((el) => ({
                id: el.value,
                value: el.label,
              }))}
              getOptionLabel={(e) => e.value}
              getOptionValue={(e) => e.id}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select State"
              value={stateState}
              onChange={(option) => {
                setStateState(option);
                setState({
                  id: option?.id ?? "",
                  value: option?.value ?? "",
                });
              }}
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Zipcode
          </label>
          <input
            type="text"
            value={postcodeState}
            onChange={(e) => setPostcodeState(e.target.value)}
            className="input input-primary"
            placeholder="Zipcode"
          />
          {errors.postcode && (
            <p className="text-red-500 text-sm text-start">{errors.postcode}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Search Location
          </label>
          <AsyncSelect
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Search location"
            value={selectedPlace}
            menuPlacement="auto"
            maxMenuHeight={200}
            noOptionsMessage={() => "Search for your desired location"}
            onChange={async (option) => {
              setSelectedPlace({
                label: option?.label ?? "",
                value: option?.value ?? "",
              });
              setPlace({
                displayName: option?.label ?? "",
                placeId: option?.value ?? "",
              });
              const d = await sdk.PlaceDetails({
                placeId: option?.value ?? "",
              });
              if (d.getPlaceDetails) {
                setCoords([
                  d.getPlaceDetails.latitude,
                  d.getPlaceDetails.longitude,
                ]);
                setCords([
                  d.getPlaceDetails.latitude,
                  d.getPlaceDetails.longitude,
                ]);
              }
            }}
            loadOptions={debouncedLoadOptions}
          />
          {errors.location && (
            <p className="text-red-500 text-sm text-start">
              {/* {errors.location} */}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserLocationForm;
