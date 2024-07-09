import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import {
  locationTypeOptions,
  stateOptions,
  timeZoneOptions,
} from "./interface/interface";
import { useEffect } from "react";

interface FormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
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

  const dayFieldArray = {
    Monday: useFieldArray({ control, name: "regularHours.Monday" }),
    Tuesday: useFieldArray({ control, name: "regularHours.Tuesday" }),
    Wednesday: useFieldArray({ control, name: "regularHours.Wednesday" }),
    Thursday: useFieldArray({ control, name: "regularHours.Thursday" }),
    Friday: useFieldArray({ control, name: "regularHours.Friday" }),
    Saturday: useFieldArray({ control, name: "regularHours.Saturday" }),
    Sunday: useFieldArray({ control, name: "regularHours.Sunday" }),
  };

  const activeDays = watch("activeDays");

  // const checkOverlapForDay = (day: string) => {
  //   console.log(day);
  //   let hours: {
  //     from: { label: string; value: string };
  //     to: { label: string; value: string };
  //   }[] = [];

  //   switch (day) {
  //     case "Monday":
  //       hours = getValues(`regularHours.Monday`);
  //       break;
  //     case "Tuesday":
  //       hours = getValues(`regularHours.Tuesday`);
  //       break;
  //     case "Wednesday":
  //       hours = getValues(`regularHours.Wednesday`);
  //       break;
  //     case "Thursday":
  //       hours = getValues(`regularHours.Thursday`);
  //       break;
  //     case "Friday":
  //       hours = getValues(`regularHours.Friday`);
  //       break;
  //     case "Saturday":
  //       hours = getValues(`regularHours.Saturday`);
  //       break;
  //     case "Sunday":
  //       hours = getValues(`regularHours.Sunday`);
  //       break;
  //     default:
  //       hours = [];
  //       break;
  //   }

  //   console.log(hours);

  //   const sortedHours = hours
  //     .filter((slot) => slot.from && slot.to)
  //     .sort(
  //       (a, b) =>
  //         new Date(`1970-01-01T${a.from.value}:00`).getTime() -
  //         new Date(`1970-01-01T${b.from.value}:00`).getTime()
  //     );

  //   for (let i = 0; i < sortedHours.length; i++) {
  //     const startTime = new Date(
  //       `1970-01-01T${sortedHours[i].from.value}:00`
  //     ).getTime();
  //     const endTime = new Date(
  //       `1970-01-01T${sortedHours[i].to.value}:00`
  //     ).getTime();

  //     if (endTime <= startTime) {
  //       console.log(
  //         `Invalid time range for ${day}: ${sortedHours[i].from.label} - ${sortedHours[i].to.label}`
  //       );
  //       return false;
  //     }

  //     if (i > 0) {
  //       const previousEndTime = new Date(
  //         `1970-01-01T${sortedHours[i - 1].to.value}:00`
  //       ).getTime();
  //       if (startTime < previousEndTime) {
  //         console.log(
  //           `Overlap for ${day}: ${sortedHours[i - 1].to.label} - ${
  //             sortedHours[i].from.label
  //           }`
  //         );
  //         return false;
  //       }
  //     }
  //   }

  //   return true;
  // };
  const checkOverlapForDay = (day: string) => {
    console.log(day);
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

    console.log(hours);

    const sortedHours = hours
      .filter((slot) => slot.from && slot.to)
      .sort(
        (a, b) =>
          new Date(`1970-01-01T${a.from.value}`).getTime() -
          new Date(`1970-01-01T${b.from.value}`).getTime()
      );

    for (let i = 0; i < sortedHours.length; i++) {
      const startTime = new Date(
        `1970-01-01T${sortedHours[i].from.value}`
      ).getTime();
      const endTime = new Date(
        `1970-01-01T${sortedHours[i].to.value}`
      ).getTime();

      if (endTime <= startTime) {
        console.log(
          `Invalid time range for ${day}: ${sortedHours[i].from.label} - ${sortedHours[i].to.label}`
        );
        return false;
      }

      if (i > 0) {
        const previousEndTime = new Date(
          `1970-01-01T${sortedHours[i - 1].to.value}`
        ).getTime();
        if (startTime < previousEndTime) {
          console.log(
            `Overlap for ${day}: ${sortedHours[i - 1].to.label} - ${
              sortedHours[i].from.label
            }`
          );
          return false;
        }
      }
    }

    for (let i = 1; i < sortedHours.length; i++) {
      const previousEndTime = new Date(
        `1970-01-01T${sortedHours[i - 1].to.value}`
      ).getTime();
      const nextStartTime = new Date(
        `1970-01-01T${sortedHours[i].from.value}`
      ).getTime();

      if (nextStartTime <= previousEndTime) {
        console.log(
          `Invalid time break for ${day}: ${sortedHours[i - 1].to.label} - ${
            sortedHours[i].from.label
          }`
        );
        return false;
      }
    }

    return true;
  };

  const onSubmit = (data: FormData) => {
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
    console.log(formattedData);
    availabilityValidation(formattedData);
    router.push("/onboarding-restaurant/restaurant-info");
  };

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
            {...register("addressLine2", {
              required: "Address Line 2 is required",
            })}
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
            Select Location
          </label>
          <Controller
            name="locationType"
            control={control}
            rules={{ required: "Location type is required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="location"
                options={locationTypeOptions}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select Location "
              />
            )}
          />
          {errors.locationType && (
            <p className="text-red-500 text-sm text-start">
              {errors.locationType.message?.toString() ?? ""}
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
                                  checkOverlapForDay(day);
                                  field.onChange(e);
                                  // console.log(e);
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
                                // onChange={() =>
                                //   checkOverlapForDay(
                                //     day as keyof typeof dayFieldArray
                                //   )
                                // }
                                isDisabled={
                                  !activeDays[day as keyof typeof activeDays]
                                }
                                className={`w-full ${
                                  index === 0 ? "bg-gray-200" : ""
                                }`}
                                placeholder="To"
                                value={field.value || null}
                                onChange={(e: any) => {
                                  checkOverlapForDay(day);
                                  field.onChange(e);
                                  // console.log(e);
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
          <button type="submit" className="btn btn-primary w-full mt-8">
            Save
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RestaurantAvailability;
