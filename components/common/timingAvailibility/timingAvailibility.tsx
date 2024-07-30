import React, { useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Day } from "@/generated/graphql";
import useGlobalStore from "@/store/global";
import { extractErrorMessage } from "@/utils/utilFUncs";
import CustomSwitch from "../customSwitch/customSwitch";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { AvailabilityComponentProps, daysOfWeek } from "./interface";

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
  // const [copyPerformed, setCopyPerformed] = useState<boolean>(false);

  useEffect(() => {
    console.log("hello from availibility", availability);
    const firstFilledDayIndex = availability.findIndex(
      (day) => day.active && day.hours.length > 0
    );
    if (firstFilledDayIndex >= 0 && copiedDayIndex === null) {
      setCopiedDayIndex(firstFilledDayIndex);
    }
  }, [availability, copiedDayIndex]);

  const defaultStartTime = timeOptions[0];
  const defaultEndTime = timeOptions[timeOptions.length - 1];

  const handleAddHours = (index: number) => {
    const newHours = [...availability];
    newHours[index].hours.push({
      start: defaultStartTime,
      end: defaultEndTime,
    });

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
      day.active = true;
      day.hours = hoursToCopy.map((hour) => ({
        start: { ...hour.start },
        end: { ...hour.end },
      }));
    });

    setAvailability(newAvailability);
    // setCopyPerformed(true);
    setCopiedDayIndex(null);
  };

  // const validateAvailability = (data: Availability[]) => {
  //   let error = null;
  //   data.forEach((day) => {
  //     if (day.active) {
  //       day.hours.forEach((hour, index) => {
  //         if (moment(hour.start.value).isAfter(moment(hour.end.value))) {
  //           error = `Start time cannot be after end time on ${day.day}`;
  //         }
  //         for (let i = 0; i < day.hours.length; i++) {
  //           if (i !== index) {
  //             if (
  //               moment(hour.start.value).isBefore(
  //                 moment(day.hours[i].end.value)
  //               ) &&
  //               moment(hour.end.value).isAfter(moment(day.hours[i].start.value))
  //             ) {
  //               error = `Overlapping hours on ${day.day}`;
  //             }
  //           }
  //         }
  //       });
  //     }
  //   });
  //   return { success: error === null, error };
  // };

  const { setToastData } = useGlobalStore();
  // useEffect(() => {
  //   const res = validateAvailability(availability);
  //   if (res.error) {
  //     setToastData({
  //       message: extractErrorMessage(res.error),
  //       type: "error",
  //     });
  //   }
  // }, [availability]);

  return (
    <div>
      {validationErrors && (
        <div className="text-red-500 mb-2">{validationErrors}</div>
      )}
      {availability.map((day, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ width: "200px" }}>
              {/* <input
                type="checkbox"
                checked={day.active}
                onChange={() => {
                  const newAvailability = [...availability];
                  newAvailability[index].active =
                    !newAvailability[index].active;
                  if (
                    newAvailability[index].active &&
                    newAvailability[index].hours.length === 0
                  ) {
                    handleAddHours(index);
                  }
                  setAvailability(newAvailability);
                }}
                className="mr-2"
              /> */}
              <CustomSwitch
                checked={day.active}
                onChange={() => {
                  const newAvailability = [...availability];
                  newAvailability[index].active =
                    !newAvailability[index].active;
                  if (
                    newAvailability[index].active &&
                    newAvailability[index].hours.length === 0
                  ) {
                    handleAddHours(index);
                  }
                  setAvailability(newAvailability);
                }}
                label={
                  daysOfWeek.find((d) => d.value === day.day)?.label ||
                  "Unknown Day"
                }
                className="mr-2"
              />

              <div className="font-bold text-sm">
                {daysOfWeek.find((d) => d.value === day.day)?.label ||
                  "Unknown Day"}
              </div>
            </div>
            <div className="flex flex-col" style={{ width: "600px" }}>
              {day.hours.map((hour, hourIndex) => (
                <div key={hourIndex} className="flex items-center mb-2">
                  <Select
                    options={timeOptions}
                    value={hour.start}
                    onChange={(selectedOption) => {
                      const newAvailability = [...availability];
                      newAvailability[index].hours[hourIndex].start =
                        selectedOption!;
                      setAvailability(newAvailability);
                    }}
                    isDisabled={!day.active}
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
                    isDisabled={!day.active}
                    styles={{
                      container: (base) => ({
                        ...base,
                        flex: 1,
                        marginRight: "10px",
                      }),
                    }}
                  />
                </div>
              ))}
            </div>
            <div
              className="flex items-end justify-end"
              style={{ width: "230px" }}
            >
              {day.active && (
                <>
                  {day.hours.length > 0 && (
                    <>
                      {day.hours.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveHours(index, day.hours.length - 1)
                          }
                          className="mr-1 text-2xl hover:text-primary"
                          disabled={!day.active}
                        >
                          <CiCircleMinus />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddHours(index)}
                        className="mr-1 text-2xl hover:text-primary"
                        disabled={!day.active}
                      >
                        <CiCirclePlus />
                      </button>
                    </>
                  )}
                  {copiedDayIndex === index && (
                    <button
                      className="text-primary text-sm "
                      type="button"
                      onClick={() => handleCopyHours(index)}
                    >
                      Copy to all
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailabilityComponent;
