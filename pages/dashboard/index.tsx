import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/loader";
import useGlobalStore from "@/store/global";
import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";
import useAuthStore from "@/store/auth";
import { UserStatus } from "@/generated/graphql";
import SetupGuide from "@/components/common/setupGuide/setupGuide";
import QuickActions from "@/components/common/quickLinks/quickLink";

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
  businessName: string;
  establishedAt: string;
};

const Dashboard: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu, isShowSetupPanel } = useGlobalStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { name: string; link: string }[]
  >([]);

  const features = [
    { name: "Sales summary", link: "/sales-summary" },
    { name: "Labor summary", link: "/labor-summary" },
    { name: "Menu builder", link: "/menu-builder" },
    { name: "Edit menus", link: "/edit-menus" },
    { name: "Refund check", link: "/refund-check" },
    { name: "Employees", link: "/employees" },
    { name: "Time entries", link: "/time-entries" },
  ];
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredSuggestions = features.filter((feature) =>
        feature.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const {
    setBusinessName,
    setEmail,
    setEstablishedAt,
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
    setBusinessName(repo?.businessName ?? "");
    setEstablishedAt(repo?.establishedAt ?? "");
  }, [
    repo,
    setBusinessName,
    setEmail,
    setEstablishedAt,
    setFirstName,
    setLastName,
    setPhone,
    setStatus,
    setUserId,
  ]);

  useEffect(() => {
    setSelectedMenu("dashboard");
  }, [setSelectedMenu]);

  if (!repo) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="text-2xl font-semibold">Welcome, {repo.firstName}!</div>
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="What are you looking for..."
          className="input input-primary w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-200 mt-9 rounded-lg shadow-lg">
            {suggestions.map((suggestion) => (
              <a href="href={suggestion.link}">
                <li
                  key={suggestion.name}
                  className="hover:bg-primary hover:text-white p-2"
                >
                  <p>{suggestion.name}</p>
                </li>
              </a>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1">
          <QuickActions />
        </div>
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Net Sales" value="$0" />
          <StatCard title="Labor Cost % of Net Sales" value="-" />
          <StatCard title="Discounts" value="$0" />
          <QrCard />
          <StatCard
            title="Net Sales by Category"
            value="Sorry, you have no net sales by category data to display at this time."
          />
          <StatCard
            title="Net Sales by Item"
            value="Sorry, you have no net sales by items data to display at this time."
          />
          <BreakdownTable />
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Dashboard;

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
      const {
        _id,
        email,
        firstName,
        status,
        lastName,
        phone,
        businessName,
        establishedAt,
      } = response.meUser;

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
            businessName,
            establishedAt,
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

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white shadow rounded-lg p-4 hover:scale-105 transition-transform">
    <h3 className="font-semibold">{title}</h3>
    <p className="mt-2">{value}</p>
  </div>
);

const QrCard = () => (
  <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform">
    <div className="text-center">
      <img
        src="/path/to/qr-code.png"
        alt="QR Code"
        className="w-24 h-24 mx-auto"
      />
      <p className="mt-2">Choose Now, the free mobile operator application</p>
      <div className="flex space-x-2 mt-4">
        <button className="btn btn-primary">Skip</button>
        <button className="btn btn-secondary">Learn more</button>
      </div>
    </div>
  </div>
);

const BreakdownTable = () => (
  <div className="bg-white shadow rounded-lg p-4 hover:scale-105 transition-transform col-span-2">
    <h3 className="font-semibold mb-4">Breakdown</h3>
    <table className="w-full text-left">
      <thead>
        <tr>
          <th>Time</th>
          <th>Net Sales</th>
          <th>Labor Cost</th>
          <th>Labor %</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>4 AM</td>
          <td>$0</td>
          <td>$0</td>
          <td>$0</td>
        </tr>
        <tr>
          <td>5 AM</td>
          <td>$0</td>
          <td>$0</td>
          <td>$0</td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
  </div>
);
