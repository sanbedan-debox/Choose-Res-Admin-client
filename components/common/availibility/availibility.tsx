import { useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import { Day } from "@/generated/graphql";

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

const days = Object.values(Day);

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

interface AvailabilityFormProps {
  control: any;
  setValue: any;
  getValues: any;
  errors: any;
  watch: any;
  register: any;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  control,
  setValue,
  getValues,
  errors,
  watch,
  register,
}) => {
  const dayFieldArray: any = {
    Monday: useFieldArray({ control, name: "regularHours.Monday" }),
    Tuesday: useFieldArray({ control, name: "regularHours.Tuesday" }),
    Wednesday: useFieldArray({ control, name: "regularHours.Wednesday" }),
    Thursday: useFieldArray({ control, name: "regularHours.Thursday" }),
    Friday: useFieldArray({ control, name: "regularHours.Friday" }),
    Saturday: useFieldArray({ control, name: "regularHours.Saturday" }),
    Sunday: useFieldArray({ control, name: "regularHours.Sunday" }),
  };

  const activeDays = watch("activeDays");

  const checkOverlapForDay = (day: string) => {
    let hours: TimeSlot[] = [];

    switch (day) {
      case Day.Monday:
        hours = getValues(`regularHours.Monday`);
        break;
      case Day.Tuesday:
        hours = getValues(`regularHours.Tuesday`);
        break;
      case Day.Wednesday:
        hours = getValues(`regularHours.Wednesday`);
        break;
      case Day.Thursday:
        hours = getValues(`regularHours.Thursday`);
        break;
      case Day.Friday:
        hours = getValues(`regularHours.Friday`);
        break;
      case Day.Saturday:
        hours = getValues(`regularHours.Saturday`);
        break;
      case Day.Sunday:
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

  return (
    <div>
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
                  {...register(`activeDays.${day}` as any)}
                  className="rounded text-primary-500 mr-2"
                  // onChange={(e) => onChange(e.target.checked)}
                />

                <div className="space-y-2 w-full">
                  {dayFieldArray[day].fields.map((item: any, index: any) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Controller
                        control={control}
                        name={`regularHours.${day}.${index}.from` as any}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={timeOptions}
                            isDisabled={
                              !activeDays[day as keyof typeof activeDays]
                            }
                            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                            classNamePrefix="react-select"
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
                        name={`regularHours.${day}.${index}.to` as any}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={timeOptions}
                            isDisabled={
                              !activeDays[day as keyof typeof activeDays]
                            }
                            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                            classNamePrefix="react-select"
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
  );
};

export default AvailabilityForm;
