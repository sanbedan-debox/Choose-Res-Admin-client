import React, { useEffect, useState } from "react";
import useProfileStore from "@/store/profile";

const IdentityVerificationForm: React.FC = () => {
  const { ein } = useProfileStore();
  const [einState, setEinState] = useState(ein);

  useEffect(() => {
    setEinState(ein);
  }, [ein]);

  return (
    <div className="z-10 flex flex-col w-full max-w-lg items-center space-y-5 text-center">
      <form className="space-y-4 md:space-y-3 w-full max-w-2xl">
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            EIN
          </label>
          <input
            type="text"
            value={einState}
            onChange={(e) => setEinState(e.target.value)}
            // onBlur={() => setEin(einState)}
            className="input input-primary"
            placeholder="EIN"
          />
          <p className="text-gray-400 text-xs text-start mt-1">
            Enter your 9-digits EIN number in this format XX-XXXXXXX
          </p>
        </div>
      </form>
    </div>
  );
};

export default IdentityVerificationForm;
