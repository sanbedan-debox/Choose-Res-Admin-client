import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import useGlobalStore from "@/store/global";
import useMasterStore from "@/store/masters";
import RestaurantOnboardingStore from "@/store/restaurantOnboarding";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import AsyncSelect from "react-select/async";

import {
  Availability,
  formatAvailability,
  reverseFormatAvailability,
} from "@/components/common/timingAvailibility/interface";
import AvailabilityComponent from "@/components/common/timingAvailibility/timingAvailibility";
import { Day } from "@/generated/graphql";

interface IFormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  location: PlacesType;
  state: { id: string; value: string } | null;
  zipcode: number;
  locationType: { value: string; label: string };
  timezone: { id: string; value: string } | null;
}

type PlacesType = {
  label: string;
  value: string;
};

const RestaurantAvailability = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<IFormData>({
    defaultValues: {},
  });

  const [availability, setAvailability] = useState<Availability[]>([
    { day: Day.Sunday, hours: [], active: false },
    { day: Day.Monday, hours: [], active: false },
    { day: Day.Tuesday, hours: [], active: false },
    { day: Day.Wednesday, hours: [], active: false },
    { day: Day.Thursday, hours: [], active: false },
    { day: Day.Friday, hours: [], active: false },
    { day: Day.Saturday, hours: [], active: false },
  ]);

  const { statesOptions, timezonesOptions } = useMasterStore();

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
    setCords,
    setState,
    setTimeZone,
    setZipcode,
    setPlace,
  } = RestaurantOnboardingStore();
  const [isChecked, setIsChecked] = useState(false);

  async function fetchBusinessDetails() {
    try {
      const response = await sdk.userBusinessDetails();
      if (response && response.userBusinessDetails) {
        const { address } = response.userBusinessDetails;

        setValue("addressLine1", address?.addressLine1 || "");
        setAddressLine1(address?.addressLine1 || "");

        setValue("addressLine2", address?.addressLine2 || "");
        setAddressLine2(address?.addressLine2 || "");

        setValue("city", address?.city || "");
        setCity(address?.city || "");

        setValue("state", {
          id: address?.state?.stateId || "",
          value: address?.state?.stateName || "",
        });
        setState({
          id: address?.state?.stateId || "",
          value: address?.state?.stateName || "",
        });

        setValue("zipcode", address?.zipcode || 0);
        setZipcode(address?.zipcode ?? 0);

        setSelectedPlace({
          label: address?.place?.displayName || "",
          value: address?.place?.displayName || "",
        });
        setPlace({
          displayName: address?.place?.displayName || "",
          placeId: address?.place?.placeId || "",
        });

        const coordinates = address?.coordinate?.coordinates;
        if (coordinates && coordinates.length === 2) {
          setCoords(coordinates);
          setCords([coordinates[0], coordinates[1]]);
        } else {
          setCoords([0, 0]);
          setCords([0, 0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch business details:", error);
      setToastData({
        type: "error",
        message: "Failed to fetch business details",
      });
    }
  }

  useEffect(() => {
    setValue("addressLine1", addressLine1);
    setValue("addressLine2", addressLine2);
    setValue("city", city);
    setValue("state", state);
    setValue("zipcode", zipcode);
    setValue("timezone", timeZone);
    if (place?.displayName && place?.placeId) {
      setSelectedPlace({ label: place.displayName, value: place.placeId });
      setValue("location", { label: place.displayName, value: place.placeId });
    }
    if (cords) {
      if (cords[0] !== 0 && cords[1] !== 0) {
        setCoords(cords);
      }
    }
    if (availabilityHours && availabilityHours?.length > 0) {
      const originalAvailability = reverseFormatAvailability(availabilityHours);
      setAvailability(originalAvailability);
    }
  }, [
    setValue,
    addressLine1,
    addressLine2,
    city,
    state,
    zipcode,
    place,
    cords,
    timeZone,
    availabilityHours,
  ]);
  const [btnLoading, setBtnLoading] = useState(false);

  const onSubmit = async (data: IFormData) => {
    try {
      if (!data.state || !data.timezone) {
        return;
      }
      setBtnLoading(true);

      const formattedAvailability = formatAvailability(availability);
      const response = await sdk.restaurantOnboarding({
        input: {
          address: {
            addressLine1: data?.addressLine1,

            addressLine2: data?.addressLine2 ? data?.addressLine2 : "",

            city: data.city,

            state: { stateId: data.state.id, stateName: data.state.value },
            zipcode: data.zipcode,

            place: {
              displayName: selectedPlace?.label ?? "",
              placeId: selectedPlace?.value ?? "",
            },
            coordinate: {
              coordinates: coords,
            },
          },
          timezone: {
            timezoneId: data.timezone.id,
            timezoneName: data.timezone.value,
          },
          availability: formattedAvailability,
        },
      });
      setToastData({
        message: "Restaurant details updated successfully!",
        type: "success",
      });
      router.push("/onboarding-restaurant/restaurant-additional-info");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
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

  const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);
  const [coords, setCoords] = useState<number[]>([]);
  const debouncedLoadOptions = debounce(loadOptions, 800);

  return (
    <motion.div
      className="z-10 flex flex-col w-full max-w-2xl  items-center space-y-5 text-center"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="flex flex-col items-center space-y-5 text-center"
      >
        <h1 className="font-display max-w-md text-2xl font-semibold transition-colors">
          Restaurant Availability Details
        </h1>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <label className="block mb-2 text-lg font-medium text-left text-gray-700">
            Address
          </label>
          <button
            type="button"
            className="text-sm text-primary flex items-center cursor-pointer"
            onClick={async () => {
              fetchBusinessDetails();
            }}
          >
            <span className="ml-2 hover:underline">
              Copy address from business details
            </span>
          </button>
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            {...register("addressLine1", {
              required: "Address Line 1 is required",
            })}
            className="input input-primary"
            placeholder="Address Line 1"
            onChange={(e) => setAddressLine1(e.target.value)}
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm text-start">
              {errors.addressLine1?.message?.toString()}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            {...register("addressLine2", {})}
            className="input input-primary"
            placeholder="Address Line 2"
            onChange={(e) => setAddressLine2(e.target.value)}
          />
          {errors.addressLine2 && (
            <p className="text-red-500 text-sm text-start">
              {errors.addressLine2?.message?.toString() ?? ""}
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
              {...register("city", {
                required: "City is required",
              })}
              className="input input-primary"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && (
              <p className="text-red-500 text-sm text-start">
                {errors.city?.message?.toString() ?? ""}
              </p>
            )}
          </div>

          <div className="col-span-2 flex-1">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              State
            </label>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <Select
                  classNames={{
                    option: (state) =>
                      `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                        state.isSelected ? "!bg-primary text-white" : ""
                      }  `,
                  }}
                  {...field}
                  id="state"
                  options={statesOptions.map((el) => ({
                    id: el.value,
                    value: el.label,
                  }))}
                  getOptionLabel={(e) => e.value}
                  getOptionValue={(e) => e.id}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select State"
                  value={state}
                  onChange={(option) => {
                    setValue("state", option);
                    setState({
                      id: option?.id ?? "",
                      value: option?.value ?? "",
                    });
                  }}
                />
              )}
            />
            {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message?.toString() ?? ""}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            ZipCode
          </label>
          <input
            type="number"
            {...register("zipcode", {
              required: "Postcode is required",
            })}
            className="input input-primary"
            placeholder="Zipcode"
            onChange={(e) => setZipcode(parseInt(e.target.value))}
          />
          {errors.zipcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.zipcode.message?.toString() ?? ""}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="location"
            className="block mb-2 text-sm font-medium text-left text-gray-700"
          >
            Search Location
          </label>
          <AsyncSelect
            id="location"
            {...register("location", { required: "Location is required" })}
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
              setValue("location", {
                value: option?.value ?? "",
                label: option?.label ?? "",
              });
            }}
            loadOptions={debouncedLoadOptions}
          />
          {errors.location && (
            <p className="text-red-500 text-sm text-start">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Timezone
          </label>
          <Controller
            name="timezone"
            control={control}
            rules={{ required: "Timezone is required" }}
            render={({ field }) => (
              <Select
                classNames={{
                  option: (state) =>
                    `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                      state.isSelected ? "!bg-primary text-white" : ""
                    }  `,
                }}
                {...field}
                id="timezone"
                options={timezonesOptions.map((el) => ({
                  id: el.value,
                  value: el.label,
                }))}
                getOptionLabel={(e) => e.value}
                getOptionValue={(e) => e.id}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select Timezone"
                value={timeZone}
                onChange={(option) => {
                  setValue("timezone", option);
                  setTimeZone({
                    id: option?.id ?? "",
                    value: option?.value ?? "",
                  });
                }}
              />
            )}
          />
          {errors.timezone && (
            <p className="text-red-500 text-sm text-start">
              {errors.timezone.message?.toString() ?? ""}
            </p>
          )}
        </div>
        <br />
        <label className="block mb-2 text-sm font-medium text-left text-gray-700">
          Set Restaturant Timings
        </label>
        <div>
          <AvailabilityComponent
            availability={availability}
            setAvailability={setAvailability}
          />
        </div>

        <div className="flex justify-end">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            type="submit"
            className="btn btn-primary w-full mt-8"
          >
            Save
          </CButton>
        </div>
      </form>
    </motion.div>
  );
};

export default RestaurantAvailability;
