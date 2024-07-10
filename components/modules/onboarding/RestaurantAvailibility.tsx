import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import { DateTime } from "luxon";
import debounce from "lodash.debounce";

import {
  locationTypeOptions,
  stateOptions,
  timeZoneOptions,
} from "./interface/interface";
import { useEffect, useState } from "react";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { sdk } from "@/utils/graphqlClient";
import useRestaurantLocationStore from "@/store/restaurantOnboarding";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type TimeSlot = {
  from: { label: string; value: string };
  to: { label: string; value: string };
};

type RegularHours = {
  [key in Day]: TimeSlot[];
};

type ActiveDays = {
  [key in Day]: boolean;
};

interface FormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  location: PlacesType;
  state: { value: string; label: string };
  postcode: string;
  locationType: { value: string; label: string };
  timezone: { value: string; label: string };
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

const timeOptions = generateTimeOptions();

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

const RestaurantAvailability = () => {
  const { id } = useRestaurantLocationStore();
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

  const dayFieldArray = {
    Monday: useFieldArray({ control, name: "regularHours.Monday" }),
    Tuesday: useFieldArray({ control, name: "regularHours.Tuesday" }),
    Wednesday: useFieldArray({ control, name: "regularHours.Wednesday" }),
    Thursday: useFieldArray({ control, name: "regularHours.Thursday" }),
    Friday: useFieldArray({ control, name: "regularHours.Friday" }),
    Saturday: useFieldArray({ control, name: "regularHours.Saturday" }),
    Sunday: useFieldArray({ control, name: "regularHours.Sunday" }),
  };
  const [placesOptions, setPlacesOptions] = useState<PlacesType[]>([]);

  const activeDays = watch("activeDays");

  const checkOverlapForDay = (day: string) => {
    let hours: {
      from: { label: string; value: string };
      to: { label: string; value: string };
    }[] = [];

    switch (day) {
      case "Monday":
        hours = getValues(`regularHours.Monday`);
        break;
      case "Tuesday":
        hours = getValues(`regularHours.Tuesday`);
        break;
      case "Wednesday":
        hours = getValues(`regularHours.Wednesday`);
        break;
      case "Thursday":
        hours = getValues(`regularHours.Thursday`);
        break;
      case "Friday":
        hours = getValues(`regularHours.Friday`);
        break;
      case "Saturday":
        hours = getValues(`regularHours.Saturday`);
        break;
      case "Sunday":
        hours = getValues(`regularHours.Sunday`);
        break;
      default:
        hours = [];
        break;
    }

    for (let i = 0; i < hours.length; i++) {
      const currentSession = hours[i];
      const fromTime = new Date(currentSession.from.value);
      const toTime = new Date(currentSession.to.value);

      if (toTime <= fromTime) {
        alert(
          `Invalid session times: "to" time cannot be less than or equal to "from" time.`
        );
      }

      if (i > 0) {
        const previousSession = hours[i - 1];
        const previousToTime = new Date(previousSession.to.value);

        if (fromTime <= previousToTime) {
          alert(
            `Invalid session times: Start time overlaps with or is before previous session's end time.`
          );
        }
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = Object.keys(data.regularHours).map((day) => ({
        Day: day,
        hours: data.regularHours[day]
          .filter((slot) => slot.from && slot.to)
          .map((slot) => ({
            start: slot.from,
            end: slot.to,
          })),
        active: data.activeDays[day],
      }));
      console.log("Formatted Data:", formattedData);

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
            state: { value: data?.state?.value },
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
          timezone: data.timezone.value,
          availability: formattedSampleInput,
        },
      });
      setToastData({
        message: "Restaurant details updated successfully!",
        type: "success",
      });
      router.push("/onboarding-restaurant/restaurant-additional-info");
    } catch (error: any) {
      setToastData({
        message: `Failed to update restaurant details: ${error.message}`,
        type: "error",
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
                  options={stateOptions}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select State"
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
              // setPlace({
              //   displayName: option?.label ?? "",
              //   placeId: option?.value ?? "",
              // });
              const d = await sdk.PlaceDetails({
                placeId: option?.value ?? "",
              });
              if (d.getPlaceDetails) {
                setCoords([
                  d.getPlaceDetails.latitude,
                  d.getPlaceDetails.longitude,
                ]);
                // setCords([
                //   d.getPlaceDetails.latitude,
                //   d.getPlaceDetails.longitude,
                // ]);
              }
              setValue("location", {
                value: option?.value ?? "",
                label: option?.label ?? "",
              });
              // setLocation(option?.value || "");
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
                options={timeZoneOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select Timezone"
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
          <label className="block mb-2 text-lg font-medium text-left text-gray-700">
            Regular Hours
          </label>
          <div className="space-y-4">
            {Object.keys(dayFieldArray).map((day, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex flex-col w-full">
                  <span className="flex font-medium text-gray-700 justify-start mb-1">
                    {day}
                  </span>
                  <div className="flex w-full">
                    <input
                      type="checkbox"
                      {...register(`activeDays.${day}` as const)}
                      className="rounded text-primary-500 mr-2"
                      // onChange={(e) => onChange(e.target.checked)}
                    />

                    <div className="space-y-2 w-full">
                      {dayFieldArray[day].fields.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Controller
                            control={control}
                            name={`regularHours.${day}.${index}.from` as const}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={timeOptions}
                                isDisabled={
                                  !activeDays[day as keyof typeof activeDays]
                                }
                                className={`w-full ${
                                  index === 0 ? "bg-gray-200" : ""
                                }`}
                                placeholder="From"
                                value={field.value || null}
                                onChange={(e: any) => {
                                  field.onChange(e);
                                  checkOverlapForDay(day);
                                }}
                              />
                            )}
                          />

                          <Controller
                            control={control}
                            name={`regularHours.${day}.${index}.to` as const}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={timeOptions}
                                isDisabled={
                                  !activeDays[day as keyof typeof activeDays]
                                }
                                className={`w-full ${
                                  index === 0 ? "bg-gray-200" : ""
                                }`}
                                placeholder="To"
                                value={field.value || null}
                                onChange={(e: any) => {
                                  field.onChange(e);
                                  checkOverlapForDay(day);
                                }}
                              />
                            )}
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              className="m-2 text-lg text-red-500"
                              onClick={() => dayFieldArray[day].remove(index)}
                            >
                              -
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="m-2 text-lg  text-primary"
                      onClick={() =>
                        dayFieldArray[day].append({ from: "", to: "" })
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
