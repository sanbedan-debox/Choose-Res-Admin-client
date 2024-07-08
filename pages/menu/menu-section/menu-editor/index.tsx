import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import ReusableModal from "@/components/common/modal/modal";
import { MdAddCircleOutline } from "react-icons/md";
import Select from "react-select";
import RoopTable from "@/components/common/table/table";
import {
  availibilityOptions,
  visibilityOptions,
  menuTypeOptions,
} from "./interface";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const MenuEditor: NextPageWithLayout = () => {
  const [categories, setCategories] = useState<
    { name: string; items: string[] }[]
  >([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<{ item: string }[]>([]);

  const addCategory = () => {
    setCategories([...categories, { name: newCategoryName, items: [] }]);
    setNewCategoryName("");
    setIsCategoryModalOpen(false);
    setSelectedIndex(categories.length); // Select the new category
  };

  const addItem = () => {
    if (selectedIndex !== null) {
      const updatedCategories = [...categories];
      updatedCategories[selectedIndex].items.push(newItemName);
      setCategories(updatedCategories);
      setNewItemName("");
      setIsItemModalOpen(false);
    }
  };

  useEffect(() => {
    // Update menuItems when categories change
    const updatedMenuItems = categories.flatMap((category) =>
      category.items.map((item) => ({ item }))
    );
    setMenuItems(updatedMenuItems);
  }, [categories]);

  const mainActions = [
    {
      label: "Add Menu Item",
      onClick: () => setIsItemModalOpen(true),
    },
  ];

  return (
    <div className="text-black p-4">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-4 mb-4">
          {categories.map((category, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "px-4 py-2 rounded hover:bg-primary hover:text-white",
                  selected ? "text-primary" : "text-black"
                )
              }
            >
              {category.name}
            </Tab>
          ))}
          <button
            className="  text-2xl hover:text-primary"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <MdAddCircleOutline />
          </button>
        </Tab.List>

        {categories.length === 0 && (
          <div className="text-gray-500">
            <p>
              {`No categories available. Click the "+" button to add a category.`}
            </p>
            <div className="mt-2">
              <p>Start by adding a category.</p>
            </div>
          </div>
        )}

        <Tab.Panels>
          {categories.map((category, index) => (
            <Tab.Panel key={index} className="mb-4">
              <RoopTable
                data={menuItems.filter((item) =>
                  category.items.includes(item.item)
                )}
                itemsPerPage={10}
                headings={[{ title: "Name", dataKey: "item" }]}
                hovered
                mainActions={mainActions}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      <ReusableModal
        title="Add Category"
        width="md"
        onClose={() => setIsCategoryModalOpen(false)}
        isOpen={isCategoryModalOpen}
      >
        <div className="space-y-4 md:space-y-3 w-full max-w-2xl text-black">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Category Name
            </label>
            <input
              onChange={(e) => setNewCategoryName(e.target.value)}
              type="text"
              // {...register("postcode", {
              //   required: "Postcode is required",
              // })}
              className="input input-primary"
              placeholder="Enter Category Name"
            />
            {/* {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message}
            </p>
          )} */}
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Description
            </label>
            <input
              // onChange={(e) => setNewCategoryName(e.target.value)}
              type="text"
              // {...register("postcode", {
              //   required: "Postcode is required",
              // })}
              className="input input-primary"
              placeholder="Enter Description"
            />
            {/* {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message}
            </p>
          )} */}
          </div>
          <div className="col-span-2 flex-1">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Visibility
            </label>
            <Select
              //   {...register("state", {
              //     required: "State is required",
              //   })}
              id="state"
              options={visibilityOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select Visibility"
            />
            {/* {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )} */}
          </div>
          <div className="col-span-2 flex-1">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Availibility
            </label>
            <Select
              //   {...register("state", {
              //     required: "State is required",
              //   })}
              id="state"
              options={availibilityOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select Avaiilibility"
            />
            {/* {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )} */}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={addCategory}
            >
              Add
            </button>
          </div>
        </div>
      </ReusableModal>

      <ReusableModal
        title="Add Menu Item"
        width="md"
        onClose={() => setIsItemModalOpen(false)}
        isOpen={isItemModalOpen}
      >
        <div className="space-y-4 md:space-y-3 w-full max-w-2xl text-black">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Name
            </label>
            <input
              onChange={(e) => setNewItemName(e.target.value)}
              type="text"
              // {...register("postcode", {
              //   required: "Postcode is required",
              // })}
              className="input input-primary"
              placeholder="Enter Item Name"
            />
            {/* {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message}
            </p>
          )} */}
          </div>
          <div className="col-span-2 flex-1">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Menu Type
            </label>
            <Select
              //   {...register("state", {
              //     required: "State is required",
              //   })}
              id="menutype"
              options={menuTypeOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select menu Type"
            />
            {/* {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )} */}
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Tax Rate
            </label>
            <input
              type="text"
              // {...register("postcode", {
              //   required: "Postcode is required",
              // })}
              className="input input-primary"
              placeholder="Enter tax rate"
            />
            {/* {errors.postcode && (
            <p className="text-red-500 text-sm text-start">
              {errors.postcode.message}
            </p>
          )} */}
          </div>
          <div className="col-span-2 flex-1">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Visibility
            </label>
            <Select
              //   {...register("state", {
              //     required: "State is required",
              //   })}
              id="state"
              options={visibilityOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select Visibility"
            />
            {/* {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )} */}
          </div>
          <div className="col-span-2 flex-1">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-left text-gray-700"
            >
              Availibility
            </label>
            <Select
              //   {...register("state", {
              //     required: "State is required",
              //   })}
              id="state"
              options={availibilityOptions}
              className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
              classNamePrefix="react-select"
              placeholder="Select Avaiilibility"
            />
            {/* {errors.state && (
              <p className="text-red-500 text-sm text-start">
                {errors.state.message}
              </p>
            )} */}
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" className="btn btn-primary" onClick={addItem}>
              Add
            </button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};

MenuEditor.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default MenuEditor;
