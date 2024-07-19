import React from "react";
import CButton from "../button/button";
import { ButtonType } from "../button/interface";
import NoImage from "../../../assets/svg/noImage.svg";
import { ImFileEmpty } from "react-icons/im";
import { CiImageOn } from "react-icons/ci";

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
  emptyCaption?: string;
  buttonText: string;
  onAddClick: () => void;
  isShowImage?: boolean;
}

const FormAddTable: React.FC<FormAddTableProps> = ({
  data = [],
  headings,
  title,
  emptyMessage,
  emptyCaption = "",
  buttonText,
  onAddClick,
  isShowImage = false,
}) => {
  console.log("roop", data);
  return (
    <div className="w-full">
      <h2 className="block mb-2 text-sm font-medium text-left text-gray-700">
        {title}
      </h2>
      {data?.length === 0 ? (
        <div className="flex justify-start align-middle p-2 border rounded-md space-x-4">
          <div className="flex text-xl text-primary items-center">
            <ImFileEmpty />
          </div>
          <div className="flex flex-col">
            <p className="text-md text-start font-semibold text-primary">
              {emptyMessage}
            </p>
            <p className="text-sm text-gray-500 text-start">{emptyCaption}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-2 border rounded-md"
            >
              <div className="flex items-center space-x-2 py-1">
                {isShowImage &&
                  (item?.image?.trim ? (
                    <img
                      src={item?.image?.trim() ? item.image : NoImage}
                      alt={item.name.value}
                      className="w-10 h-10 rounded-md"
                    />
                  ) : (
                    <div className="text-primary text-2xl">
                      <CiImageOn />
                    </div>
                  ))}
                <span className="text-md">
                  {item?.name?.value || item?.name}
                </span>
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
        variant={ButtonType.Outlined}
        onClick={onAddClick}
        className="w-full mt-2"
      >
        {buttonText}
      </CButton>
    </div>
  );
};

export default FormAddTable;
