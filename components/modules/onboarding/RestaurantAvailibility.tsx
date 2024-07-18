import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { DateTime } from "luxon";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import RestaurantOnboardingStore from "@/store/restaurantOnboarding";
import useMasterStore from "@/store/masters";
import AvailabilityForm from "@/components/common/availibility/availibility";
import { timeZoneOptions } from "./interface/interface";

interface FormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  location: PlacesType;
  state: string;
  postcode: string;
  locationType: { value: string; label: string };
  timezone: string;
  regularHours: {
    Monday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Tuesday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Wednesday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Thursday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Friday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Saturday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
    Sunday: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[];
  };
  activeDays: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
  };
}
const generateTimeOptions = () => {
  const options: { value: string; label: string }[] = [];
  const periods = ["AM", "PM"];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const period = periods[Math.floor(hour / 12)];
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute = minute === 0 ? "00" : minute.toString();
      const time = `${displayHour}:${displayMinute} ${period}`;

      const date = new Date();
      date.setHours(hour, minute, 0, 0);

      const isoTime = date.toISOString();

      options.push({ value: isoTime, label: time });
    }
  }
  return options;
};

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
    watch,
    setValue,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      regularHours: {
        Monday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Tuesday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Wednesday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Thursday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Friday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Saturday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Sunday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
      },
      activeDays: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      },
    },
  });

  const { statesOptions, timezonesOptions } = useMasterStore();

  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
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
    setPostcode,
    setPlace,
    setAvailabilityHours,
  } = RestaurantOnboardingStore();

  function reformatAvailability(data: any[]): any {
    const defaultValues: any = {
      regularHours: {
        Monday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Tuesday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Wednesday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Thursday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Friday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Saturday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
        Sunday: [
          { from: { label: "", value: "" }, to: { label: "", value: "" } },
        ],
      },
      activeDays: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      },
    };

    const reformattedData: any = { ...defaultValues };

    const generateTimeOptions = () => {
      const options: { value: string; label: string }[] = [];
      const periods = ["AM", "PM"];

      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const period = periods[Math.floor(hour / 12)];
          const displayHour = hour % 12 === 0 ? 12 : hour % 12;
          const displayMinute = minute === 0 ? "00" : minute.toString();
          const time = `${displayHour}:${displayMinute} ${period}`;

          const date = new Date();
          date.setHours(hour, minute, 0, 0);

          const isoTime = date.toISOString();

          options.push({ value: isoTime, label: time });
        }
      }
      return options;
    };

    const timeOptions = generateTimeOptions();

    data &&
      data.forEach((item) => {
        const day = item.day;
        const hours = item.hours;
        const active = item.active;

        reformattedData.regularHours[day] = hours.map((hour: any) => ({
          from: {
            label:
              timeOptions.find((option) => {
                const optionDate = new Date(option.value);
                const hourStartDate = new Date(hour.start);
                return (
                  optionDate.getHours() === hourStartDate.getHours() &&
                  optionDate.getMinutes() === hourStartDate.getMinutes()
                );
              })?.label || "",
            value: hour.start,
          },
          to: {
            label:
              timeOptions.find((option) => {
                const optionDate = new Date(option.value);
                const hourEndDate = new Date(hour.end);
                return (
                  optionDate.getHours() === hourEndDate.getHours() &&
                  optionDate.getMinutes() === hourEndDate.getMinutes()
                );
              })?.label || "",
            value: hour.end,
          },
        }));

        reformattedData.activeDays[day] = active;
      });

    return reformattedData;
  }

  useEffect(() => {
    setValue("addressLine1", addressLine1);
    setValue("addressLine2", addressLine2);
    setValue("city", city);
    setValue("state", state);
    setValue("postcode", postcode);
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
    const originalFormat = reformatAvailability(availabilityHours);
    setValue("regularHours", originalFormat.regularHours);
    setValue("activeDays", originalFormat.activeDays);
  }, [
    setValue,
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
    place,
    cords,
    timeZone,
    availabilityHours,
  ]);

  const onSubmit = async (data: any) => {
    try {
      const formattedData = Object.keys(data.regularHours).map((day: any) => ({
        Day: day,
        hours: data.regularHours[day]
          .filter((slot: any) => slot.from && slot.to)
          .map((slot: any) => ({
            start: slot.from,
            end: slot.to,
          })),
        active: data.activeDays[day],
      }));

      const formatData = (formattedData: any[]): any[] => {
        const currentDate = DateTime.now().toISO();
        const endcurrentDate = DateTime.now().plus({ minutes: 90 }).toISO();
        return formattedData.map((dayData) => {
          const { Day, hours, active } = dayData;

          const formattedHours = hours.map((hour: any) => {
            let start = hour.start.value || currentDate;
            let end = hour.end.value || endcurrentDate;

            return {
              start,
              end,
            };
          });

          return {
            day: Day,
            hours: formattedHours,
            active,
          };
        });
      };

      const formattedSampleInput = formatData(formattedData);

      setAvailabilityHours(formattedSampleInput);

      const matchedTimezone = timeZoneOptions.find(
        (tz) => tz.value === data.timezone
      );

      const response = await sdk.restaurantOnboarding({
        input: {
          address: {
            addressLine1: {
              value: data?.addressLine1,
            },
            addressLine2: {
              value: data?.addressLine2 ? data?.addressLine2 : "",
            },
            city: {
              value: data.city,
            },
            state: { value: data.state },
            postcode: {
              value: data.postcode,
            },
            place: {
              displayName: selectedPlace?.label ?? "",
              placeId: selectedPlace?.value ?? "",
            },
            coordinate: {
              coordinates: coords,
            },
          },
          timezone: {
            _id: matchedTimezone?.value,
            value: matchedTimezone?.label || "",
          },
          availability: formattedSampleInput,
        },
      });
      setToastData({
        message: "Restaurant details updated successfully!",
        type: "success",
      });
      router.push("/onboarding-restaurant/restaurant-additional-info");
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
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

  const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);
  const [coords, setCoords] = useState<number[]>([]);
  const debouncedLoadOptions = debounce(loadOptions, 800);

  return (
    <motion.div
      className="z-10 flex flex-col w-full max-w-md items-center space-y-5 text-center"
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
        <label className="block mb-2 text-lg font-medium text-left text-gray-700">
          Address
        </label>
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
                  {...field}
                  id="state"
                  options={statesOptions}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select State"
                  value={statesOptions.find((option) => option.value === state)}
                  onChange={(option) => {
                    setValue("state", option?.value || "");
                    setState(option?.value || "");
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
            type="text"
            {...register("postcode", {
              required: "Postcode is required",
            })}
            className="input input-primary"
            placeholder="Zipcode"
            onChange={(e) => setPostcode(e.target.value)}
          />
          {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message?.toString() ?? ""}
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
            // defaultOptions={[
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            //   { value: "One", label: "One" },
            // ]}
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
                {...field}
                id="timezone"
                options={timezonesOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select Timezone"
                value={timezonesOptions.find(
                  (option) => option.value === timeZone
                )}
                onChange={(option) => {
                  setValue("timezone", option?.value || "");
                  setTimeZone(option?.value || "");
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

        <div>
          <AvailabilityForm
            control={control}
            errors={errors}
            getValues={getValues}
            register={register}
            setValue={setValue}
            watch={watch}
            key={null}
          />
        </div>

        <div className="flex justify-end">
          <CButton
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
