import BlockerLayout from "@/components/layouts/blockerLayout";
import useGlobalStore from "@/store/global";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const CloverConnectionVerify = () => {
  const { setToastData } = useGlobalStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const connectToClover = async () => {
      try {
        const merchant_id = router.query.merchant_id?.toString() ?? "";
        const employee_id = router.query.employee_id?.toString() ?? "";
        const client_id = router.query.client_id?.toString() ?? "";
        const code = router.query.code?.toString() ?? "";

        setMerchantId(merchant_id);
        setEmployeeId(employee_id);
        setClientId(client_id);
        setCode(code);

        if (merchant_id && employee_id && client_id && code) {
          // Commented out API call to push Clover details
          // const response = await sdk.pushClover({ merchant_id, employee_id, client_id, code });

          // Simulate a 3-second timeout
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Commented out API call to get Clover account details
          // const accountDetails = await sdk.getCloverAccountDetails();

          setSuccess(true);
          setToastData({
            type: "success",
            message: "Clover connection successful",
          });
          setTimeout(() => {
            router.push("/menu");
          }, 2000);
        } else {
          setToastData({
            type: "error",
            message: "Missing query parameters",
          });
          setError("Missing query parameters");
        }
      } catch (error) {
        console.error("Failed to connect to Clover:", error);
        setToastData({
          type: "error",
          message: "An error occurred during the connection process",
        });
        setError("An error occurred during the connection process.");
      } finally {
        setLoading(false);
      }
    };
    connectToClover();
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
          <p>Merchant ID: {merchantId}</p>
          <p>Employee ID: {employeeId}</p>
          <p>Client ID: {clientId}</p>
          <p>Code: {code}</p>
        </div>
      ) : success ? (
        <div className="text-center">
          <p className="text-green-500 mb-4">Clover Connection Successful</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      )}
    </div>
  );
};

CloverConnectionVerify.getLayout = function getLayout(page: React.ReactNode) {
  return <BlockerLayout>{page}</BlockerLayout>;
};

export default CloverConnectionVerify;
