import MenuSection from "@/components/common/menuSection/menuSection";
import useGlobalStore from "@/store/global";
import { menuContents } from "./menuContent";
import { UserStatus } from "@/generated/graphql";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { sdk } from "@/utils/graphqlClient";
import useAuthStore from "@/store/auth";
import { useEffect } from "react";
import MainLayout from "@/components/layouts/mainBodyLayout";

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

const Menu: NextPageWithLayout = ({ repo }: { repo?: UserRepo }) => {
  const { setSelectedMenu } = useGlobalStore();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, []);

  // if (loading) {
  //   return <Loader />;
  // }

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

  return <MenuSection contentList={menuContents} />;
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
