import React, { useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Day } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import { extractErrorMessage } from "@/utils/utilFUncs";

interface Availability {
  day: Day;
  hours: {
    start: { label: string; value: string };
    end: { label: string; value: string };
  }[];
  active: boolean;
}

interface AvailabilityComponentProps {
  availability: Availability[];
  setAvailability: React.Dispatch<React.SetStateAction<Availability[]>>;
}

const daysOfWeek = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const time = moment()
    .startOf("day")
    .add(30 * i, "minutes");
  return {
    label: time.format("hh:mm A"),
    value: time.toISOString(),
  };
});

const AvailabilityComponent: React.FC<AvailabilityComponentProps> = ({
  availability,
  setAvailability,
}) => {
  const [validationErrors, setValidationErrors] = useState<string | null>(null);
  const [copiedDayIndex, setCopiedDayIndex] = useState<number | null>(null);
  const [copyPerformed, setCopyPerformed] = useState<boolean>(false);

  useEffect(() => {
    console.log("hello from availibility", availability);
    const firstFilledDayIndex = availability.findIndex(
      (day) => day.active && day.hours.length > 0
    );
    if (firstFilledDayIndex >= 0 && copiedDayIndex === null && !copyPerformed) {
      setCopiedDayIndex(firstFilledDayIndex);
    }
  }, [availability, copiedDayIndex, copyPerformed]);

  const defaultStartTime = timeOptions[0];
  const defaultEndTime = timeOptions[timeOptions.length - 1];

  const handleAddHours = (index: number) => {
    const newHours = [...availability];
    newHours[index].hours.push({
      start: defaultStartTime,
      end: defaultEndTime,
    });
    const validationResult = validateAvailability(newHours);
    if (!validationResult.success) {
      setValidationErrors(validationResult.error);
      return;
    }
    setAvailability(newHours);
    setValidationErrors(null);
  };

  const handleRemoveHours = (dayIndex: number, hourIndex: number) => {
    const newHours = [...availability];
    newHours[dayIndex].hours.splice(hourIndex, 1);
    setAvailability(newHours);
  };

  const handleCopyHours = (dayIndex: number) => {
    const newAvailability = [...availability];
    const hoursToCopy = newAvailability[dayIndex].hours.map((hour) => ({
      start: { ...hour.start },
      end: { ...hour.end },
    }));

    newAvailability.forEach((day) => {
      if (!day.active || day.hours.length === 0) {
        day.active = true;
        day.hours = hoursToCopy.map((hour) => ({
          start: { ...hour.start },
          end: { ...hour.end },
        }));
      }
    });

    setAvailability(newAvailability);
    setCopyPerformed(true);
    setCopiedDayIndex(null);
  };

  const validateAvailability = (data: Availability[]) => {
    let error = null;
    data.forEach((day) => {
      if (day.active) {
        day.hours.forEach((hour, index) => {
          if (moment(hour.start.value).isAfter(moment(hour.end.value))) {
            error = `Start time cannot be after end time on ${day.day}`;
          }
          for (let i = 0; i < day.hours.length; i++) {
            if (i !== index) {
              if (
                moment(hour.start.value).isBefore(
                  moment(day.hours[i].end.value)
                ) &&
                moment(hour.end.value).isAfter(moment(day.hours[i].start.value))
              ) {
                error = `Overlapping hours on ${day.day}`;
              }
            }
          }
        });
      }
    });
    return { success: error === null, error };
  };

  const { setToastData } = useGlobalStore();
  useEffect(() => {
    const res = validateAvailability(availability);
    if (res.error) {
      setToastData({
        message: extractErrorMessage(res.error),
        type: "error",
      });
    }
  }, [availability]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        {daysOfWeek.map((day, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <button
              className={`rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-white ${
                availability.find((av) => av.day === day.value)?.active
                  ? "bg-primary"
                  : "bg-gray-400"
              }`}
              type="button"
              onClick={() => {
                const newAvailability = [...availability];
                const dayIndex = newAvailability.findIndex(
                  (av) => av.day === day.value
                );
                newAvailability[dayIndex].active =
                  !newAvailability[dayIndex].active;
                if (
                  newAvailability[dayIndex].active &&
                  newAvailability[dayIndex].hours.length === 0
                ) {
                  handleAddHours(dayIndex);
                }
                setAvailability(newAvailability);
              }}
            >
              {day.label[0]}
            </button>
            {copiedDayIndex === index && !copyPerformed && (
              <button
                className="text-primary ml-2"
                type="button"
                onClick={() => handleCopyHours(index)}
              >
                Copy times to all
              </button>
            )}
          </div>
        ))}
      </div>
      {validationErrors && (
        <div className="text-red-500" style={{ marginBottom: "10px" }}>
          {validationErrors}
        </div>
      )}
      {availability.map((day, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <div
            className="text-start"
            style={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            {daysOfWeek.find((d) => d.value === day.day)?.label ||
              "Unknown Day"}
          </div>
          {day.active && (
            <div>
              {day.hours.map((hour, hourIndex) => (
                <div
                  key={hourIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Select
                    options={timeOptions}
                    value={hour.start}
                    onChange={(selectedOption) => {
                      const newAvailability = [...availability];
                      newAvailability[index].hours[hourIndex].start =
                        selectedOption!;
                      setAvailability(newAvailability);
                    }}
                    styles={{
                      container: (base) => ({
                        ...base,
                        flex: 1,
                        marginRight: "10px",
                      }),
                    }}
                  />
                  <Select
                    options={timeOptions}
                    value={hour.end}
                    onChange={(selectedOption) => {
                      const newAvailability = [...availability];
                      newAvailability[index].hours[hourIndex].end =
                        selectedOption!;
                      setAvailability(newAvailability);
                    }}
                    styles={{
                      container: (base) => ({
                        ...base,
                        flex: 1,
                        marginRight: "10px",
                      }),
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHours(index, hourIndex)}
                    style={{ marginRight: "10px" }}
                  >
                    <FaMinus />
                  </button>
                  {hourIndex === day.hours.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleAddHours(index)}
                      style={{ marginRight: "10px" }}
                    >
                      <FaPlus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvailabilityComponent;
