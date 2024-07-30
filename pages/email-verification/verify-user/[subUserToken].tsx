import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sdk } from "@/utils/graphqlClient";
import { FaSpinner } from "react-icons/fa";
import BlockerLayout from "@/components/layouts/blockerLayout";
import Link from "next/link";
import { extractErrorMessage } from "@/utils/utilFUncs";

const SubUserVerify = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
            throw new Error("Verification failed");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setError(extractErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <FaSpinner className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/login">
            <div className="flex items-center space-x-2">
              <p className="text-lg text-primary">Go Back to Login</p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      )}
    </div>
  );
};

SubUserVerify.getLayout = function getLayout(page: React.ReactNode) {
  return <BlockerLayout>{page}</BlockerLayout>;
};

export default SubUserVerify;
