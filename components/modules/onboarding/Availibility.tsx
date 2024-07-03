import { useState } from "react";
import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import Image from "next/image";
import logo1 from "../../../assets/logo/logoWhite.png";
import CButton from "@/components/common/button/button";
import { ButtonType } from "@/components/common/button/interface";
import useGlobalStore from "@/store/global";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type Day = (typeof days)[number];

type TimeSlot = { open: string; close: string };

type Timings = {
  [key in Day]: TimeSlot[];
};

const Availability = () => {
  const { setToastData } = useGlobalStore();
  const [timings, setTimings] = useState<Timings>(
    days.reduce((acc, day) => {
      acc[day] = [{ open: "", close: "" }];
      return acc;
    }, {} as Timings)
  );

  const handleChange = (
    day: Day,
    index: number,
    field: "open" | "close",
    value: string
  ) => {
    setTimings((prev) => {
      const newTimings = { ...prev };
      newTimings[day][index][field] = value;
      return newTimings;
    });
  };

  const addTimeSlot = (day: Day) => {
    setTimings((prev) => {
      const newTimings = { ...prev };
      newTimings[day].push({ open: "", close: "" });
      return newTimings;
    });
  };

  const removeTimeSlot = (day: Day, index: number) => {
    setTimings((prev) => {
      const newTimings = { ...prev };
      newTimings[day].splice(index, 1);
      return newTimings;
    });
  };

  const handleSave = () => {
    console.log("Timings saved:", timings);
  };

  return (
    <motion.div
      className="z-10 flex flex-col items-center space-y-5 text-center h-full"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="flex flex-col items-center space-y-3 text-center"
      >
        <div className="relative z-10 flex items-center justify-center my-2">
          <Image className="mb-2" src={logo1} alt="Logo" width={100} />
        </div>
        <h1 className="font-display max-w-xl text-2xl font-semibold transition-colors sm:text-3xl">
          Set Your Store Availability
        </h1>
      </motion.div>

      <div
        className="w-full max-w-2xl rounded-lg p-4  overflow-y-auto"
        style={{ maxHeight: "75vh" }}
      >
        <div className="grid grid-cols-1 gap-4">
          {days.map((day) => (
            <div key={day} className=" rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium">{day}</h2>
                <button
                  onClick={() => addTimeSlot(day)}
                  className="text-primary"
                >
                  +
                </button>
              </div>
              {timings[day].map((timeSlot, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={timeSlot.open !== "" && timeSlot.close !== ""}
                    onChange={(e) =>
                      handleChange(
                        day,
                        index,
                        "open",
                        e.target.checked ? "00:00" : ""
                      )
                    }
                  />
                  <input
                    type="time"
                    value={timeSlot.open}
                    onChange={(e) =>
                      handleChange(day, index, "open", e.target.value)
                    }
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={timeSlot.close}
                    onChange={(e) =>
                      handleChange(day, index, "close", e.target.value)
                    }
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <button
                    onClick={() => removeTimeSlot(day, index)}
                    className="text-red-500"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <CButton onClick={handleSave} type={ButtonType.Primary}>
          Save
        </CButton>
      </div>
    </motion.div>
  );
};

export default Availability;
