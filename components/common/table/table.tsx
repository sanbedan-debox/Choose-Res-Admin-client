import React, { useEffect, useState } from "react";
import CButton from "../button/button";
import { ButtonType } from "../button/interface";

interface Heading {
  title: string;
  dataKey: string;
  render?: (value: any, rowData: any) => React.ReactNode;
}

interface CBTableProps {
  headings: Heading[];
  data: any[];
  mainActions?: { label: string; onClick: () => void }[];
  showAvailableSwitch?: boolean;
  actions?: (rowData: any) => React.ReactNode;
}

const CBTable: React.FC<CBTableProps> = ({
  headings,
  data,
  mainActions = [],
  showAvailableSwitch,
  actions,
}) => {
  const renderCell = (item: any, heading: Heading) => {
    if (heading.render) {
      return heading.render(item[heading.dataKey], item);
    }
    const keys = heading.dataKey.split(".");
    let value = item;
    keys.forEach((key) => {
      value = value[key];
    });
    return value;
  };
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {}, [searchTerm]);

  const filteredMembers = data
    ? data.filter((member) =>
        Object.values(member).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];
  const dataLength = data ? data.length : 0;
  return (
    <div className="overflow-x-auto rounded-lg  bg-white ">
      <div
        className={`flex mb-4 min-h-14 border-b justify-between items-center
        `}
      >
        {dataLength > 0 && (
          <div className="flex">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#F1F1F1] text-sm rounded-lg block p-2.5 placeholder-gray-400 text-black w-96 mx-2 "
            />
          </div>
        )}

        <div className="flex mx-2">
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
        </div>
      </div>
      <table className="min-w-full  rounded-lg w-full">
        <thead className=" w-full flex justify-between">
          <tr className="flex space-x-4 justify-center">
            {headings.map((heading, index) => (
              <th
                key={index}
                className="py-3 px-6 text-left text-sm font-medium text-gray-700 "
              >
                {heading.title}
              </th>
            ))}
          </tr>
          <tr>
            {showAvailableSwitch && (
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 ">
                Available
              </th>
            )}
            {actions && (
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 ">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="">
          {filteredMembers.map((item, rowIndex) => (
            <div key={item} className="flex justify-between">
              <tr key={rowIndex} className="flex space-x-4 ">
                {headings.map((heading, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-3 px-6 text-left text-sm text-gray-700 "
                  >
                    {renderCell(item, heading)}
                  </td>
                ))}
              </tr>
              <tr key={rowIndex} className="bg-white">
                {showAvailableSwitch && (
                  <td className="py-3 px-6 text-sm text-gray-700 ">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => console.log("Switch toggled for", item)}
                    />
                  </td>
                )}
                {actions && (
                  <td className="py-3 px-6 text-sm text-gray-700 ">
                    {actions(item)}
                  </td>
                )}
              </tr>
            </div>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CBTable;
