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
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setCenterLocation({
          lat,
          lng,
        });
      },
      (error) => {
        setError(error.message);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  return { centerLocation, setCenterLocation, error, getLocation };
};
