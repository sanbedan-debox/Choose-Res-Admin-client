import React from "react";
import CButton from "../button/button";

interface TableProps {
  itemsPerPage: number;
  headings: Array<{
    title: string;
    dataKey: string;
    render?: (rowData: any) => JSX.Element;
  }>;
  data: Array<any>;
  mainActions?: Array<{ label: string; onClick: () => void }>;
  emptyButton?: React.ReactNode;
  onClickEmptyButton?: () => void;
}

const FormTable: React.FC<TableProps> = ({
  itemsPerPage,
  headings,
  data,
  mainActions,
  emptyButton,
  onClickEmptyButton,
}) => {
  const renderRow = (rowData: any, index: number) => (
    <tr key={rowData._id}>
      {headings.map((heading, idx) => (
        <td key={idx} className="px-6 py-4 whitespace-nowrap">
          {heading.render
            ? heading.render(rowData)
            : rowData[heading.dataKey]?.value || rowData[heading.dataKey]}
        </td>
      ))}
    </tr>
  );

  const renderEmptyState = () => (
    <tr>
      <td colSpan={headings.length + 1} className="text-center py-4">
        {emptyButton && (
          <button onClick={onClickEmptyButton} className="text-primary">
            {emptyButton}
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto">
      {data.length <= 0 ? (
        <p>No Items</p>
      ) : (
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headings.map((heading, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 align-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {heading.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      )}

      {mainActions && (
        <div className="flex justify-center mt-4">
          {mainActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="text-primary "
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormTable;
