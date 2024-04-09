import React, { useState} from "react";

export const UserContext = React.createContext();
export const UserUpdateContext = React.createContext();

export function UserContextProvider({children}){
    const [currentUser, setCurrentUser] = useState({
        name: "",
        instance: "",
        id: "",
        token: "",
        avatar: "",
    });
    const [isLoggedIn, setLoggedIn] = useState(false);

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser, isLoggedIn, setLoggedIn}}>
            {children}
        </UserContext.Provider>
      )
}