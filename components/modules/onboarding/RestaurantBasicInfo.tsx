import { motion } from "framer-motion";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants";
import { useRouter } from "next/router";
import useGlobalStore from "@/store/global";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { BevarageCategory, FoodType, MeatType } from "./interface/interface";

const RestaurantLocation = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    router.push("/onboarding/integrations");
  };

  const mondayChecked = watch("mondayRegularHours");
  const tuesdayChecked = watch("tuesdayRegularHours");
  const wednesdayChecked = watch("wednesdayRegularHours");
  const thursdayChecked = watch("thursdayRegularHours");
  const fridayChecked = watch("fridayRegularHours");
  const saturdayChecked = watch("saturdayRegularHours");
  const sundayChecked = watch("sundayRegularHours");
  return (
    <motion.div
      className="z-10 flex flex-col w-full max-w-md items-center space-y-5 text-center"
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
        className="flex flex-col items-center text-center mb-2"
      >
        <h1 className="font-display max-w-md text-2xl font-semibold transition-colors">
          Restaurant Basic Information
        </h1>
        <p className="text-sm text-gray-700">All these fields are optionals</p>
      </motion.div>

      <form
        className="space-y-4 md:space-y-3 w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Bevarage Category
          </label>
          <Select
            {...register("bevarage", {})}
            id="bevarage"
            options={BevarageCategory}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Bevarage Category(Optional)"
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Food Type
          </label>
          <Select
            {...register("food", {})}
            id="food"
            options={FoodType}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Type(Optional)"
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Meat Type
          </label>
          <Select
            {...register("meat", {})}
            id="food"
            options={MeatType}
            className="mt-1 text-sm rounded-lg w-full focus:outline-none text-left"
            classNamePrefix="react-select"
            placeholder="Select Type(Optional)"
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Instagram Link
          </label>
          <input
            {...register("sociallink", {})}
            className="input input-primary"
            placeholder="Instagram Link(Optional)"
            type="text"
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Facebook Link
          </label>
          <input
            {...register("sociallink", {})}
            className="input input-primary"
            placeholder="Facebook Link(Optional)"
            type="text"
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Twitter Link
          </label>
          <input
            {...register("sociallink", {})}
            className="input input-primary"
            placeholder="Twitter Link(Optional)"
            type="text"
          />
        </div>

        <div className="col-span-2">
          <button
            onClick={() => router.push("/dashboard")}
            type="submit"
            className="inline-flex btn btn-primary items-center justify-center w-full mt-8"
          >
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RestaurantLocation;
