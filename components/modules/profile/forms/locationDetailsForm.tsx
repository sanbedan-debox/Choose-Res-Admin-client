import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import ReusableModal from "@/components/common/modal/modal";
import useGlobalStore from "@/store/global";
import useMasterStore from "@/store/masters";
import useProfileStore from "@/store/profile";
import { sdk } from "@/utils/graphqlClient";
import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import Select from "react-select";
import AsyncSelect from "react-select/async";

interface IFormInput {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: { id: string; value: string } | null;
  zipcode: number;
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
      d.getPlacesList.map((el: { displayName: string; placeId: string }) => ({
        label: el.displayName,
        value: el.placeId,
      }))
    );
  });
};

const UserLocationForm: React.FC = () => {
  const { statesOptions } = useMasterStore();
  const { addressLine1, addressLine2, city, state, zipcode, cords, place } =
    useProfileStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalField, setModalField] = useState<keyof IFormInput | null>(null);
  const [formState, setFormState] = useState<IFormInput>({
    addressLine1,
    addressLine2,
    city,
    state,
    zipcode,
    location: { label: place?.displayName ?? "", value: place?.placeId ?? "" },
  });

  const debouncedLoadOptions = debounce(loadOptions, 800);

  const handleInputChange = (field: keyof IFormInput, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (field: keyof IFormInput) => {
    setModalField(field);
    setIsModalOpen(true);
  };
  const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);

  useEffect(() => {
    setSelectedPlace({
      label: place?.displayName,
      value: place?.placeId,
    });
  }, [place]);

  const [isFormChanged, setIsFormChanged] = useState(false);
  const { setToastData } = useGlobalStore();

  const [btnLoading, setBtnLoading] = useState(false);
  const [coords, setCoords] = useState<number[]>(cords);

  const updateBusinessInfo = async () => {
    // const hasChanges =
    //   addressLine1 !== formState.addressLine1 ||
    //   addressLine2 !== formState.addressLine2 ||
    //   city !== formState.city ||
    //   state?.id !== formState.state?.id ||
    //   zipcode !== formState.zipcode ||
    //   place?.placeId !== selectedPlace?.value ||
    //   cords !== coords;
    // if (!hasChanges) {
    //   setIsModalOpen(false);
    //   return;
    // }
    // try {
    //   setBtnLoading(true);
    //   const response = await sdk.updateUserProfile({
    //     input: {
    //       address: {
    //         addressLine1: formState.addressLine1,
    //         addressLine2: formState.addressLine2 ? formState.addressLine2 : "",
    //         city: formState.city,
    //         state: {
    //           stateId: formState.state?.id || "",
    //           stateName: formState.state?.value || "",
    //         },
    //         zipcode: zipcode,
    //         place: {
    //           displayName: selectedPlace?.label ?? "",
    //           placeId: selectedPlace?.value ?? "",
    //         },
    //         coordinate: {
    //           coordinates: coords,
    //         },
    //       },
    //     },
    //   });
    //   setToastData({
    //     message: "Business Location updated successfully!",
    //     type: "success",
    //   });
    //   setIsModalOpen(false);
    // } catch (error) {
    //   const errorMessage = extractErrorMessage(error);
    //   setToastData({
    //     type: "error",
    //     message: errorMessage,
    //   });
    // } finally {
    //   setBtnLoading(false);
    // }
  };

  return (
    <div className="z-10 flex flex-col w-full items-center  text-center bg-white">
      {/* Location Cards */}
      <div className="bg-white p-4 rounded-xl space-y-4 w-full ">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center border-b pb-3">
            <p>
              <strong>Address Line 1:</strong> {addressLine1}
            </p>
            <MdOutlineEdit
              className="text-primary text-xl cursor-pointer"
              onClick={() => handleEditClick("addressLine1")}
            />
          </div>
          <div className="flex justify-between items-center border-b py-3">
            <p>
              <strong>Address Line 2:</strong> {addressLine2}
            </p>
            <MdOutlineEdit
              className="text-primary text-xl cursor-pointer"
              onClick={() => handleEditClick("addressLine2")}
            />
          </div>
          <div className="flex justify-between items-center border-b py-3">
            <p>
              <strong>City:</strong> {city}
            </p>
            <MdOutlineEdit
              className="text-primary text-xl cursor-pointer"
              onClick={() => handleEditClick("city")}
            />
          </div>
          <div className="flex justify-between items-center py-3 border-b ">
            <p>
              <strong>State:</strong> {state?.value}
            </p>
            <MdOutlineEdit
              className="text-primary text-xl cursor-pointer"
              onClick={() => handleEditClick("state")}
            />
          </div>
          <div className="flex justify-between items-center py-3 border-b ">
            <p>
              <strong>Zipcode:</strong> {zipcode}
            </p>
            <MdOutlineEdit
              className="text-primary text-xl cursor-pointer"
              onClick={() => handleEditClick("zipcode")}
            />
          </div>
          <div className="flex justify-between items-center py-3 border-b ">
            <p>
              <strong>Location:</strong> {place?.displayName}
            </p>
            <MdOutlineEdit
              className="text-primary text-xl cursor-pointer"
              onClick={() => handleEditClick("location")}
            />
          </div>
          <div className="bg-gray-200 p-4 mt-3 rounded-lg h-64  flex items-center justify-center">
            <p className="text-gray-500">
              Map will be shown here.Just for showing the location,We already
              have coords which we can pass as parameter to the google map
              leaflet .User cant interact with the map
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl space-y-4 w-full">
        {/* Additional Features */}
        {/* Order Hardware */}
        <div className="bg-white p-4 rounded-lg border text-left space-y-2">
          <h3 className="font-semibold">Order Hardware</h3>
          <p className="text-sm text-gray-600">
            Need a new POS system? Order now to enhance your business
            operations.
          </p>
          <CButton variant={ButtonType.Primary} className="w-full">
            Order Hardware
          </CButton>
        </div>
        {/* Request Servicing */}
        <div className="bg-white border text-left p-4 rounded-lg space-y-2">
          <h3 className="font-semibold">Request Servicing</h3>
          <p className="text-sm text-gray-600">
            Is your equipment malfunctioning? Request a service call today.
          </p>
          <CButton variant={ButtonType.Outlined} className="w-full">
            Request Servicing
          </CButton>
        </div>
      </div>

      {/* Reusable Modal */}
      {isModalOpen && (
        <ReusableModal
          title={`Edit ${modalField}`}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          width="md"
        >
          <div className="space-y-4 w-full max-w-2xl">
            {modalField === "addressLine1" && (
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
                  placeholder="Enter your address Line 2"
                />
              </div>
            )}
            {modalField === "addressLine2" && (
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
                  placeholder="Enter your Address Line 2"
                />
              </div>
            )}
            {modalField === "city" && (
              <div className="col-span-2">
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
              </div>
            )}
            {modalField === "state" && (
              <div className="col-span-2 flex-1">
                <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                  State
                </label>
                <Select
                  classNames={{
                    option: (state) =>
                      `!text-sm hover:!bg-primary hover:!text-white focus:!bg-transparent  ${
                        state.isSelected ? "!bg-primary text-white" : ""
                      }  `,
                  }}
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
            )}
            {modalField === "zipcode" && (
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-left text-gray-700">
                  Zipcode
                </label>
                <input
                  type="text"
                  value={formState.zipcode}
                  onChange={(e) => handleInputChange("zipcode", e.target.value)}
                  className="input input-primary"
                  placeholder="Zipcode"
                />
              </div>
            )}
            {modalField === "location" && (
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
            )}
          </div>
          <div className="flex justify-end mt-4">
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
      )}
    </div>
  );
};

export default UserLocationForm;
