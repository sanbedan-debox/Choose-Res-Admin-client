// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import AsyncSelect from "react-select/async";
// import debounce from "lodash.debounce";
// import useMasterStore from "@/store/masters";
// import useProfileStore from "@/store/profile";
// import { sdk } from "@/utils/graphqlClient";
// import ReusableModal from "@/components/common/modal/modal";
// import { FaEdit } from "react-icons/fa";

// interface IFormInput {
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: { id: string; value: string } | null;
//   postcode: string;
//   location: PlacesType;
// }

// type PlacesType = {
//   label: string;
//   value: string;
// };

// const loadOptions = (
//   inputValue: string,
//   callback: (options: PlacesType[]) => void
// ) => {
//   sdk.AllPlaces({ input: inputValue }).then((d) => {
//     callback(
//       d.getPlacesList.map((el) => ({
//         label: el.displayName,
//         value: el.placeId,
//       }))
//     );
//   });
// };

// const UserLocationForm: React.FC = () => {
//   const { statesOptions } = useMasterStore();
//   const {
//     addressLine1,
//     addressLine2,
//     city,
//     state,
//     postcode,
//     cords,
//     place,
//     setAddressLine1,
//     setAddressLine2,
//     setCity,
//     setState,
//     setPostcode,
//     setCords,
//     setPlace,
//   } = useProfileStore();

//   const [formState, setFormState] = useState<IFormInput>({
//     addressLine1,
//     addressLine2,
//     city,
//     state,
//     postcode,
//     location: { label: place?.displayName ?? "", value: place?.placeId ?? "" },
//   });

//   const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);
//   const [coords, setCoords] = useState<number[]>(cords);
//   const [errors, setErrors] = useState<Partial<IFormInput>>({});
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const debouncedLoadOptions = debounce(loadOptions, 800);

//   const handleInputChange = (field: keyof IFormInput, value: any) => {
//     setFormState((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleEditClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleSaveClick = () => {
//     setAddressLine1(formState.addressLine1);
//     setAddressLine2(formState.addressLine2);
//     setCity(formState.city);
//     setState(formState.state);
//     setPostcode(formState.postcode);
//     setPlace({
//       displayName: selectedPlace?.label ?? "",
//       placeId: selectedPlace?.value ?? "",
//     });
//     setCords(coords);
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     setSelectedPlace({
//       label: place?.displayName,
//       value: place?.placeId,
//     });
//   }, []);

//   return (
//     <div className="z-10 flex flex-col w-full items-center space-y-5 text-center">
//       <div className="space-y-4 md:space-y-3 w-full text-left">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Location Details</h2>
//           <FaEdit
//             className="text-xl cursor-pointer"
//             onClick={handleEditClick}
//           />
//         </div>
//         <div className="text-left text-sm text-gray-600">
//           <p>
//             <strong>Address Line 1:</strong> {addressLine1}
//           </p>
//           <p>
//             <strong>Address Line 2:</strong> {addressLine2}
//           </p>
//           <p>
//             <strong>City:</strong> {city}
//           </p>
//           <p>
//             <strong>State:</strong> {state?.value}
//           </p>
//           <p>
//             <strong>Zipcode:</strong> {postcode}
//           </p>
//           <p>
//             <strong>Location:</strong> {place?.displayName}
//           </p>
//         </div>
//       </div>

//       <ReusableModal
//         title="Edit Location Details"
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       >
//         <div className="space-y-4 md:space-y-3 w-full max-w-2xl">
//           <div className="col-span-2">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Address Line 1
//             </label>
//             <input
//               type="text"
//               value={formState.addressLine1}
//               onChange={(e) =>
//                 handleInputChange("addressLine1", e.target.value)
//               }
//               className="input input-primary"
//               placeholder="Address Line 1"
//             />
//             {errors.addressLine1 && (
//               <p className="text-red-500 text-sm text-start">
//                 {errors.addressLine1}
//               </p>
//             )}
//           </div>

//           <div className="col-span-2">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Address Line 2
//             </label>
//             <input
//               type="text"
//               value={formState.addressLine2}
//               onChange={(e) =>
//                 handleInputChange("addressLine2", e.target.value)
//               }
//               className="input input-primary"
//               placeholder="Address Line 2 (optional)"
//             />
//             {errors.addressLine2 && (
//               <p className="text-red-500 text-sm text-start">
//                 {errors.addressLine2}
//               </p>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-4">
//             <div className="col-span-3 flex-1">
//               <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//                 City
//               </label>
//               <input
//                 type="text"
//                 value={formState.city}
//                 onChange={(e) => handleInputChange("city", e.target.value)}
//                 className="input input-primary"
//                 placeholder="City"
//               />
//               {errors.city && (
//                 <p className="text-red-500 text-sm text-start">{errors.city}</p>
//               )}
//             </div>

//             <div className="col-span-2 flex-1">
//               <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//                 State
//               </label>
//               <Select
//                 options={statesOptions.map((el) => ({
//                   id: el.value,
//                   value: el.label,
//                 }))}
//                 getOptionLabel={(e) => e.value}
//                 getOptionValue={(e) => e.id}
//                 className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
//                 classNamePrefix="react-select"
//                 placeholder="Select State"
//                 value={formState.state}
//                 onChange={(option) => {
//                   handleInputChange("state", option);
//                   setState({
//                     id: option?.id ?? "",
//                     value: option?.value ?? "",
//                   });
//                 }}
//               />
//             </div>
//           </div>

//           <div className="col-span-2">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Zipcode
//             </label>
//             <input
//               type="text"
//               value={formState.postcode}
//               onChange={(e) => handleInputChange("postcode", e.target.value)}
//               className="input input-primary"
//               placeholder="Zipcode"
//             />
//             {errors.postcode && (
//               <p className="text-red-500 text-sm text-start">
//                 {errors.postcode}
//               </p>
//             )}
//           </div>

//           <div className="col-span-2">
//             <label className="block mb-2 text-sm font-medium text-left text-gray-700">
//               Search Location
//             </label>
//             <AsyncSelect
//               className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
//               classNamePrefix="react-select"
//               placeholder="Search location"
//               value={selectedPlace}
//               menuPlacement="auto"
//               maxMenuHeight={200}
//               noOptionsMessage={() => "Search for your desired location"}
//               onChange={async (option) => {
//                 setSelectedPlace({
//                   label: option?.label ?? "",
//                   value: option?.value ?? "",
//                 });
//                 setPlace({
//                   displayName: option?.label ?? "",
//                   placeId: option?.value ?? "",
//                 });
//                 const d = await sdk.PlaceDetails({
//                   placeId: option?.value ?? "",
//                 });
//                 if (d.getPlaceDetails) {
//                   setCoords([
//                     d.getPlaceDetails.latitude,
//                     d.getPlaceDetails.longitude,
//                   ]);
//                 }
//               }}
//               loadOptions={debouncedLoadOptions}
//             />
//           </div>

//           <button
//             onClick={handleSaveClick}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
//           >
//             Save
//           </button>
//         </div>
//       </ReusableModal>
//     </div>
//   );
// };

// export default UserLocationForm;

import React, { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import useMasterStore from "@/store/masters";
import useProfileStore from "@/store/profile";
import { sdk } from "@/utils/graphqlClient";
import ReusableModal from "@/components/common/modal/modal";
import { FaEdit } from "react-icons/fa";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import useGlobalStore from "@/store/global";
import { extractErrorMessage } from "@/utils/utilFUncs";

interface IFormInput {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: { id: string; value: string } | null;
  postcode: string;
  location: PlacesType;
}

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

const UserLocationForm: React.FC = () => {
  const { statesOptions } = useMasterStore();
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
    cords,
    place,
    setAddressLine1,
    setAddressLine2,
    setCity,
    setState,
    setPostcode,
    setCords,
    setPlace,
  } = useProfileStore();

  const [formState, setFormState] = useState<IFormInput>({
    addressLine1,
    addressLine2,
    city,
    state,
    postcode,
    location: { label: place?.displayName ?? "", value: place?.placeId ?? "" },
  });

  const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);
  const [coords, setCoords] = useState<number[]>(cords);
  const [errors, setErrors] = useState<Partial<IFormInput>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const debouncedLoadOptions = debounce(loadOptions, 800);

  const handleInputChange = (field: keyof IFormInput, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setIsFormChanged(true);
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const { setToastData } = useGlobalStore();
  const [btnLoading, setBtnLoading] = useState(false);

  const updateBusinessInfo = async () => {
    if (!isFormChanged) {
      // handleCloseModal();
      return;
    }
    try {
      setBtnLoading(true);

      const response = await sdk.updateUserProfile({
        input: {
          address: {
            addressLine1: {
              value: addressLine1,
            },
            addressLine2: {
              value: addressLine2 ? addressLine2 : "",
            },
            city: {
              value: city,
            },
            state: { _id: state?.id || "", value: state?.value || "" },
            postcode: {
              value: postcode,
            },
            place: {
              displayName: selectedPlace?.label ?? "",
              placeId: selectedPlace?.value ?? "",
            },
            coordinate: {
              coordinates: coords,
            },
          },
        },
      });
      setToastData({
        message: "Business Location updated successfully!",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };
  useEffect(() => {
    setSelectedPlace({
      label: place?.displayName,
      value: place?.placeId,
    });
  }, [place]);

  return (
    <div className="z-10 flex flex-col w-full items-center space-y-5 text-center">
      <div className="space-y-4 md:space-y-3 w-full text-left">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Location Details</h2>
          <FaEdit
            className="text-xl cursor-pointer"
            onClick={handleEditClick}
          />
        </div>
        <div className="text-left text-sm text-gray-600">
          <p>
            <strong>Address Line 1:</strong> {addressLine1}
          </p>
          <p>
            <strong>Address Line 2:</strong> {addressLine2}
          </p>
          <p>
            <strong>City:</strong> {city}
          </p>
          <p>
            <strong>State:</strong> {state?.value}
          </p>
          <p>
            <strong>Zipcode:</strong> {postcode}
          </p>
          <p>
            <strong>Location:</strong> {place?.displayName}
          </p>
        </div>
      </div>

      <ReusableModal
        title="Edit Location Details"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4 md:space-y-3 w-full max-w-2xl">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Address Line 1
            </label>
            <input
              type="text"
              value={formState.addressLine1}
              onChange={(e) =>
                handleInputChange("addressLine1", e.target.value)
              }
              className="input input-primary"
              placeholder="Address Line 1"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm text-start">
                {errors.addressLine1}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Address Line 2
            </label>
            <input
              type="text"
              value={formState.addressLine2}
              onChange={(e) =>
                handleInputChange("addressLine2", e.target.value)
              }
              className="input input-primary"
              placeholder="Address Line 2 (optional)"
            />
            {errors.addressLine2 && (
              <p className="text-red-500 text-sm text-start">
                {errors.addressLine2}
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
                value={formState.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="input input-primary"
                placeholder="City"
              />
              {errors.city && (
                <p className="text-red-500 text-sm text-start">{errors.city}</p>
              )}
            </div>

            <div className="col-span-2 flex-1">
              <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                State
              </label>
              <Select
                options={statesOptions.map((el) => ({
                  id: el.value,
                  value: el.label,
                }))}
                getOptionLabel={(e) => e.value}
                getOptionValue={(e) => e.id}
                className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Select State"
                value={formState.state}
                onChange={(option) => {
                  handleInputChange("state", option);
                }}
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Zipcode
            </label>
            <input
              type="text"
              value={formState.postcode}
              onChange={(e) => handleInputChange("postcode", e.target.value)}
              className="input input-primary"
              placeholder="Zipcode"
            />
            {errors.postcode && (
              <p className="text-red-500 text-sm text-start">
                {errors.postcode}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Search Location
            </label>
            <AsyncSelect
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Search location"
              value={selectedPlace}
              menuPlacement="auto"
              maxMenuHeight={200}
              noOptionsMessage={() => "Search for your desired location"}
              onChange={async (option) => {
                setSelectedPlace({
                  label: option?.label ?? "",
                  value: option?.value ?? "",
                });
                handleInputChange("location", option);
              }}
              loadOptions={debouncedLoadOptions}
            />
          </div>
          <CButton
            type="submit"
            className="w-full"
            variant={ButtonType.Primary}
            onClick={() => {
              updateBusinessInfo();
            }}
          >
            Update
          </CButton>
        </div>
      </ReusableModal>
    </div>
  );
};

export default UserLocationForm;
