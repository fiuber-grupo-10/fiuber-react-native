/* eslint-disable no-unused-vars */
import React from 'react';

const FiuberContext = React.createContext();

const ContextProvider = ({children}) => {

    const userAuth = {
        name:'',
        uid:'',
        email:'',
        password:'',
        wallet:'',
        jwt:'',
    }

    const address = {
        description:'',
        longitude:0,
        latitude:0
    }

    const [loggedIn, setLoggedIn] = React.useState(false);
    const [role, setRole] = React.useState('');
    const [user, setUser] = React.useState(userAuth);
    const [currentDestination, setCurrentDestination] = React.useState(address);
    const [defaultDestination, setDefaultDestination] = React.useState('');
    const [hasDefaultDestination, setHasDefaultDestination] = React.useState(false);

    return(
        <FiuberContext.Provider value={{
            role,setRole,
            loggedIn, setLoggedIn,
            user, setUser,
            currentDestination, setCurrentDestination,
            defaultDestination, setDefaultDestination,
            hasDefaultDestination, setHasDefaultDestination
        }}>
            {children}
        </FiuberContext.Provider>
    )
}

export {FiuberContext,ContextProvider};