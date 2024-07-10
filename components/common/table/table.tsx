// components/CBTable.tsx
import React from "react";

interface Heading {
  title: string;
  dataKey: string;
  render?: (value: any, rowData: any) => React.ReactNode;
}

interface CBTableProps {
  headings: Heading[];
  data: any[];
  showAvailableSwitch?: boolean;
  actions?: (rowData: any) => React.ReactNode;
}

const CBTable: React.FC<CBTableProps> = ({
  headings,
  data,
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg w-full">
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
          {data.map((item, rowIndex) => (
            <div key={item} className="flex justify-between">
              <tr key={rowIndex} className="bg-white flex space-x-4 ">
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
