import React, { ReactNode } from "react";

interface TableProps {
  headings: string[];
  data: { [key: string]: any }[];
  children: (item: { [key: string]: any }) => ReactNode;
}

const ReusableTable: React.FC<TableProps> = ({ headings, data, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-black bg-white border border-gray-200">
        <thead className="border-b bg-gray-50">
          <tr>
            {headings.map((heading, index) => (
              <th key={index} className="py-2 px-4 text-left">
                {heading}
              </th>
            ))}
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              {headings.map((heading, index) => (
                <td key={index} className="py-2 px-4">
                  {item[heading.toLowerCase()]}
                </td>
              ))}
              <td className="py-2 px-4 flex space-x-4">{children(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {data.length} of {data.length}
        </div>
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-gray-700">
            Previous
          </button>
          <button className="text-gray-500 hover:text-gray-700">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
