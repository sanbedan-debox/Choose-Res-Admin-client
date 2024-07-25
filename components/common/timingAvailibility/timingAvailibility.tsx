// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import moment, { Moment } from "moment";
// import { FaPlus, FaMinus } from "react-icons/fa";

// // Enum for days of the week
// enum DaysEnum {
//   Sunday,
//   Monday,
//   Tuesday,
//   Wednesday,
//   Thursday,
//   Friday,
//   Saturday,
// }

// // Interface for hour range
// interface HourRange {
//   start: Moment;
//   end: Moment;
// }

// // Interface for availability data
// interface Availability {
//   day: DaysEnum;
//   hours: HourRange[];
//   active: boolean;
// }

// const daysOfWeek = [
//   { value: DaysEnum.Sunday, label: "Sunday" },
//   { value: DaysEnum.Monday, label: "Monday" },
//   { value: DaysEnum.Tuesday, label: "Tuesday" },
//   { value: DaysEnum.Wednesday, label: "Wednesday" },
//   { value: DaysEnum.Thursday, label: "Thursday" },
//   { value: DaysEnum.Friday, label: "Friday" },
//   { value: DaysEnum.Saturday, label: "Saturday" },
// ];

// const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
//   const time = moment()
//     .startOf("day")
//     .add(30 * i, "minutes");
//   return {
//     label: time.format("hh:mm A"),
//     value: time,
//   };
// });

// const convertToTimeOptions = (hours: HourRange[]) => {
//   return hours.map((hour) => ({
//     start: {
//       label: moment(hour.start).format("hh:mm A"),
//       value: moment(hour.start),
//     },
//     end: { label: moment(hour.end).format("hh:mm A"), value: moment(hour.end) },
//   }));
// };

// const AvailabilityComponent: React.FC = () => {
//   const [availability, setAvailability] = useState<Availability[]>([
//     { day: DaysEnum.Sunday, hours: [], active: false },
//     { day: DaysEnum.Monday, hours: [], active: false },
//     { day: DaysEnum.Tuesday, hours: [], active: false },
//     { day: DaysEnum.Wednesday, hours: [], active: false },
//     { day: DaysEnum.Thursday, hours: [], active: false },
//     { day: DaysEnum.Friday, hours: [], active: false },
//     { day: DaysEnum.Saturday, hours: [], active: false },
//   ]);

//   const [showCopyButton, setShowCopyButton] = useState<boolean>(true);

//   //   useEffect(() => {
//   //     // Fetch availability data from server and set state
//   //     const fetchData = async () => {
//   //       const data = await fetch("/api/availability").then((res) => res.json());
//   //       const formattedData = data.map((item: Availability) => ({
//   //         ...item,
//   //         hours: convertToTimeOptions(item.hours),
//   //       }));
//   //       setAvailability(formattedData);
//   //     };

//   //     fetchData();
//   //   }, []);

//   // Function to handle adding hours
//   const handleAddHours = (index: number) => {
//     const newHours = [...availability];
//     newHours[index].hours.push({
//       start: { label: moment().format("hh:mm A"), value: moment() },
//       end: {
//         label: moment().add(30, "minutes").format("hh:mm A"),
//         value: moment().add(30, "minutes"),
//       },
//     });
//     setAvailability(newHours);
//   };

//   // Function to handle removing hours
//   const handleRemoveHours = (dayIndex: number, hourIndex: number) => {
//     const newHours = [...availability];
//     newHours[dayIndex].hours.splice(hourIndex, 1);
//     setAvailability(newHours);
//   };

//   // Function to handle copying hours to all weekdays
//   const handleCopyHours = (dayIndex: number) => {
//     const newHours = [...availability];
//     const hoursToCopy = newHours[dayIndex].hours;

//     newHours.forEach((day, index) => {
//       if (index !== dayIndex) {
//         day.hours = [...hoursToCopy];
//       }
//     });

//     setAvailability(newHours);
//     setShowCopyButton(false);
//   };

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: "10px",
//         }}
//       >
//         {daysOfWeek.map((day, index) => (
//           <button
//             key={index}
//             className={` rounded-full w-8 h-8 align-middle justify-center cursor-pointer text-white ${
//               availability[index].active ? "bg-primary" : "bg-gray-400"
//             }`}
//             type="button"
//             onClick={() => {
//               const newAvailability = [...availability];
//               newAvailability[index].active = !newAvailability[index].active;
//               if (
//                 newAvailability[index].active &&
//                 newAvailability[index].hours.length === 0
//               ) {
//                 handleAddHours(index);
//               }
//               setAvailability(newAvailability);
//             }}
//           >
//             {day.label[0]}
//           </button>
//         ))}
//       </div>
//       {showCopyButton && availability.some((day) => day.hours.length > 0) && (
//         <button
//           className=" text-primary"
//           type="button"
//           onClick={() =>
//             handleCopyHours(
//               daysOfWeek.findIndex((day) => day.label === "Sunday")
//             )
//           }
//         >
//           Copy times to all
//         </button>
//       )}
//       {availability.map((day, index) => (
//         <div key={index} style={{ marginBottom: "20px" }}>
//           <div
//             className="text-start"
//             style={{ fontWeight: "bold", marginBottom: "10px" }}
//           >
//             {daysOfWeek[day.day].label}
//           </div>
//           {day.active && (
//             <div>
//               {day.hours.map((hour, hourIndex) => (
//                 <div
//                   key={hourIndex}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <Select
//                     options={timeOptions}
//                     value={hour.start}
//                     onChange={(selectedOption) => {
//                       const newAvailability = [...availability];
//                       newAvailability[index].hours[hourIndex].start =
//                         selectedOption;
//                       setAvailability(newAvailability);
//                     }}
//                     styles={{
//                       container: (base) => ({
//                         ...base,
//                         flex: 1,
//                         marginRight: "10px",
//                       }),
//                     }}
//                   />
//                   <Select
//                     options={timeOptions}
//                     value={hour.end}
//                     onChange={(selectedOption) => {
//                       const newAvailability = [...availability];
//                       newAvailability[index].hours[hourIndex].end =
//                         selectedOption;
//                       setAvailability(newAvailability);
//                     }}
//                     styles={{
//                       container: (base) => ({
//                         ...base,
//                         flex: 1,
//                         marginRight: "10px",
//                       }),
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveHours(index, hourIndex)}
//                     style={{ marginRight: "10px" }}
//                   >
//                     <FaMinus />
//                   </button>
//                   {hourIndex === day.hours.length - 1 && (
//                     <button
//                       type="button"
//                       onClick={() => handleAddHours(index)}
//                       style={{ marginRight: "10px" }}
//                     >
//                       <FaPlus />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AvailabilityComponent;
import React, { useState } from "react";
import Select from "react-select";
import moment, { Moment } from "moment";
import { FaPlus, FaMinus } from "react-icons/fa";

// Enum for days of the week
enum DaysEnum {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

// Interface for hour range
interface HourRange {
  start: Moment;
  end: Moment;
}

// Interface for availability data
interface Availability {
  day: DaysEnum;
  hours: HourRange[];
  active: boolean;
}

interface AvailabilityComponentProps {
  availability: Availability[];
  setAvailability: React.Dispatch<React.SetStateAction<Availability[]>>;
}

const daysOfWeek = [
  { value: DaysEnum.Sunday, label: "Sunday" },
  { value: DaysEnum.Monday, label: "Monday" },
  { value: DaysEnum.Tuesday, label: "Tuesday" },
  { value: DaysEnum.Wednesday, label: "Wednesday" },
  { value: DaysEnum.Thursday, label: "Thursday" },
  { value: DaysEnum.Friday, label: "Friday" },
  { value: DaysEnum.Saturday, label: "Saturday" },
];

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const time = moment()
    .startOf("day")
    .add(30 * i, "minutes");
  return {
    label: time.format("hh:mm A"),
    value: time,
  };
});

const AvailabilityComponent: React.FC<AvailabilityComponentProps> = ({
  availability,
  setAvailability,
}) => {
  const [showCopyButton, setShowCopyButton] = useState<boolean>(true);

  // Function to handle adding hours
  const handleAddHours = (index: number) => {
    const newHours = [...availability];
    newHours[index].hours.push({
      start: { label: moment().format("hh:mm A"), value: moment() },
      end: {
        label: moment().add(30, "minutes").format("hh:mm A"),
        value: moment().add(30, "minutes"),
      },
    });
    setAvailability(newHours);
  };

  // Function to handle removing hours
  const handleRemoveHours = (dayIndex: number, hourIndex: number) => {
    const newHours = [...availability];
    newHours[dayIndex].hours.splice(hourIndex, 1);
    setAvailability(newHours);
  };

  // Function to handle copying hours to all weekdays
  const handleCopyHours = (dayIndex: number) => {
    const newHours = [...availability];
    const hoursToCopy = newHours[dayIndex].hours;

    newHours.forEach((day, index) => {
      if (index !== dayIndex) {
        day.hours = [...hoursToCopy];
      }
    });

    setAvailability(newHours);
    setShowCopyButton(false);
  };

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
          <button
            key={index}
            className={` rounded-full w-8 h-8 align-middle justify-center cursor-pointer text-white ${
              availability[index].active ? "bg-primary" : "bg-gray-400"
            }`}
            type="button"
            onClick={() => {
              const newAvailability = [...availability];
              newAvailability[index].active = !newAvailability[index].active;
              if (
                newAvailability[index].active &&
                newAvailability[index].hours.length === 0
              ) {
                handleAddHours(index);
              }
              setAvailability(newAvailability);
            }}
          >
            {day.label[0]}
          </button>
        ))}
      </div>
      {showCopyButton && availability.some((day) => day.hours.length > 0) && (
        <button
          className=" text-primary"
          type="button"
          onClick={() =>
            handleCopyHours(
              daysOfWeek.findIndex((day) => day.label === "Sunday")
            )
          }
        >
          Copy times to all
        </button>
      )}
      {availability.map((day, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <div
            className="text-start"
            style={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            {daysOfWeek[day.day].label}
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
                        selectedOption;
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
                        selectedOption;
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
