import { useState } from "react";

export type CoordinatesType = {
  lat: number;
  lng: number;
};

export const useLocation = () => {
  const [centerLocation, setCenterLocation] = useState<CoordinatesType>({
    lat: -15.792204,
    lng: -47.890343,
  });

  const [error, setError] = useState<string | null>(null);

  function getLocation() {
    if (!navigator.geolocation)
      return alert("Your browser does not support geolocation");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenterLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        setError(error.message);
      }
    );
  }

  return { centerLocation, setCenterLocation, error, getLocation };
};
