import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Papa from "papaparse";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import { CsvUploadTypeEnum, MenuTypeEnum } from "@/generated/graphql";
import FullPageModal from "@/components/common/modal/fullPageModal";
import { sdk } from "@/utils/graphqlClient";
import { extractErrorMessage } from "@/utils/utilFUncs";
import useGlobalStore from "@/store/global";
import useAuthStore from "@/store/auth";
import useRestaurantsStore from "@/store/restaurant";
import useMenuPageStore from "@/pages/menu/store/menuStore";

const menuTypeOptions = [
  { value: MenuTypeEnum.OnlineOrdering, label: "Online Ordering" },
  { value: MenuTypeEnum.DineIn, label: "Dine In" },
  { value: MenuTypeEnum.Catering, label: "Catering" },
];

const actionOptions = [
  { value: CsvUploadTypeEnum.Replace, label: "Replace the existing menu" },
  {
    value: CsvUploadTypeEnum.AddOrUpdate,
    label: "Update to the existing menus",
  },
];

const CsvUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [errorCsvData, setErrorCsvData] = useState<
    Array<Record<string, string>>
  >([]);
  const [expectedHeaders, setExpectedHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<Array<Record<string, string>>>(
    []
  );
  const { setToastData } = useGlobalStore();

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const headersResp = await sdk.getCSVHeaders();
        if (headersResp.getCsvHeaders.length > 0) {
          // setOptions(optsResp.getAllItemOptions);
          setExpectedHeaders(headersResp.getCsvHeaders);
        }
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        setToastData({
          type: "error",
          message: errorMessage,
        });
      }
    };

    fetchHeaders();
  }, []);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const [fixedFile, setFixedFile] = useState<File | null>(null);
  const itemNames = new Set<string>();
  const successfulRows: Array<Record<string, string>> = [];
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
  const [isLoading, setisLoading] = useState(false);

  const processCsvData = (
    data: Array<Record<string, string>>,
    isFixedFile: boolean = false
  ) => {
    setisLoading(true);
    setErrorMessages([]);

    const headers = Object.keys(data[0]);

    const headersMatch = expectedHeaders.every((header) =>
      headers.includes(header)
    );

    if (!headersMatch) {
      setErrorMessages((prev) => [
        ...prev,
        "CSV headers do not match the expected format.",
      ]);
      setisLoading(false);
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

    const errors: Array<Record<string, string>> = [];

    data.forEach((row) => {
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

      let errorMessage = "";

      if (isNaN(Number(price))) {
        errorMessage = `Invalid price`;
      } else if (Number(price) <= 0) {
        errorMessage = `Price Can't Be 0`;
      } else if (itemNames.has(itemName)) {
        errorMessage = `Duplicate item name`;
      } else if (itemName.length > 80) {
        errorMessage = `Item name too long`;
      } else if (itemDesc.length < 40 || itemDesc.length > 200) {
        errorMessage = `Item description length should be between 40 to 200 characters`;
      } else if (items.length >= 500) {
        errorMessage = `Too many items, limit reached.`;
      }

      if (errorMessage) {
        if (!errors.find((err) => err["Item Name"] === itemName)) {
          errors.push({ ...row });
          setErrorMessages((prev) => [...prev, errorMessage]);
        }
        return;
      }

      itemNames.add(itemName);
      items.push({
        category: Category,
        subCategory: subCategory.trim() === "" ? null : subCategory,
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

    if (isFixedFile) {
      setPreviewData((prev) => [...prev, ...successfulRows]);
      setParsedCsvData((prev) => ({
        ...prev,
        items: [...prev.items, ...items],
      }));
    } else {
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
    }
    setisLoading(false);
  };

  const generateErrorCsv = async () => {
    if (errorCsvData.length === 0) {
      setErrorMessages((prev) => [...prev, "No errors to export"]);
      return;
    }

    const csv = Papa.unparse(errorCsvData, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "error_data.csv";
    a.click();
    if (errorCsvDownloaded) return;
    setErrorCsvDownloaded(true);
    try {
      const cloudinaryUrl = await uploadInValidCsvToCloudinary(csv);

      await sdk.saveCsvError({
        input: {
          errorFile: cloudinaryUrl,
          issues: errorMessages,
        },
      });
    } catch (error) {
      console.error("Error uploading CSV:", error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFixedFile: boolean = false
  ) => {
    const file = e.target.files?.[0] || null;

    if (isFixedFile) {
      setFixedFile(file);
    } else {
      setFile(file);
    }

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (isFixedFile) {
            processCsvData(results.data as Array<Record<string, string>>, true);
          } else {
            processCsvData(results.data as Array<Record<string, string>>);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  const { userId } = useAuthStore();
  const { selectedRestaurantId } = useRestaurantsStore();
  const [errorCsvDownloaded, setErrorCsvDownloaded] = useState(false);

  const uploadValidCsvToCloudinary = async (csvData: string) => {
    const timestamp = Date.now();
    const fileName = `${selectedRestaurantId}_${userId}_${timestamp}.csv`;

    const formData = new FormData();
    const blob = new Blob([csvData], { type: "text/csv" });
    formData.append("file", blob, fileName);
    formData.append("upload_preset", "valid-csv");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/choose-pos/raw/upload",
      { method: "POST", body: formData }
    ).then((r) => r.json());

    return response?.secure_url;
  };
  const uploadInValidCsvToCloudinary = async (csvData: string) => {
    const timestamp = Date.now();
    const fileName = `${selectedRestaurantId}_${userId}_${timestamp}_invalid.csv`;

    const formData = new FormData();
    const blob = new Blob([csvData], { type: "text/csv" });
    formData.append("file", blob, fileName);
    formData.append("upload_preset", "invalid-csv");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/choose-pos/raw/upload",
      { method: "POST", body: formData }
    ).then((r) => r.json());

    return response?.secure_url;
  };
  const { setisShowUploadCSV } = useMenuPageStore();
  const onSubmit = async (data: any) => {
    if (
      !parsedCsvData.categories.length ||
      !parsedCsvData.subCategories.length ||
      !parsedCsvData.items.length
    ) {
      setErrorMessages((prev) => [
        ...prev,
        "Parsed data is not available or incomplete.",
      ]);
      return;
    }

    const csv = Papa.unparse(previewData, { header: true });
    try {
      const cloudinaryUrl = await uploadValidCsvToCloudinary(csv);

      if (cloudinaryUrl) {
        const res = await sdk.uploadCSVMenuData({
          input: {
            csvFile: cloudinaryUrl,
            uploadType: data.action.value,
            menuType: data.menuType.value,
          },
        });
        if (res.uploadCsvData) {
          setToastData({
            message:
              "CSV Uploaded Successfully,It will be reflecting in your menu builder within 24 hours",
            type: "success",
          });
          setisShowUploadCSV(false);
        }
      }
    } catch (error) {
      setToastData({
        message: extractErrorMessage(error),
        type: "error",
      });
    }
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
      <div className="w-full flex justify-between items-center px-12 py-4 mb-5">
        <div
          className={`rounded-md w-8 h-8 flex items-center justify-center ${
            step >= 1 ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          1
        </div>
        <div
          className={`flex-1 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}
        ></div>
        <div
          className={`rounded-md w-8 h-8 flex items-center justify-center ${
            step >= 2 ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          2
        </div>
        <div
          className={`flex-1 h-1 ${step >= 3 ? "bg-primary" : "bg-gray-300"}`}
        ></div>
        <div
          className={`rounded-md w-8 h-8 flex items-center justify-center ${
            step >= 3 ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          3
        </div>
      </div>

      {step === 1 && (
        <div className=" flex flex-col space-y-10 text-center">
          <div className="w-full mx-auto ">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64" // Adjust height as needed
            ></iframe>
          </div>

          <div className="text-left ">
            <h2 className="text-lg font-semibold">CSV Upload Rules</h2>
            <ul className="list-disc list-inside text-md">
              <li>The file must be in CSV format.</li>
              <li>Ensure all required fields are filled.</li>
              <li>Follow the template provided in the second step.</li>
              <li>Dont keep </li>
            </ul>
          </div>
          <div className="flex justify-end">
            <CButton
              loading={isLoading}
              onClick={nextStep}
              variant={ButtonType.Primary}
            >
              Next
            </CButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <form>
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
            <CButton
              loading={isLoading}
              onClick={prevStep}
              variant={ButtonType.Outlined}
            >
              Back
            </CButton>
            <CButton
              type="button"
              variant={ButtonType.Primary}
              loading={isLoading}
              onClick={nextStep}
              disabled={
                isLoading ||
                !file ||
                !parsedCsvData.categories.length ||
                !parsedCsvData.subCategories.length ||
                !parsedCsvData.items.length
              }
            >
              Next
            </CButton>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-start">
            <h2 className="text-xl font-bold">Preview</h2>
            <p>Preview of uploaded CSV data will be shown here.</p>

            <div className="mt-4">
              {previewData.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {/* Preview Summary Card */}
                  <div className="border rounded-lg p-4 shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p>Categories: {parsedCsvData.categories.length}</p>
                    <p>Sub Categories: {parsedCsvData.subCategories.length}</p>
                    <p>Items: {parsedCsvData.items.length}</p>
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="text-primary hover:underline mt-2"
                    >
                      View Full Data
                    </button>
                  </div>

                  {/* Error Card */}
                  {errorCsvData.length > 0 && (
                    <div className="border rounded-lg p-4 shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Errors</h3>
                      <ul className="list-disc list-inside text-left text-red-600">
                        {errorMessages.map((msg, index) => (
                          <li key={index}>{msg}</li>
                        ))}
                      </ul>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={generateErrorCsv}
                          className="text-primary hover:underline mt-2"
                        >
                          Download Error CSV
                        </button>
                        <label
                          htmlFor="fixedCsvUpload"
                          className="text-primary hover:underline mt-2 cursor-pointer"
                        >
                          Upload fixed error CSV
                          <input
                            id="fixedCsvUpload"
                            type="file"
                            accept=".csv"
                            onChange={(e) => handleFileChange(e, true)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <label className="block mb-2 text-sm mt-2 font-medium text-left text-gray-500">
                        If you encounter any errors then download the error CSV
                        and and upload it by fixing it
                      </label>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-600">All rows are invalid.</p>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <CButton
                loading={isLoading}
                onClick={prevStep}
                variant={ButtonType.Outlined}
              >
                Back
              </CButton>
              <CButton
                loading={isLoading}
                type="submit"
                variant={ButtonType.Primary}
              >
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
