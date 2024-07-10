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
        <thead className="bg-gray-50 w-full flex justify-between">
          <tr>
            {headings.map((heading, index) => (
              <th
                key={index}
                className="py-3 px-6 text-left text-sm font-medium text-gray-700 border-b"
              >
                {heading.title}
              </th>
            ))}
          </tr>
          <tr>
            {showAvailableSwitch && (
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 border-b">
                Available
              </th>
            )}
            {actions && (
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 border-b">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white hover:bg-gray-100 transition-colors"
            >
              {headings.map((heading, colIndex) => (
                <td
                  key={colIndex}
                  className="py-3 px-6 text-sm text-gray-700 border-b"
                >
                  {renderCell(item, heading)}
                </td>
              ))}
              {showAvailableSwitch && (
                <td className="py-3 px-6 text-sm text-gray-700 border-b">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={() => console.log("Switch toggled for", item)}
                  />
                </td>
              )}
              {actions && (
                <td className="py-3 px-6 text-sm text-gray-700 border-b">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CBTable;
