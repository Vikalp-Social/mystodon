import {createContext, useState} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const UserContext = createContext();
export const UserUpdateContext = createContext();

// UserContextProvider is used to store the current user's data and whether the user is logged in or not
export function UserContextProvider({children}){
    const [userId, setUserId] = useLocalStorage("user_id", 0);
    const [users, setUsers] = useLocalStorage("users", []);
    const [isLoggedIn, setLoggedIn] = useLocalStorage("logged_in",false);
    const [currentUser, setCurrentUser] = useState(users[userId]);
    const [paths] = useState({
        home: "/home",
        profile: "/profile",
        search: "/search",
        tags: "/tags",
        status: "/status",
        theme: "/theme",
        vikalp: "/vikalp",
    });

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser, isLoggedIn, setLoggedIn, paths, users, setUsers, setUserId, userId}}>
            {children}
        </UserContext.Provider>
      )
}