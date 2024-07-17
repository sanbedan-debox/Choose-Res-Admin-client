// // import React, { useState } from "react";
// // import CustomSwitch from "../customSwitch/customSwitch";
// // import ReusableModal from "../modal/modal";
// // import CButton from "../button/button";

// // const daysOfWeek = [
// //   "Sunday",
// //   "Monday",
// //   "Tuesday",
// //   "Wednesday",
// //   "Thursday",
// //   "Friday",
// //   "Saturday",
// // ];

// // interface AvailabilityState {
// //   [key: string]: boolean;
// // }

// // const handleStatusCloseConfirmationModal = () => {
// //   setShowStatusConfirmationModal(false);
// //   setSelectedItemId("");
// // };

// // const DaysAvailability: React.FC = () => {
// //   const [availability, setAvailability] = useState<AvailabilityState>(
// //     daysOfWeek.reduce((acc, day) => {
// //       acc[day] = true; // Assume all days are available by default
// //       return acc;
// //     }, {} as AvailabilityState)
// //   );

// //   const handleToggle = (day: string) => {
// //     setAvailability((prev) => {
// //       const newAvailability = { ...prev, [day]: !prev[day] };
// //       if (newAvailability[day]) {
// //         console.log("available all day pressed");
// //       }
// //       return newAvailability;
// //     });
// //   };

// //   return (
// //     <div className="p-4 bg-white shadow-md rounded-lg">
// //       {daysOfWeek.map((day) => (
// //         <div
// //           key={day}
// //           className="flex items-center justify-between py-2 border-b last:border-none"
// //         >
// //           <div className="flex flex-col text-start ">
// //             <span className="font-medium text-gray-700">{day}</span>
// //             <span
// //               onClick={() => console.log(day)}
// //               className="text-gray-500 cursor-pointer"
// //             >
// //               Available as per restaurant timings
// //             </span>
// //           </div>
// //           <CustomSwitch
// //             checked={availability[day]}
// //             onChange={() => handleToggle(day)}
// //             label={`Toggle ${day} availability`}
// //           />
// //         </div>
// //       ))}

// //       <ReusableModal
// //         isOpen={showAddHourModal}
// //         onClose={handleCloseHourModal}
// //         title={`Add Hours for `}
// //         comments="this menu will be available according all day according to the Restaurant Timings unless you add hours"
// //       >
// //         <div className="flex justify-end space-x-4">
// //           <CButton
// //             variant={ButtonType.Primary}
// //             onClick={handleStatusConfirmation}
// //           >
// //             Yes
// //           </CButton>
// //         </div>
// //       </ReusableModal>
// //     </div>
// //   );
// // };

// // export default DaysAvailability;
// import { useFieldArray, Controller } from "react-hook-form";
// import Select from "react-select";
// import { Day } from "@/generated/graphql";

// const generateTimeOptions = () => {
//   const options: { value: string; label: string }[] = [];
//   const periods = ["AM", "PM"];

//   for (let hour = 0; hour < 24; hour++) {
//     for (let minute = 0; minute < 60; minute += 15) {
//       const period = periods[Math.floor(hour / 12)];
//       const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//       const displayMinute = minute === 0 ? "00" : minute.toString();
//       const time = `${displayHour}:${displayMinute} ${period}`;

//       const date = new Date();
//       date.setHours(hour, minute, 0, 0);

//       const isoTime = date.toISOString();

//       options.push({ value: isoTime, label: time });
//     }
//   }
//   return options;
// };

// const timeOptions = generateTimeOptions();

// const days = Object.values(Day);

// type TimeSlot = {
//   from: { label: string; value: string };
//   to: { label: string; value: string };
// };

// type RegularHours = {
//   [key in Day]: TimeSlot[];
// };

// type ActiveDays = {
//   [key in Day]: boolean;
// };

// interface AvailabilityFormProps {
//   control: any;
//   setValue: any;
//   getValues: any;
//   errors: any;
//   watch: any;
//   register: any;
// }

// const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
//   control,
//   setValue,
//   getValues,
//   errors,
//   watch,
//   register,
// }) => {
//   const dayFieldArray: any = {
//     Monday: useFieldArray({ control, name: "regularHours.Monday" }),
//     Tuesday: useFieldArray({ control, name: "regularHours.Tuesday" }),
//     Wednesday: useFieldArray({ control, name: "regularHours.Wednesday" }),
//     Thursday: useFieldArray({ control, name: "regularHours.Thursday" }),
//     Friday: useFieldArray({ control, name: "regularHours.Friday" }),
//     Saturday: useFieldArray({ control, name: "regularHours.Saturday" }),
//     Sunday: useFieldArray({ control, name: "regularHours.Sunday" }),
//   };

//   const activeDays = watch("activeDays");

//   const checkOverlapForDay = (day: string) => {
//     let hours: TimeSlot[] = [];

//     switch (day) {
//       case Day.Monday:
//         hours = getValues(`regularHours.Monday`);
//         break;
//       case Day.Tuesday:
//         hours = getValues(`regularHours.Tuesday`);
//         break;
//       case Day.Wednesday:
//         hours = getValues(`regularHours.Wednesday`);
//         break;
//       case Day.Thursday:
//         hours = getValues(`regularHours.Thursday`);
//         break;
//       case Day.Friday:
//         hours = getValues(`regularHours.Friday`);
//         break;
//       case Day.Saturday:
//         hours = getValues(`regularHours.Saturday`);
//         break;
//       case Day.Sunday:
//         hours = getValues(`regularHours.Sunday`);
//         break;
//       default:
//         hours = [];
//         break;
//     }

//     for (let i = 0; i < hours.length; i++) {
//       const currentSession = hours[i];
//       const fromTime = new Date(currentSession.from.value);
//       const toTime = new Date(currentSession.to.value);

//       if (toTime <= fromTime) {
//         alert(
//           `Invalid session times: "to" time cannot be less than or equal to "from" time.`
//         );
//       }

//       if (i > 0) {
//         const previousSession = hours[i - 1];
//         const previousToTime = new Date(previousSession.to.value);

//         if (fromTime <= previousToTime) {
//           alert(
//             `Invalid session times: Start time overlaps with or is before previous session's end time.`
//           );
//         }
//       }
//     }
//   };

//   return (
//     <>
//       {days.map((day) => (
//         <div key={day}>
//           <label>
//             <input
//               type="checkbox"
//               {...register(`activeDays.${day}`)}
//               checked={activeDays[day]}
//               onChange={() => setValue(`activeDays.${day}`, !activeDays[day])}
//             />
//             {day}
//           </label>
//           {activeDays[day] && (
//             <>
//               {dayFieldArray[day].fields.map((field: any, index: number) => (
//                 <div key={field.id}>
//                   <Controller
//                     name={`regularHours.${day}[${index}].from`}
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         {...field}
//                         options={timeOptions}
//                         onChange={(selectedOption) => {
//                           field.onChange(selectedOption);
//                           checkOverlapForDay(day);
//                         }}
//                       />
//                     )}
//                   />
//                   <Controller
//                     name={`regularHours.${day}[${index}].to`}
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         {...field}
//                         options={timeOptions}
//                         onChange={(selectedOption) => {
//                           field.onChange(selectedOption);
//                           checkOverlapForDay(day);
//                         }}
//                       />
//                     )}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => dayFieldArray[day].remove(index)}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() =>
//                   dayFieldArray[day].append({
//                     from: { label: "", value: "" },
//                     to: { label: "", value: "" },
//                   })
//                 }
//               >
//                 Add Time Slot
//               </button>
//             </>
//           )}
//         </div>
//       ))}
//     </>
//   );
// };

// export default AvailabilityForm;
