import React, { useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import useMasterStore from "@/store/masters";
import useProfileStore from "@/store/profile";
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
  } = useProfileStore();

  const [formState, setFormState] = useState<IFormInput>({
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
    location: { label: place?.displayName ?? "", value: place?.placeId ?? "" },
  });

  const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);
  const [coords, setCoords] = useState<number[]>(cords);
  const [errors, setErrors] = useState<Partial<IFormInput>>({});

  const debouncedLoadOptions = debounce(loadOptions, 800);

  const handleInputChange = (field: keyof IFormInput, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="z-10 flex flex-col w-full max-w-lg items-center space-y-5 text-center">
      <form className="space-y-4 md:space-y-3 w-full max-w-2xl">
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            value={formState.addressLine1}
            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
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
            value={formState.addressLine2}
            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
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
              value={formState.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
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
              value={formState.state}
              onChange={(option) => {
                handleInputChange("state", option);
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
            value={formState.postcode}
            onChange={(e) => handleInputChange("postcode", e.target.value)}
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
        </div>
      </form>
    </div>
  );
};

export default UserLocationForm;
