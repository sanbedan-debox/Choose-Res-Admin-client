// import { motion } from "framer-motion";
// import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
// import Image from "next/image";
// import logo1 from "../../../assets/logo/logoWhite.png";
// import { useRouter } from "next/router";
// import CButton from "@/components/common/button/button";
// import { ButtonType } from "@/components/common/button/interface";
// import useGlobalStore from "@/store/global";
// import { useForm } from "react-hook-form";
// import Select from "react-select";
// import { locationTypeOptions, timeZoneOptions } from "./interface/interface";

// const Locations = () => {
//   const { setToastData } = useGlobalStore();
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log(data);
//     router.push("/onboarding/integrations");
//   };

//   return (
//     <motion.div
//       className="z-10 flex flex-col w-full max-w-md items-center space-y-5 text-center"
//       variants={{
//         hidden: { opacity: 0, scale: 0.95 },
//         show: {
//           opacity: 1,
//           scale: 1,
//           transition: { staggerChildren: 0.2 },
//         },
//       }}
//       initial="hidden"
//       animate="show"
//       exit="hidden"
//       transition={{ duration: 0.3, type: "spring" }}
//     >
//       <motion.div
//         variants={STAGGER_CHILD_VARIANTS}
//         className="flex flex-col items-center space-y-5 text-center"
//       >
//         <h1 className="font-display max-w-md text-2xl font-semibold transition-colors">
//           Location Details
//         </h1>
//       </motion.div>

//       <form
//         className="space-y-4 md:space-y-3 w-full max-w-2xl"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Location business name
//           </label>
//           <input
//             type="text"
//             {...register("businessName", {
//               required: "Business name is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="Name"
//           />
//           {errors.businessName && (
//             <p className="text-red-500 text-sm">
//               {errors.businessName.message}
//             </p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Location nickname
//           </label>
//           <input
//             type="text"
//             {...register("locationNickname", {
//               required: "Location nickname is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="Location nickname"
//           />
//           {errors.locationNickname && (
//             <p className="text-red-500 text-sm">
//               {errors.locationNickname.message}
//             </p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Business description
//           </label>
//           <textarea
//             {...register("businessDescription", {
//               required: "Business description is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="Business description"
//             rows="4"
//           />
//           {errors.businessDescription && (
//             <p className="text-red-500 text-sm">
//               {errors.businessDescription.message}
//             </p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Location type
//           </label>
//           <Select
//             {...register("locationType", {
//               required: "Location type is required",
//             })}
//             //Hello
//             options={locationTypeOptions}
//             className="mt-1 text-sm rounded-lg w-full focus:outline-none"
//             classNamePrefix="react-select"
//             placeholder="Select location type"
//           />
//           {errors.locationType && (
//             <p className="text-red-500 text-sm">
//               {errors.locationType.message}
//             </p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Address Line 1
//           </label>
//           <input
//             type="text"
//             {...register("addressLine1", {
//               required: "Address Line 1 is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="Address Line 1"
//           />
//           {errors.addressLine1 && (
//             <p className="text-red-500 text-sm">
//               {errors.addressLine1.message}
//             </p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             City
//           </label>
//           <input
//             type="text"
//             {...register("city", {
//               required: "City is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="City"
//           />
//           {errors.city && (
//             <p className="text-red-500 text-sm">{errors.city.message}</p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             State
//           </label>
//           <input
//             type="text"
//             {...register("state", {
//               required: "State is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="State"
//           />
//           {errors.state && (
//             <p className="text-red-500 text-sm">{errors.state.message}</p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Postcode
//           </label>
//           <input
//             type="text"
//             {...register("postcode", {
//               required: "Postcode is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="Postcode"
//           />
//           {errors.postcode && (
//             <p className="text-red-500 text-sm">{errors.postcode.message}</p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Email
//           </label>
//           <input
//             type="email"
//             {...register("email", {
//               required: "Email is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="Email"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm">{errors.email.message}</p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Phone
//           </label>
//           <input
//             type="text"
//             {...register("phone", {
//               required: "Phone is required",
//             })}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="Phone"
//           />
//           {errors.phone && (
//             <p className="text-red-500 text-sm">{errors.phone.message}</p>
//           )}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Website
//           </label>
//           <input
//             type="text"
//             {...register("website")}
//             className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//             placeholder="Website"
//           />
//         </div>

//         {/* <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Branding
//           </label>
//           <div className="mb-4">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Logo
//             </label>
//             <input
//               type="file"
//               {...register("logo")}
//               className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Point-of-sale checkout background
//             </label>
//             <input
//               type="file"
//               {...register("checkoutBackground")}
//               className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
//             />
//           </div>
//         </div> */}
//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Branding
//           </label>
//           <div className="mb-4">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Logo
//             </label>
//             <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100">
//               <input
//                 type="file"
//                 {...register("logo")}
//                 className="hidden"
//                 id="logo-upload"
//               />
//               <label htmlFor="logo-upload" className="cursor-pointer">
//                 <div className="text-gray-500">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="w-6 h-6 mx-auto"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 7l3-3m0 0l3 3M6 4v12M21 11v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7M16 8l-3-3m0 0l-3 3m3-3v12"
//                     />
//                   </svg>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Drag and drop a logo or{" "}
//                   <span className="text-blue-600">browse file</span>
//                 </p>
//               </label>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Point-of-sale checkout background
//             </label>
//             <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100">
//               <input
//                 type="file"
//                 {...register("checkoutBackground")}
//                 className="hidden"
//                 id="checkout-background-upload"
//               />
//               <label
//                 htmlFor="checkout-background-upload"
//                 className="cursor-pointer"
//               >
//                 <div className="text-gray-500">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="w-6 h-6 mx-auto"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 7l3-3m0 0l3 3M6 4v12M21 11v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7M16 8l-3-3m0 0l-3 3m3-3v12"
//                     />
//                   </svg>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Drag and drop an image or{" "}
//                   <span className="text-blue-600">browse file</span>
//                 </p>
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//             Business Hours
//           </label>
//           <div className="mb-4">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Time Zone
//             </label>
//             <Select
//               {...register("timeZone", {
//                 required: "Time Zone is required",
//               })}
//               // Hello
//               options={timeZoneOptions}
//               className="mt-1 text-sm rounded-lg w-full focus:outline-none"
//               classNamePrefix="react-select"
//               placeholder="Select time zone"
//             />
//             {errors.timeZone && (
//               <p className="text-red-500 text-sm">{errors.timeZone.message}</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Regular hours
//             </label>
//             <div className="space-y-2">
//               {[
//                 "Monday",
//                 "Tuesday",
//                 "Wednesday",
//                 "Thursday",
//                 "Friday",
//                 "Saturday",
//                 "Sunday",
//               ].map((day) => (
//                 <div key={day} className="flex items-center space-x-2">
//                   <input type="checkbox" {...register(`hours.${day}.open`)} />
//                   <label className="block text-sm font-medium text-gray-700">
//                     {day}
//                   </label>
//                   <input
//                     type="text"
//                     {...register(`hours.${day}.from`)}
//                     className="mt-1 border bg-input text-sm rounded-lg w-24 focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//                     placeholder="From"
//                   />
//                   <input
//                     type="text"
//                     {...register(`hours.${day}.to`)}
//                     className="mt-1 border bg-input text-sm rounded-lg w-24 focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
//                     placeholder="To"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="col-span-2">
//           <CButton
//             type={ButtonType.SUBMIT}
//             buttonText="Next"
//             className="w-full text-black bg-green-500 rounded-lg"
//           />
//         </div>
//       </form>
//     </motion.div>
//   );
// };

// export default Locations;

import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { locationTypeOptions, timeZoneOptions } from "./interface/interface";

const Locations = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    router.push("/onboarding/integrations");
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
          Location Details
        </h1>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Location business name
          </label>
          <input
            type="text"
            {...register("businessName", {
              required: "Business name is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm">
              {errors.businessName.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Location nickname
          </label>
          <input
            type="text"
            {...register("locationNickname", {
              required: "Location nickname is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Location nickname"
          />
          {errors.locationNickname && (
            <p className="text-red-500 text-sm">
              {errors.locationNickname.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Business description
          </label>
          <textarea
            {...register("businessDescription", {
              required: "Business description is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Business description"
            rows="4"
          />
          {errors.businessDescription && (
            <p className="text-red-500 text-sm">
              {errors.businessDescription.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Location type
          </label>
          <Select
            {...register("locationType", {
              required: "Location type is required",
            })}
            options={locationTypeOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none"
            classNamePrefix="react-select"
            placeholder="Select location type"
          />
          {errors.locationType && (
            <p className="text-red-500 text-sm">
              {errors.locationType.message}
            </p>
          )}
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
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Address Line 1"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            City
          </label>
          <input
            type="text"
            {...register("city", {
              required: "City is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="City"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            State
          </label>
          <input
            type="text"
            {...register("state", {
              required: "State is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="State"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Postcode
          </label>
          <input
            type="text"
            {...register("postcode", {
              required: "Postcode is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Postcode"
          />
          {errors.postcode && (
            <p className="text-red-500 text-sm">{errors.postcode.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Phone
          </label>
          <input
            type="text"
            {...register("phone", {
              required: "Phone is required",
            })}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Phone"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Website
          </label>
          <input
            type="text"
            {...register("website")}
            className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
            placeholder="Website"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Branding
          </label>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Timezone
            </label>
            <Select
              {...register("timezone", {
                required: "Timezone is required",
              })}
              options={timeZoneOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none"
              classNamePrefix="react-select"
              placeholder="Select timezone"
            />
            {errors.timezone && (
              <p className="text-red-500 text-sm">{errors.timezone.message}</p>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Business Hours
          </label>

          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("monday.open")}
                className="mr-2"
              />
              Monday
            </label>
            {watch("monday.open") && (
              <div className="flex space-x-2">
                <input
                  type="time"
                  {...register("monday.start")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
                <input
                  type="time"
                  {...register("monday.end")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
              </div>
            )}
          </div>

          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("tuesday.open")}
                className="mr-2"
              />
              Tuesday
            </label>
            {watch("tuesday.open") && (
              <div className="flex space-x-2">
                <input
                  type="time"
                  {...register("tuesday.start")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
                <input
                  type="time"
                  {...register("tuesday.end")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
              </div>
            )}
          </div>

          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("wednesday.open")}
                className="mr-2"
              />
              Wednesday
            </label>
            {watch("wednesday.open") && (
              <div className="flex space-x-2">
                <input
                  type="time"
                  {...register("wednesday.start")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
                <input
                  type="time"
                  {...register("wednesday.end")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
              </div>
            )}
          </div>

          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("thursday.open")}
                className="mr-2"
              />
              Thursday
            </label>
            {watch("thursday.open") && (
              <div className="flex space-x-2">
                <input
                  type="time"
                  {...register("thursday.start")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
                <input
                  type="time"
                  {...register("thursday.end")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
              </div>
            )}
          </div>

          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("friday.open")}
                className="mr-2"
              />
              Friday
            </label>
            {watch("friday.open") && (
              <div className="flex space-x-2">
                <input
                  type="time"
                  {...register("friday.start")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
                <input
                  type="time"
                  {...register("friday.end")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
              </div>
            )}
          </div>

          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("saturday.open")}
                className="mr-2"
              />
              Saturday
            </label>
            {watch("saturday.open") && (
              <div className="flex space-x-2">
                <input
                  type="time"
                  {...register("saturday.start")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
                <input
                  type="time"
                  {...register("saturday.end")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
              </div>
            )}
          </div>

          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("sunday.open")}
                className="mr-2"
              />
              Sunday
            </label>
            {watch("sunday.open") && (
              <div className="flex space-x-2">
                <input
                  type="time"
                  {...register("sunday.start")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
                <input
                  type="time"
                  {...register("sunday.end")}
                  className="mt-1 border bg-input text-sm rounded-lg w-full focus:outline-none block p-2.5 border-gray-500 placeholder-gray-400 text-black"
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2">
          <button
            onClick={() => router.push("/onboarding/location")}
            type="submit"
            className="inline-flex btn btn-primary items-center justify-center w-full mt-8"
          >
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Locations;
