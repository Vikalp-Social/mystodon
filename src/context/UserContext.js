import {createContext, useState} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const UserContext = createContext();
export const UserUpdateContext = createContext();

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
    const [paths] = useState({
        home: "/home/",
        profile: "/profile",
        search: "/search",
        tags: "/tags",
        status: "/status",
        theme: "/theme",
        vikalp: "/vikalp",
    });

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser, isLoggedIn, setLoggedIn, paths}}>
            {children}
        </UserContext.Provider>
      )
}