import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import Select from "react-select";

const BusinessHours = () => {
  const { control } = useFormContext();

  const timeOptions = Array.from({ length: 24 }, (_, hour) =>
    Array.from({ length: 4 }, (_, quarter) => ({
      value: `${String(hour).padStart(2, "0")}:${String(quarter * 15).padStart(
        2,
        "0"
      )}`,
      label: `${String(hour).padStart(2, "0")}:${String(quarter * 15).padStart(
        2,
        "0"
      )}`,
    }))
  ).flat();

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-left text-gray-700">
        Regular hours
      </label>
      <div className="space-y-2">
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div key={day} className="grid grid-cols-4 gap-2 items-center">
            <input type="checkbox" {...register(`hours.${day}.open`)} />
            <label className="block text-sm font-medium text-gray-700 col-span-1">
              {day}
            </label>
            <Controller
              name={`hours.${day}.from`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={timeOptions}
                  className="text-sm rounded-lg col-span-1"
                  placeholder="From"
                />
              )}
            />
            <Controller
              name={`hours.${day}.to`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={timeOptions}
                  className="text-sm rounded-lg col-span-1"
                  placeholder="To"
                />
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
