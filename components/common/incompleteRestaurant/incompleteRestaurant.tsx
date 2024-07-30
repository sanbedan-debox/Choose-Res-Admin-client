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
    <div className="bg-primary bg-opacity-5 shadow-lg rounded-lg p-4 h-64 overflow-y-auto scrollbar-hide">
      <h2 className="text-lg font-semibold mb-4">Pending Restaurants</h2>
      {restaurants.length === 0 ? (
        <p className="text-center text-gray-600">No incomplete restaurants</p>
      ) : (
        <ul>
          {restaurants.map((restaurant, index) => (
            <li key={restaurant.id} className="mb-2">
              <div
                onClick={() => {
                  console.log(`Clicked restaurant id: ${restaurant.id}`);
                  completeRes(restaurant.id);
                }}
                className="block p-4 cursor-pointer transition-transform transform bg-primary bg-opacity-5 shadow-lg rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span>
                    {index + 1}. Complete {restaurant.name} by clicking here.
                  </span>
                  <FaArrowRight className="w-5 h-5 text-primary" />
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
