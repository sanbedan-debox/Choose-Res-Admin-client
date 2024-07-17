import React from "react";
import CButton from "../button/button";
import { ButtonType } from "../button/interface";

interface Heading {
  title: string;
  dataKey: string;
  render?: (rowData: DataItem) => React.ReactNode;
}

interface DataItem {
  id: string;
  [key: string]: any;
}

interface FormAddTableProps {
  data?: DataItem[];
  headings: Heading[] | any[];
  title: string;
  emptyMessage: string;
  buttonText: string;
  onAddClick: () => void;
  isShowImage?: boolean;
}

const FormAddTable: React.FC<FormAddTableProps> = ({
  data = [],
  headings,
  title,
  emptyMessage,
  buttonText,
  onAddClick,
  isShowImage = false,
}) => {
  return (
    <div className="w-full">
      <h2 className="block mb-2 text-sm font-medium text-left text-gray-700">
        {title}
      </h2>
      {data?.length === 0 ? (
        <div className="text-center p-4 border rounded-md">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-2 border rounded-md"
            >
              <div className="flex items-center space-x-2">
                {isShowImage && (
                  <img
                    src={item._id.image || "/default-image.png"}
                    alt={item.name.value}
                    className="w-10 h-10 rounded-md"
                  />
                )}
                <span>{item?.name?.value || item?.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                {headings.map((heading) => (
                  <span key={heading.dataKey}>
                    {heading.render
                      ? heading.render(item)
                      : item[heading.dataKey]?.value || item[heading.dataKey]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <CButton
        type="button"
        variant={ButtonType.Primary}
        onClick={onAddClick}
        className="w-full mt-2"
      >
        {buttonText}
      </CButton>
    </div>
  );
};

export default FormAddTable;
