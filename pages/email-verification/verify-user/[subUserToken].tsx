import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sdk } from "@/utils/graphqlClient";
import { FaSpinner } from "react-icons/fa";

const SubUserVerify = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = router.query.subUserToken?.toString() ?? "";
        if (token) {
          const response = await sdk.verifyTeamEmail({ token }, {});
          if (response) {
            router.push("/login");
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {loading && <FaSpinner className="animate-spin h-5 w-5 text-white" />}
    </div>
  );
};

export default SubUserVerify;
