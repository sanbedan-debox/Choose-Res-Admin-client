import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { Menu } from "@headlessui/react";
import {
  HiDotsVertical,
  HiChevronLeft,
  HiChevronRight,
  HiFilter,
} from "react-icons/hi";
import Select from "react-select";
import useGlobalStore from "@/store/global";

import ReusableModal from "../modal/modal";
import noDataImage from "../../../assets/svg/noData.svg";
import Image from "next/image";
import CButton from "../button/button";
import { ButtonType } from "../button/interface";
import { FaSpinner } from "react-icons/fa";

interface TableProps {
  data: any[];
  itemsPerPage: number;
  mainActions?: { label: string; onClick: () => void }[];
  csvExport?: boolean;
  fullCsv?: boolean;
  csvFileName?: string;
  headings: {
    title: string;
    dataKey: string;
    render?: (rowData: any) => React.ReactNode;
  }[];
  striped?: boolean;
  bordered?: boolean;
  hovered?: boolean;
  filterable?: boolean;
  loading?: boolean;
}

const RoopTable: React.FC<TableProps> = ({
  data = [],
  itemsPerPage,
  mainActions = [],
  csvExport = false,
  fullCsv = true,
  csvFileName = "data.csv",
  headings,
  striped = false,
  bordered = false,
  hovered = false,
  filterable = false,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentFilterColumn, setCurrentFilterColumn] = useState<string>("");
  const [currentOperator, setCurrentOperator] = useState<string>("contains");
  const [currentFilterValue, setCurrentFilterValue] = useState<string>("");

  const [filterColumn, setFilterColumn] = useState<string>("");
  const [operator, setOperator] = useState<string>("contains");
  const [filterValue, setFilterValue] = useState<string>("");
  const [options, setOptions] = useState<any[]>([]);
  const { isSidebarExpanded } = useGlobalStore();
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);

  useEffect(() => {
    const columnOptions = headings.map((heading) => ({
      value: heading.dataKey,
      label: heading.title,
    }));
    setOptions(columnOptions);
  }, [headings]);

  useEffect(() => {
    setCurrentPage(1);
    setIsFilterApplied(!!filterColumn && !!filterValue);
  }, [filterColumn, filterValue, searchTerm]);

  useEffect(() => {
    setCurrentFilterColumn(filterColumn);
    setCurrentOperator(operator);
    setCurrentFilterValue(filterValue);
  }, [filterColumn, filterValue, operator, showFilterModal]);

  const operatorOptions = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "startswith", label: "Starts With" },
    { value: "endswith", label: "Ends With" },
    { value: "isempty", label: "Is Empty" },
    { value: "isnotempty", label: "Is Not Empty" },
    { value: "isanyof", label: "Is Any Of" },
  ];

  const filteredMembers = data
    ? data
        .filter((member) =>
          Object.values(member).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .filter((member) => {
          if (!filterColumn || !filterValue) {
            return true;
          }

          const memberValue = member[filterColumn];

          switch (operator) {
            case "contains":
              return String(memberValue)
                .toLowerCase()
                .includes(filterValue.toLowerCase());
            case "equals":
              return (
                String(memberValue).toLowerCase() === filterValue.toLowerCase()
              );
            case "startswith":
              return String(memberValue)
                .toLowerCase()
                .startsWith(filterValue.toLowerCase());
            case "endswith":
              return String(memberValue)
                .toLowerCase()
                .endsWith(filterValue.toLowerCase());
            case "isempty":
              return !memberValue;
            case "isnotempty":
              return !!memberValue;
            case "isanyof":
              const filterValues = filterValue
                .split(",")
                .map((value) => value.trim().toLowerCase());
              return filterValues.includes(String(memberValue).toLowerCase());
            default:
              return true;
          }
        })
    : [];

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const displayedData = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const csvData = fullCsv ? data : displayedData;

  const csvHeaders = headings.map((heading) => ({
    label: heading.title,
    key: heading.dataKey,
  }));

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((value, key) => value?.[key] ?? "", obj);
  };

  const rowClasses = (index: number) => {
    let classes = "";
    if (striped && index % 2 === 0) classes += "bg-slate-900 ";
    if (bordered) classes += "border ";
    if (hovered) classes += "hover:bg-primary hover:bg-opacity-10 ";
    return classes.trim();
  };

  const clearFilter = () => {
    setFilterColumn("");
    setOperator("contains");
    setFilterValue("");
    setCurrentPage(1);
    setIsFilterApplied(false);
  };

  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  const applyFilter = () => {
    setFilterColumn(currentFilterColumn);
    setOperator(currentOperator);
    setFilterValue(currentFilterValue);
    setShowFilterModal(false);
    setCurrentPage(1);
    setIsFilterApplied(true);
  };

  const handleExportClick = () => {
    if (isFilterApplied) {
      setShowExportModal(true);
    } else {
      document.getElementById("csvLink")?.click();
    }
  };

  return (
    <div className={`rounded-lg p-4 bg-white text-black`}>
      <div
        className={`flex items-center mb-4 ${
          data.length < 1 ? "justify-end" : "justify-between"
        }`}
      >
        {data.length > 0 && (
          <div className="flex">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#F1F1F1] text-sm rounded-lg block p-2.5 placeholder-gray-400 text-black w-96"
            />

            {filterable && (
              <div className="flex items-center ml-4">
                <HiFilter
                  className="text-primary cursor-pointer hover:text-primary hover:text-opacity-60 transition-colors duration-300"
                  onClick={() => setShowFilterModal(true)}
                  style={{ height: "2rem", width: "2rem" }}
                />
              </div>
            )}
            {isFilterApplied && (
              <button
                className="btn btn-outlined"
                onClick={() => {
                  setCurrentFilterColumn("");
                  setCurrentOperator("contains");
                  setCurrentFilterValue("");
                  applyFilter();
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        <div className="flex">
          {mainActions.map((action, index) => (
            <CButton
              variant={ButtonType.Primary}
              key={index}
              className="mr-2"
              onClick={action.onClick}
            >
              {action.label}
            </CButton>
          ))}
          {data.length > 0 && csvExport && (
            <div className="flex space-x-2">
              <button className="btn btn-primary" onClick={handleExportClick}>
                Export to CSV
              </button>
              <CSVLink
                id="csvLink"
                data={data}
                headers={csvHeaders}
                filename={csvFileName}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          {loading ? (
            <FaSpinner className="animate-spin h-10 w-10 text-primary text-5xl" />
          ) : (
            <div className="flex flex-col items-center justify-center ">
              <Image
                src={noDataImage}
                alt="No Data Found"
                className="h-36 mb-4"
              />
              <p className="text-lg font-semibold">No data to display.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent rounded-lg overflow-hidden">
              <thead className="bg-white   text-black ">
                <tr>
                  {headings.map((heading, index) => (
                    <th
                      key={index}
                      className={`py-2 px-4 text-left font-medium first:rounded-tl-lg last:rounded-tr-lg ${
                        ["Actions", "Toggle Status"].includes(heading.title)
                          ? "text-right px-0"
                          : ""
                      }`}
                    >
                      {heading.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowClasses(rowIndex)}>
                    {headings.map((heading, colIndex) => (
                      <td
                        key={colIndex}
                        className={`py-2 px-4 text-left first:rounded-tl-lg last:rounded-tr-lg text-nowrap text-sm ${
                          ["Actions", "Toggle Status"].includes(heading.title)
                            ? "text-right px-0"
                            : ""
                        }`}
                      >
                        {heading.render
                          ? heading.render(row)
                          : truncateString(
                              getNestedValue(row, heading.dataKey),
                              30
                            )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.length > 0 && (
            <div className="flex justify-between items-center mt-5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 text-sm ${
                  currentPage === 1 ? "opacity-0 " : ""
                }`}
              >
                <HiChevronLeft />
                <span>Previous</span>
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-2 text-sm ${
                  currentPage === totalPages ? "opacity-0 " : ""
                }`}
              >
                <span>Next</span>
                <HiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
      <ReusableModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter"
      >
        <div className="flex flex-col space-y-4">
          <Select
            options={options}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left text-black"
            placeholder="Select Column"
            value={options.find(
              (option) => option.value === currentFilterColumn
            )}
            onChange={(selectedOption) =>
              setCurrentFilterColumn(selectedOption?.value || "")
            }
          />
          <Select
            options={operatorOptions}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left text-black"
            placeholder="Select Operator"
            value={operatorOptions.find(
              (option) => option.value === currentOperator
            )}
            onChange={(selectedOption) =>
              setCurrentOperator(selectedOption?.value || "contains")
            }
          />
          <input
            type="text"
            placeholder="Enter Value"
            value={currentFilterValue}
            onChange={(e) => setCurrentFilterValue(e.target.value)}
            className="input input-primary"
          />
          <div className="flex justify-end space-x-2">
            <button
              className="btn btn-outlined"
              onClick={() => {
                setCurrentFilterColumn("");
                setCurrentOperator("contains");
                setCurrentFilterValue("");
              }}
            >
              Clear
            </button>
            <button className="btn btn-primary" onClick={applyFilter}>
              Apply
            </button>
          </div>
        </div>
      </ReusableModal>{" "}
      <ReusableModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Data"
      >
        <div className="flex flex-col space-y-4">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowExportModal(false);
              document.getElementById("csvLink")?.click();
            }}
          >
            Download Full Table Data
          </button>
          <CSVLink
            data={filteredMembers}
            headers={csvHeaders}
            filename={csvFileName.replace(".csv", "-filtered.csv")}
            className="btn btn-primary text-center"
          >
            Download Filtered Table Data
          </CSVLink>
        </div>
      </ReusableModal>
    </div>
  );
};

export default RoopTable;
