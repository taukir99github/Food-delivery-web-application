import React, { useEffect, useState } from "react";
import useGetRestaurants from "../utils/useGetRestaurants";
import { useDispatch, useSelector } from "react-redux";
import { setLongitude, setLatitude } from "./Redux/features/coordsSlice";
import { coordsFetch } from "./Redux/features/coordsSlice";
import Search from "./Search";
import RestaurantCard from "./RestaurantCard";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { MdLocationPin } from "react-icons/md";
import RestaurantsShimmer from "./RestaurantsShimmer";
import RestaurantFilter from "./RestaurantFilter";

const Restaurants = () => {
  const restaurantData = useGetRestaurants();

  const { restaurants } = restaurantData;

  const dispatch = useDispatch();

  const { latitude, longitude, searchedCity } = useSelector(
    (store) => store.coords
  );

  const [city, setCity] = useState("");

  function searchRestaurants() {
    dispatch(coordsFetch(city));
    setCity("");
  }

  // fetching current location (latitude and longitude) for fetching restaurants as per the location
  const getCurrCoords = () => {
    if ("geolocation" in navigator && latitude == null && longitude == null) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(setLatitude(position.coords.latitude));
          dispatch(setLongitude(position.coords.longitude));
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrCoords();
  }, []);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);
  };

  return (
    <div className="main-scroll-restaurants">
      <div className="flex justify-between flex-col md:flex-row items-center gap-2 md:px-5 md:pt-3 ">
        <div className="hidden md:block">
          <Search
            searchRestaurants={searchRestaurants}
            setCity={setCity}
            city={city}
          />
        </div>

        {searchedCity !== "" ? (
          <div className="flex items-center gap-1">
            <MdLocationPin className="text-2xl text-green-700" />
            <p className="text-2xl  font-bold">{searchedCity}</p>
          </div>
        ) : (
          <p className="text-2xl  font-bold">Your Nearest Restaurants</p>
        )}

        <div className="md:hidden">
          <Search
            searchRestaurants={searchRestaurants}
            setCity={setCity}
            city={city}
          />
        </div>
        <RestaurantFilter
          className="md:hidden"
          handleFilterChange={handleFilterChange}
        />
      </div>

      {restaurants && restaurants.length > 0 ? (
        <div className=" mt-3 ">
          <div className="grid lg:grid-cols-4 md:grid-cols-2  gap-3 ">
            <RestaurantCard
              restaurants={restaurants}
              selectedFilter={selectedFilter}
            />
          </div>
        </div>
      ) : (
        <RestaurantsShimmer />
      )}

      <div className="flex justify-center font-medium items-center mt-5 py-2 px-4 mx-auto w-fit text-lg ">
        Made with &nbsp;
        <BsFillSuitHeartFill className="text-green-700" />
        &nbsp; by&nbsp;
        <a
          href="https://github.com/taukir99github"
          className="font-bold"
          target="_blank"
          rel="noreferrer"
        >
          Md Taukir
        </a>
      </div>
    </div>
  );
};

export default Restaurants;
