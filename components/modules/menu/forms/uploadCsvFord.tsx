import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Papa from "papaparse";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { MenuTypeEnum } from "@/generated/graphql";
import FullPageModal from "@/components/common/modal/fullPageModal";

enum ActionEnum {
  Replace = "Replace",
  Append = "Append",
}

const menuTypeOptions = [
  { value: MenuTypeEnum.OnlineOrdering, label: "Online Ordering" },
  { value: MenuTypeEnum.DineIn, label: "Dine In" },
  { value: MenuTypeEnum.Catering, label: "Catering" },
];

const actionOptions = [
  { value: ActionEnum.Replace, label: "Replace the existing menu" },
  { value: ActionEnum.Append, label: "Append" },
];

const expectedHeaders = [
  "Category",
  "Sub Category",
  "Item Name",
  "Item Desc",
  "Item Price",
  "Item Status",
  "OnlineOrdering",
  "DineIn",
  "Catering",
  "Item Limit",
  "PopularItem",
  "UpSellItem",
  "IsVegan",
  "HasNuts",
  "IsGlutenFree",
  "IsHalal",
  "IsSpicy",
];

const CsvUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [errorCsvData, setErrorCsvData] = useState<
    Array<Record<string, string>>
  >([]);
  const [previewData, setPreviewData] = useState<Array<Record<string, string>>>(
    []
  );

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handlePreview = () => {
    console.log("Preview Data:", previewData);
    setIsPreviewModalOpen(true);
  };

  const [parsedCsvData, setParsedCsvData] = useState<{
    categories: { name: string }[];
    subCategories: { category: string; name: string }[];
    items: {
      category: string;
      subCategory: string | null;
      itemName: string;
      price: string;
      itemStatus: boolean;
      onlineOrdering: boolean;
      dineIn: boolean;
      catering: boolean;
      itemLimit: string;
      popularItem: boolean;
      upSellItem: boolean;
      isVegan: boolean;
      hasNuts: boolean;
      isGlutenFree: boolean;
      isHalal: boolean;
      isSpicy: boolean;
    }[];
  }>({
    categories: [],
    subCategories: [],
    items: [],
  });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    if (csvData.length > 0) {
      setErrorMessages([]);

      const headers = Object.keys(csvData[0]);

      const headersMatch = expectedHeaders.every((header) =>
        headers.includes(header)
      );

      if (!headersMatch) {
        setErrorMessages((prev) => [
          ...prev,
          "CSV headers do not match the expected format.",
        ]);
        return;
      }

      const items: {
        category: string;
        subCategory: string | null;
        itemName: string;
        price: string;
        itemStatus: boolean;
        onlineOrdering: boolean;
        dineIn: boolean;
        catering: boolean;
        itemLimit: string;
        popularItem: boolean;
        upSellItem: boolean;
        isVegan: boolean;
        hasNuts: boolean;
        isGlutenFree: boolean;
        isHalal: boolean;
        isSpicy: boolean;
      }[] = [];

      const itemNames = new Set<string>();
      const errors: Array<Record<string, string>> = [];
      const successfulRows: Array<Record<string, string>> = [];

      csvData.forEach((row, index) => {
        const {
          Category,
          "Sub Category": subCategory,
          "Item Name": itemName,
          "Item Desc": itemDesc,
          "Item Price": price,
          "Item Status": itemStatus,
          OnlineOrdering: onlineOrdering,
          DineIn: dineIn,
          Catering: catering,
          "Item Limit": itemLimit,
          PopularItem: popularItem,
          UpSellItem: upSellItem,
          IsVegan: isVegan,
          HasNuts: hasNuts,
          IsGlutenFree: isGlutenFree,
          IsHalal: isHalal,
          IsSpicy: isSpicy,
        } = row;

        if (isNaN(Number(price)) || Number(price) <= 0) {
          setErrorMessages((prev) => [
            ...prev,
            `Invalid price in row: ${index} `,
          ]);
          return;
        }

        if (itemNames.has(itemName)) {
          setErrorMessages((prev) => [
            ...prev,
            `Duplicate item name in row: ${index}`,
          ]);
          return;
        }
        itemNames.add(itemName);

        if (itemName.length > 80) {
          setErrorMessages((prev) => [
            ...prev,
            `Item name too long in row: ${index}`,
          ]);
          return;
        }

        if (itemDesc.length < 40 || itemDesc.length > 200) {
          setErrorMessages((prev) => [
            ...prev,
            `Item description length invalid in row: ${index}`,
          ]);
          return;
        }

        if (items.length >= 500) {
          setErrorMessages((prev) => [
            ...prev,
            `Too many items, limit reached.`,
          ]);
          return;
        }

        items.push({
          category: Category,
          subCategory: subCategory || null,
          itemName,
          price,
          itemStatus: itemStatus === "TRUE",
          onlineOrdering: onlineOrdering === "TRUE",
          dineIn: dineIn === "TRUE",
          catering: catering === "TRUE",
          itemLimit,
          popularItem: popularItem === "TRUE",
          upSellItem: upSellItem === "TRUE",
          isVegan: isVegan === "TRUE",
          hasNuts: hasNuts === "TRUE",
          isGlutenFree: isGlutenFree === "TRUE",
          isHalal: isHalal === "TRUE",
          isSpicy: isSpicy === "TRUE",
        });

        successfulRows.push(row);
      });

      setErrorCsvData(errors);
      setPreviewData(successfulRows);

      const categoriesSet = new Set<string>();
      const subCategoriesSet = new Set<string>();

      items.forEach((item) => {
        categoriesSet.add(item.category);
        if (item.subCategory) {
          subCategoriesSet.add(`${item.category}|${item.subCategory}`);
        }
      });

      const categories = Array.from(categoriesSet).map((name) => ({ name }));
      const subCategories = Array.from(subCategoriesSet).map((item) => {
        const [category, name] = item.split("|");
        return { category, name };
      });

      setParsedCsvData({
        categories,
        subCategories,
        items,
      });

      console.log("Parsed CSV Data:", {
        categories,
        subCategories,
        items,
      });
    }
  }, [csvData]);

  const generateErrorCsv = () => {
    const csv = Papa.unparse(errorCsvData, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "error_data.csv";
    a.click();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data as Array<Record<string, string>>);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  const onSubmit = async (data: any) => {
    const { menuType, action } = data;
  };

  const handleTemplateDownload = () => {
    const downloadA = document.createElement("a");
    downloadA.href =
      "https://res.cloudinary.com/choose-pos/raw/upload/v1722703274/template_xat7md.csv";
    downloadA.download = "true";
    downloadA.click();
  };

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center mb-4">
        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center ${
            step >= 1 ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          1
        </div>
        <div
          className={`flex-1 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}
        ></div>
        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center ${
            step >= 2 ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          2
        </div>
        <div
          className={`flex-1 h-1 ${step >= 3 ? "bg-primary" : "bg-gray-300"}`}
        ></div>
        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center ${
            step >= 3 ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          3
        </div>
      </div>

      {step === 1 && (
        <div className=" flex flex-col justify-center text-center">
          <div className="w-1/3">
            <iframe
              //   width="450"
              //   height="250"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="text-left mt-4">
            <h2 className="text-xl font-bold">CSV Upload Rules</h2>
            <ul className="list-disc list-inside">
              <li>The file must be in CSV format.</li>
              <li>Ensure all required fields are filled.</li>
              <li>Follow the template provided.</li>
            </ul>
          </div>
          <div className="flex justify-end mt-4">
            <CButton onClick={nextStep} variant={ButtonType.Primary}>
              Next
            </CButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Choose / Select Menu Type
            </label>
            <Controller
              name="menuType"
              control={control}
              rules={{ required: "Menu type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={menuTypeOptions}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select menu type"
                />
              )}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Choose / Select Action
            </label>
            <Controller
              name="action"
              control={control}
              rules={{ required: "Action is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={actionOptions}
                  className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
                  classNamePrefix="react-select"
                  placeholder="Select action"
                />
              )}
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 text-lg font-medium text-left text-gray-700 flex justify-between items-center">
              <span className="w-full">Upload</span>
              <span
                onClick={handleTemplateDownload}
                className="text-primary text-sm text-right w-full cursor-pointer"
              >
                Download CSV template
              </span>
            </label>
            <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100 relative">
              {file ? (
                <div className="flex items-center justify-between hover:bg-primary hover:bg-opacity-5 px-4 rounded-md">
                  <div className="text-gray-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7l3-3m0 0l3 3M6 4v12M21 11v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7M16 8l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">{file.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setCsvData([]);
                      setParsedCsvData({
                        categories: [],
                        subCategories: [],
                        items: [],
                      });
                    }}
                    className="text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                    accept=".csv"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 mx-auto"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7l3-3m0 0l3 3M6 4v12M21 11v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7M16 8l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">
                        Drag and drop a CSV file or{" "}
                        <span className="text-blue-600">browse file</span>
                      </p>
                    </div>
                  </label>
                </>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              Upload a CSV file to add / update your menu.
            </p>
          </div>

          <div className="flex justify-between">
            <CButton onClick={prevStep} variant={ButtonType.Outlined}>
              Back
            </CButton>
            <CButton onClick={nextStep} variant={ButtonType.Primary}>
              Next
            </CButton>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center">
            <h2 className="text-xl font-bold">Preview</h2>
            <p>Preview of uploaded CSV data will be shown here.</p>
            {errorMessages.length > 0 && (
              <div className="mt-4 text-left">
                <p className="text-red-600">Errors occurred:</p>
                <ul className="list-disc list-inside text-left text-red-600">
                  {errorMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
                <CButton
                  type="button"
                  onClick={generateErrorCsv}
                  variant={ButtonType.Primary}
                  className="w-full mt-5"
                >
                  Download Error CSV
                </CButton>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <CButton onClick={prevStep} variant={ButtonType.Outlined}>
                Back
              </CButton>
              <CButton
                type="button"
                onClick={handlePreview}
                variant={ButtonType.Primary}
              >
                Preview Data
              </CButton>
              <CButton type="submit" variant={ButtonType.Primary}>
                Submit
              </CButton>
            </div>
          </div>
        </form>
      )}

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        data={previewData}
      />
    </div>
  );
};

export default CsvUploadForm;
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Array<Record<string, string>>;
}
const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  return (
    <FullPageModal
      isOpen={isOpen}
      onClose={onClose}
      title="CSV Data Preview"
      actionButtonLabel="Close"
      onActionButtonClick={onClose}
    >
      <div className="overflow-auto">
        {data.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {Object.keys(data[0]).map((header) => (
                  <th
                    key={header}
                    className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-gray-600 text-sm font-semibold text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available for preview.</p>
        )}
      </div>
    </FullPageModal>
  );
};
