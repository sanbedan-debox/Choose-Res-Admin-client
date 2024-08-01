import React, { useEffect, useState } from "react";
import useProfileStore from "@/store/profile";

const IdentityVerificationForm: React.FC = () => {
  const { ein } = useProfileStore();
  const [einState, setEinState] = useState(ein);

  useEffect(() => {
    setEinState(ein);
  }, [ein]);

  return (
    <div className="bg-white p-4 rounded-lg space-y-4 md:space-y-3 w-full ">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Verified Information</h2>
      </div>
      <div className="text-left text-sm text-gray-600">
        <p>
          <strong>EIN:</strong> {ein}
        </p>
      </div>
    </div>
  );
};

export default IdentityVerificationForm;
