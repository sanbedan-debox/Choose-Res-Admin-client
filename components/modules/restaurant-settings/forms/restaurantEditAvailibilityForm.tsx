import Select from "react-select";
import AsyncSelect from "react-select/async";

import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import FullPageModal from "@/components/common/modal/fullPageModal";
import {
  Availability,
  formatAvailability,
} from "@/components/common/timingAvailibility/interface";
import AvailabilityComponent from "@/components/common/timingAvailibility/timingAvailibility";
import { initAvailability } from "@/lib/commonConstants";
import useGlobalStore from "@/store/global";
import useMasterStore from "@/store/masters";
import useRestaurantEditStore from "@/store/useRestaurantEditStore";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineEdit } from "react-icons/md";
interface IFormInput {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: { id: string; value: string } | null;
  zipcode: number;
  location: PlacesType;
  timeZone: timeZoneType;
}
type PlacesType = {
  label: string;
  value: string;
};
type timeZoneType = {
  label: string;
  value: string;
};
const loadOptions = (
  inputValue: string,
  callback: (options: PlacesType[]) => void
) => {
  sdk.AllPlaces({ input: inputValue }).then((d) => {
    callback(
      d.getPlacesList.map((el: { displayName: string; placeId: string }) => ({
        label: el.displayName,
        value: el.placeId,
      }))
    );
  });
};

const RestaurantEditAvailabilityForm: React.FC = () => {
  const [coords, setCoords] = useState<number[]>([]);
  const [availability, setAvailability] =
    useState<Availability[]>(initAvailability);
  const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);
  const debouncedLoadOptions = debounce(loadOptions, 800);

  const {
    addressLine1,
    addressLine2,
    city,
    state,
    zipcode,
    cords,
    place,
    timeZone,
    availabilityHours,
    setAddressLine1,
    setAddressLine2,
    setCity,
    setState,
    setCords,
    setPlace,
    setTimeZone,
    setAvailabilityHours,
    setZipcode,
  } = useRestaurantEditStore();

  const { timezonesOptions, statesOptions } = useMasterStore();
  const [isFullPageModalOpen, setIsFullPageModalOpen] = useState(false);

  useEffect(() => {
    setAvailability(availabilityHours);
    setCoords(cords);
  }, [availabilityHours, cords]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      addressLine1: addressLine1 || "",
      addressLine2: addressLine2 || "",
      city: city || "",
      state: state || "",
      zipcode: zipcode || "",
      cords: cords || "",
      place: place || "",
      timeZone: timeZone || "",
      availabilityHours: availabilityHours,
    },
  });
  const handleInputChange = (field: keyof IFormInput, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };
  const { setToastData } = useGlobalStore();
  const [formState, setFormState] = useState<IFormInput>({
    addressLine1,
    addressLine2,
    city,
    state,
    zipcode,
    location: { label: place?.displayName ?? "", value: place?.placeId ?? "" },
    timeZone: { label: timeZone?.value ?? "", value: timeZone?.id ?? "" },
  });
  useEffect(() => {
    setSelectedPlace({
      label: place?.displayName,
      value: place?.placeId,
    });
  }, [place]);
  const onPlaceChange = async (option: PlacesType | null) => {
    setSelectedPlace(option);
    setFormState((prev) => ({
      ...prev,
      location: option ?? { label: "", value: "" },
    }));
    const d = await sdk.PlaceDetails({
      placeId: option?.value ?? "",
    });
    if (d && d.getPlaceDetails) {
      setCords([d.getPlaceDetails.latitude, d.getPlaceDetails.longitude]);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formattedAvailability = formatAvailability(availability);
      const parseIntZip = parseInt(formState.zipcode.toString());
      const response = await sdk.updateRestaurantDetails({
        input: {
          address: {
            addressLine1: formState.addressLine1,
            addressLine2: formState.addressLine2 ? formState.addressLine2 : "",
            city: formState.city,
            state: {
              stateId: formState.state?.id || "",
              stateName: formState.state?.value || "",
            },
            zipcode: parseIntZip,
            place: {
              displayName: selectedPlace?.label ?? "",
              placeId: selectedPlace?.value ?? "",
            },

            coordinate: {
              coordinates: coords,
            },
          },
          availability: formattedAvailability,
          timezone: {
            timezoneId: formState.timeZone?.value,
            timezoneName: formState.timeZone?.label,
          },
        },
      });

      if (response && response.updateRestaurantDetails) {
        setAddressLine1(data.addressLine1);
        setAddressLine2(data.addressLine2);
        setState({
          id: formState.state?.id || "",
          value: formState.state?.value || "",
        });
        setCity(data.city);
        setZipcode(data.zipcode);
        setTimeZone({
          id: formState.timeZone?.value,
          value: formState.timeZone?.label,
        });

        setCords([coords[0], coords[1]]);
        setAvailabilityHours(availability);

        setPlace({
          displayName: selectedPlace?.label ?? "",
          placeId: selectedPlace?.value ?? "",
        });

        setIsFullPageModalOpen(false);
        setToastData({
          message: "Restaurant Location and Availibility Updated Successfully",
          type: "success",
        });
      }
    } catch (error) {
      setToastData({
        message: extractErrorMessage(error),
        type: "error",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg space-y-6 w-full ">
      <div className="flex justify-between items-center ">
        <h2 className="text-lg font-semibold text-gray-900">
          Restaurant Availibility Settings
        </h2>
        <MdOutlineEdit
          className="text-primary text-2xl cursor-pointer"
          onClick={() => setIsFullPageModalOpen(true)}
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center ">
          <div>
            <h2 className="text font-medium text-gray-700">Address Line 1</h2>
            <p className="text-xs text-neutral-500">
              {addressLine1 ? addressLine1 : "No address line 1 specified"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-3">
          <div>
            <h2 className="text font-medium text-gray-700">Address Line 2</h2>
            <p className="text-xs text-neutral-500">
              {addressLine2 ? addressLine2 : "No address line 2 specified"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-3">
          <div>
            <h2 className="text font-medium text-gray-700">City</h2>
            <p className="text-xs text-neutral-500">
              {city ? city : "No city specified"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-3">
          <div>
            <h2 className="text font-medium text-gray-700">State</h2>
            <p className="text-xs text-neutral-500">
              {state ? state.value : "No state specified"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-3">
          <div>
            <h2 className="text font-medium text-gray-700">Zipcode</h2>
            <p className="text-xs text-neutral-500">
              {zipcode ? zipcode : "No zipcode specified"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-3">
          <div>
            <h2 className="text font-medium text-gray-700">Place</h2>
            <p className="text-xs text-neutral-500">
              {place ? place.displayName : "No place specified"}
            </p>
          </div>
        </div>

        <div className="flex justify-between border-t pt-3 items-center ">
          <div>
            <h2 className="text font-medium text-gray-700">Time Zone</h2>
            <p className="text-xs text-neutral-500">
              {timeZone ? timeZone.value : "No time zone specified"}
            </p>
          </div>
        </div>

        {/* <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Availability Hours
            </h2>
          </div>
        </div> */}
      </div>

      <FullPageModal
        isOpen={isFullPageModalOpen}
        onClose={() => setIsFullPageModalOpen(false)}
        title="Edit Location Details"
        actionButtonLabel="Update"
        onActionButtonClick={() => {}}
      >
        <form
          className="space-y-4 md:space-y-3 w-full max-w-3xl mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="addressLine1"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Address Line 1
            </label>
            <input
              type="text"
              {...register("addressLine1", {
                required: "Address line 1 is required",
              })}
              id="addressLine1"
              className="input input-primary"
              placeholder="Enter address line 1"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm">
                {errors.addressLine1.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="addressLine2"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Address Line 2
            </label>
            <input
              type="text"
              {...register("addressLine2", {
                required: "Address line 2 is required",
              })}
              id="addressLine2"
              className="input input-primary"
              placeholder="Enter address line 2"
            />
            {errors.addressLine2 && (
              <p className="text-red-500 text-sm">
                {errors.addressLine2.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              id="city"
              className="input input-primary"
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              State
            </label>
            <Select
              classNames={{
                option: (state) =>
                  `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                    state.isSelected ? "!bg-primary text-white" : ""
                  }`,
              }}
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
              }}
            />
          </div>

          <div>
            <label
              htmlFor="zipcode"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Zipcode
            </label>
            <input
              type="text"
              {...register("zipcode", { required: "Zipcode is required" })}
              id="zipcode"
              className="input input-primary"
              placeholder="Enter zipcode"
            />
            {errors.zipcode && (
              <p className="text-red-500 text-sm">{errors.zipcode.message}</p>
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
              loadOptions={debouncedLoadOptions}
              onChange={onPlaceChange}
            />
          </div>

          <div>
            <label
              htmlFor="timeZone"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Time Zone
            </label>
            <Select
              classNames={{
                option: (state) =>
                  `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                    state.isSelected ? "!bg-primary text-white" : ""
                  }`,
              }}
              options={timezonesOptions.map((el) => ({
                label: el.label,
                value: el.value,
              }))}
              getOptionLabel={(e) => e.label}
              getOptionValue={(e) => e.value}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select Time Zone"
              value={formState.timeZone}
              onChange={(option) => {
                handleInputChange("timeZone", option);
              }}
            />

            {errors.timeZone && (
              <p className="text-red-500 text-sm">{errors.timeZone.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Availability Hours
            </label>
            <AvailabilityComponent
              availability={availability}
              setAvailability={setAvailability}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <CButton
              className="w-full"
              variant={ButtonType.Primary}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </CButton>
          </div>
        </form>
      </FullPageModal>
    </div>
  );
};

export default RestaurantEditAvailabilityForm;
