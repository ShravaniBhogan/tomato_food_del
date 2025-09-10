import React, { useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  // Filter foods based on category
  const filteredFoods =
    category === "All"
      ? food_list
      : food_list.filter((item) => item.category === category);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {filteredFoods && filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              desc={item.description}
              price={item.price}
            />
          ))
        ) : (
          <p>No food items found</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
