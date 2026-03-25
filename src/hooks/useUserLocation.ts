import { useEffect, useState } from "react";
import { useGetQuery } from "./useQuery";

type UserLocation = {
  userIpAddress: string;
  country: string;
  countryCode: string;
  city: string;
};

type Response = {
  ip: string;
  country_name: string;
  country_code: string;
  city: string;
};

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation>({
    userIpAddress: "",
    country: "",
    countryCode: "",
    city: "",
  });


  const { data, isPending, error } = useGetQuery<Response>(
    ["location"],
    "https://ipapi.co/json/",
  );



  useEffect(() => {
    if (data) {
      setLocation({
        userIpAddress: data.ip,
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
      });
    }
  }, [data]);

  return { location, isPending, error };
};
