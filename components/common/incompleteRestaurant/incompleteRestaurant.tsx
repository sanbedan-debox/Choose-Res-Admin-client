import React from "react";
import { FaArrowRight } from "react-icons/fa";

type IncompleteRestaurantsProps = {
  restaurants: { id: string; name: string }[];
  completeRes: (id: string) => void;
};

const IncompleteRestaurants: React.FC<IncompleteRestaurantsProps> = ({
  restaurants,
  completeRes,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 h-64 col-span-4">
      <h2 className="text-lg font-semibold mb-4">Pending Restaurants</h2>
      {restaurants.length === 0 ? (
        <p className="text-center text-gray-600">No incomplete restaurants</p>
      ) : (
        <ul className="overflow-y-auto scrollbar-hide h-40">
          {restaurants.map((restaurant, index) => (
            <li key={restaurant.id} className="mb-2">
              <div
                onClick={() => {
                  completeRes(restaurant.id);
                }}
                className="block p-4 cursor-pointer transition-all border rounded-lg hover:bg-gray-100 group"
              >
                <div className="flex justify-between items-center text-sm">
                  <span>
                    {index + 1}. Complete {restaurant.name} by clicking here.
                  </span>
                  <FaArrowRight className="w-5 h-5 text-primary transition-all group-hover:translate-x-2" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IncompleteRestaurants;
