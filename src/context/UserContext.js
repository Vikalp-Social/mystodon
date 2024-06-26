import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const UserContext = React.createContext();
export const UserUpdateContext = React.createContext();

// UserContextProvider is used to store the current user's data and whether the user is logged in or not
export function UserContextProvider({children}){
    const [currentUser, setCurrentUser] = useLocalStorage("current_user", {
        name: "",
        username: "",
        instance: "",
        id: "",
        token: "",
        avatar: "",
    });
    const [isLoggedIn, setLoggedIn] = useLocalStorage("logged_in",false);

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser, isLoggedIn, setLoggedIn}}>
            {children}
        </UserContext.Provider>
      )
}