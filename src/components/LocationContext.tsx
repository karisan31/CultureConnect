import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as Location from "expo-location";

interface LocationContextProps {
  location: Location.LocationObject | null;
  error: string | null;
  askPermission: () => Promise<void>;
}

const LocationContext = createContext<LocationContextProps | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const askPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } else {
        setError("Location permission denied");
      }
    } catch (error: any) {
      setError(error.message as string);
    }
  };

  useEffect(() => {
    askPermission();
  }, []);

  return (
    <LocationContext.Provider value={{ location, error, askPermission }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
