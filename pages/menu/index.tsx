import useGlobalStore from "@/store/global";
import { MenuTypeEnum, UserStatus } from "@/generated/graphql";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";
import useAuthStore from "@/store/auth";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/mainBodyLayout";
import ArrowCard from "@/components/common/arrowCard/arrowCard";
import QuickActions from "@/components/common/quickLinks/quickLink";
import ReusableModal from "@/components/common/modal/modal";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Papa from "papaparse";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type UserRepo = {
  _id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  status: string;
};

const Menu: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu } = useGlobalStore();

  const {
    setEmail,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
    firstName,
  } = useAuthStore();

  useEffect(() => {
    setUserId(repo?._id ?? "");
    setEmail(repo?.email ?? "");
    setPhone(repo?.phone ?? "");
    setFirstName(repo?.firstName ?? "");
    setLastName(repo?.lastName ?? "");
    setStatus(repo?.status ?? "");
  }, [
    repo,
    setEmail,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
  ]);

  useEffect(() => {
    setSelectedMenu("dashboard");
  }, [setSelectedMenu]);

  enum ActionEnum {
    Replace = "Replace",
    Append = "Append",
  }
  const menuTypeOptions = [
    { value: MenuTypeEnum.OnlineOrdering, label: "Online Ordering" },
    { value: MenuTypeEnum.DineIn, label: "Dine In" },
    { value: MenuTypeEnum.Catering, label: "Catering" },
  ];

  // Define action options
  const actionOptions = [
    { value: ActionEnum.Replace, label: "Replace the existing menu" },
    { value: ActionEnum.Append, label: "Append" },
  ];

  const [isShowCSVuploadModal, setIsShowCSVuploadModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [parsedCsvData, setParsedCsvData] = useState<{
    categories: { name: string }[];
    subCategories: { category: string; name: string }[];
    items: {
      category: string;
      subCategory: string | null;
      itemName: string;
      price: string;
      options: string;
      visibility: {
        onlineOrdering: boolean;
        dineIn: boolean;
        catering: boolean;
      };
      availability: boolean;
    }[];
  }>({
    categories: [],
    subCategories: [],
    items: [],
  });

  useEffect(() => {
    if (csvData.length > 0) {
      const categoriesSet = new Set<string>();
      const subCategoriesSet = new Set<string>();
      const items: {
        category: string;
        subCategory: string | null;
        itemName: string;
        price: string;
        options: string;
        visibility: {
          onlineOrdering: boolean;
          dineIn: boolean;
          catering: boolean;
        };
        availability: boolean;
      }[] = [];

      csvData.forEach((row) => {
        const {
          Category,
          "Sub-Category": subCategory,
          "Item Name": itemName,
          "Item Price": price,
          "Options (can be more than one)": options,
          "Online Ordering": onlineOrdering,
          "Dine In": dineIn,
          Catering: catering,
          "Item Status": itemStatus,
        } = row;

        // Collect unique categories and sub-categories
        categoriesSet.add(Category);
        if (subCategory) subCategoriesSet.add(`${Category}|${subCategory}`);

        // Collect items
        items.push({
          category: Category,
          subCategory: subCategory || null,
          itemName,
          price,
          options,
          visibility: {
            onlineOrdering: onlineOrdering === "TRUE",
            dineIn: dineIn === "TRUE",
            catering: catering === "TRUE",
          },
          availability: itemStatus === "TRUE",
        });
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
  }, [csvData]);
  useEffect(() => {
    console.log(parsedCsvData);
  }, [parsedCsvData]);

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

  const onSubmit = (data: any) => {
    // Handle form submission logic here
    console.log(data);
    console.log(file);
  };

  const handleTemplateDownload = () => {
    console.log("Template download triggered");
    // Add additional logic if needed
  };

  const handleSampleTemplateDownload = () => {
    console.log("Sample template download triggered");
    // Add additional logic if needed
  };

  return (
    <div className="w-full flex space-x-5">
      <div className="w-3/4 overflow-y-scroll scrollbar-hide ">
        <div className="flex flex-col space-y-4">
          <ArrowCard
            title="Menu builder"
            caption="Our newest tool for creating and managing menus with improved workflows and streamlined settings. Manually select and create your menus."
            href="/menu/menu-builder/menu"
          />
          <ArrowCard
            title="Have Clover?"
            caption="Pull your menu from Clover!"
            href={`https://sandbox.dev.clover.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_CLOVER_APP_ID}`}
          />
          <ArrowCard
            title="Upload CSV"
            caption="Bulk upload your categories and items to the selected Menu"
            onClick={() => setIsShowCSVuploadModal(true)}
          />
        </div>
      </div>
      <div className="w-1/4 sticky top-0 h-full">
        <QuickActions />
      </div>
      <ReusableModal
        width="md"
        isOpen={isShowCSVuploadModal}
        onClose={() => setIsShowCSVuploadModal(false)}
        title="Upload CSV"
      >
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
            {/* {errors.menuType && (
              <p className="text-red-500 text-sm text-start">
                {errors.menuType.message}
              </p>
            )} */}
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
            {/* {errors.action && (
              <p className="text-red-500 text-sm text-start">
                {errors.action.message}
              </p>
            )} */}
          </div>

          {/* <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              CSV Upload / Drag and Drop
            </label>
            <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100 relative">
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
            </div>
          </div> */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium text-left text-gray-700">
              CSV Upload
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
              Upload a CSV file to manage your menu items.
            </p>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={handleTemplateDownload}
              className="text-primary"
            >
              Download the template for uploading the menu
            </button>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={handleSampleTemplateDownload}
              className="text-primary"
            >
              Download the template with some sample data in it
            </button>
          </div>

          <div className="flex justify-between">
            <div className="mb-4 text-sm">
              <p className="text-gray-500">
                Total Categories:{" "}
                <span className="text-black">
                  {parsedCsvData.categories.length}
                </span>
              </p>
              <p className="text-gray-500">
                Total Sub-Categories:{" "}
                <span className="text-black">
                  {parsedCsvData.subCategories.length}
                </span>
              </p>
              <p className="text-gray-500">
                Total Items:{" "}
                <span className="text-black">{parsedCsvData.items.length}</span>
              </p>
            </div>

            <div className="flex items-end">
              <CButton
                type="submit"
                variant={ButtonType.Primary}
                // className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit
              </CButton>
            </div>
          </div>
        </form>
      </ReusableModal>
    </div>
  );
};

Menu.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Menu;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const token = cookies.accessToken;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await sdk.MeUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      const { _id, email, firstName, status, lastName, phone } =
        response.meUser;

      if (status === UserStatus.Blocked) {
        return {
          redirect: {
            destination: "/account/blocked",
            permanent: false,
          },
        };
      } else if (status === UserStatus.OnboardingPending) {
        return {
          redirect: {
            destination: "/onboarding/user/intro",
            permanent: false,
          },
        };
      } else if (status === UserStatus.PaymentPending) {
        return {
          redirect: {
            destination: "/account/payment-pending",
            permanent: false,
          },
        };
      } else if (status === UserStatus.RestaurantOnboardingPending) {
        return {
          redirect: {
            destination: "/onboarding-restaurant/restaurant-welcome",
            permanent: false,
          },
        };
      } else if (status === "internalVerificationPending") {
        return {
          redirect: {
            destination: "/account/verification-pending",
            permanent: false,
          },
        };
      }

      return {
        props: {
          repo: {
            _id,
            email,
            phone,
            firstName,
            lastName,
            status,
          },
        },
      };
    } else {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
