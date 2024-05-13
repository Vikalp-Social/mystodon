import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const UserContext = React.createContext();
export const UserUpdateContext = React.createContext();

export function UserContextProvider({children}){
    const [currentUser, setCurrentUser] = useLocalStorage({
        name: "",
        instance: "",
        id: "",
        token: "",
        avatar: "",
    });
    const [isLoggedIn, setLoggedIn] = useLocalStorage(false);

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser, isLoggedIn, setLoggedIn}}>
            {children}
        </UserContext.Provider>
      )
}