import { createContext, useContext, useEffect, useState } from "react";
import { fetchAccountAPI } from "../../services/api";

interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  setUser: (v: IFetchUser | null) => void;
  user: IFetchUser | null;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode;
};

export const AppProvider = (props: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IFetchUser | null>(null);
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res) {
        setUser(res);
        setIsAuthenticated(true);
      }
    };
    fetchAccount();
  }, []);
  return (
    <>
      <CurrentAppContext.Provider
        value={{
          isAuthenticated,
          user,
          setIsAuthenticated,
          setUser,
        }}
      >
        {props.children}
      </CurrentAppContext.Provider>
    </>
  );
};

export const useCurrentApp = () => {
  const currentAppContext = useContext(CurrentAppContext);

  if (!currentAppContext) {
    throw new Error(
      "useCurrentApp has to be used within <CurrentAppContext.Provider>"
    );
  }

  return currentAppContext;
};
