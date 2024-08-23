import BlockerLayout from "@/components/layouts/blockerLayout";
import useAggregatorIntegrationStore from "@/store/aggregatorIntegration";
import useGlobalStore from "@/store/global";
import { sdk } from "@/utils/graphqlClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const CloverConnectionVerify = () => {
  const { setToastData } = useGlobalStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { isComingFromAggregatorPage, setIsComingFromAggregatorPage } =
    useAggregatorIntegrationStore();

  useEffect(() => {
    const connectToClover = async () => {
      try {
        const merchant_id = router.query.merchant_id?.toString() ?? "";
        const client_id = router.query.client_id?.toString() ?? "";
        const code = router.query.code?.toString() ?? "";

        if (merchant_id && code) {
          const response = await sdk.validateCloverConnection({
            input: {
              authCode: code,
              merchantId: merchant_id,
            },
          });

          if (response.validateCloverConnection) {
            setSuccess(true);
            setToastData({
              type: "success",
              message: "Operation successful",
            });
            setTimeout(() => {
              router.push(isComingFromAggregatorPage ? "/aggregator" : "/menu");
            }, 2000);
          } else {
            throw new Error("Validation failed");
          }
        } else {
          throw new Error("Missing query parameters");
        }
      } catch (error: any) {
        setToastData({
          type: "error",
          message: "There was an error, please try again later",
        });
        setError("There was an error, please try again later");
        setTimeout(() => {
          router.push(isComingFromAggregatorPage ? "/aggregator" : "/menu");
        }, 3000);
      } finally {
        setLoading(false);
        setIsComingFromAggregatorPage(false);
      }
    };
    connectToClover();
  }, [router, isComingFromAggregatorPage]);

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
        </div>
      ) : success ? (
        <div className="text-center">
          <p className="text-green-500 mb-4">Operation successful</p>
        </div>
      ) : null}
    </div>
  );
};

CloverConnectionVerify.getLayout = function getLayout(page: React.ReactNode) {
  return <BlockerLayout>{page}</BlockerLayout>;
};

export default CloverConnectionVerify;

// import BlockerLayout from "@/components/layouts/blockerLayout";
// import useAggregatorIntegrationStore from "@/store/aggregatorIntegration";
// import useGlobalStore from "@/store/global";
// import { sdk } from "@/utils/graphqlClient";
// import { GetServerSideProps, NextPage } from "next";
// import { useRouter } from "next/router";
// import { FaSpinner } from "react-icons/fa";

// interface CloverConnectionVerifyProps {
//   success: boolean;
//   error: string | null;
//   redirectUrl: string;
// }

// const CloverConnectionVerify: NextPage<CloverConnectionVerifyProps> = ({
//   success,
//   error,
//   redirectUrl,
// }) => {
//   const { setToastData } = useGlobalStore();
//   const router = useRouter();
//   const { setIsComingFromAggregatorPage } = useAggregatorIntegrationStore();

//   if (success) {
//     setToastData({
//       type: "success",
//       message: "Operation successful",
//     });
//     setTimeout(() => {
//       router.push(redirectUrl);
//     }, 2000);
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <FaSpinner className="animate-spin h-8 w-8 text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     setToastData({
//       type: "error",
//       message: "There was an error, please try again later",
//     });
//     setTimeout(() => {
//       router.push(redirectUrl);
//     }, 3000);
//     return (
//       <div className="w-full h-full flex flex-col items-center justify-center p-4">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full flex items-center justify-center">
//       <FaSpinner className="animate-spin h-8 w-8 text-primary" />
//     </div>
//   );
// };

// CloverConnectionVerify.getLayout = function getLayout(page: React.ReactNode) {
//   return <BlockerLayout>{page}</BlockerLayout>;
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { merchant_id, client_id, code } = context.query;
//   const isComingFromAggregatorPage =
//     context.req.cookies["isComingFromAggregatorPage"] === "true";
//   const redirectUrl = isComingFromAggregatorPage ? "/aggregator" : "/menu";

//   let success = false;
//   let error: string | null = null;

//   try {
//     if (merchant_id && client_id && code) {
//       const response = await sdk.validateCloverConnection({
//         input: {
//           authCode: code.toString(),
//           merchantId: merchant_id.toString(),
//         },
//       });

//       if (response.validateCloverConnection) {
//         success = true;
//       } else {
//         error = "Validation failed";
//       }
//     } else {
//       error = "Missing query parameters";
//     }
//   } catch (e) {
//     error = "There was an error, please try again later";
//   }

//   return {
//     props: {
//       success,
//       error,
//       redirectUrl,
//     },
//   };
// };

// export default CloverConnectionVerify;
