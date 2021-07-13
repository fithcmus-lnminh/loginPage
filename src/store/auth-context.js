import React, {useState, useEffect} from 'react'

const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: (email, password) => {}//initial value to let IDE know the context value to hint us
});

export function AuthContextProvider(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUserLoggedInInfo = localStorage.getItem("isLoggedIn");
        if (storedUserLoggedInInfo === "1") {
            setIsLoggedIn(true); //component will run again -> loop -> useEffect
        }
    }, []); //call the 1st time when this component rendered (run or reload page)

    const loginHandler = (email, password) => {
        // We should of course check email and password
        // But it's just a dummy/ demo anyways
        localStorage.setItem("isLoggedIn", "1");
        setIsLoggedIn(true);
    };

    const logoutHandler = () => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
    };

    return <AuthContext.Provider value={{isLoggedIn: isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler}}>
        {props.children}
        </AuthContext.Provider>
    }


    export default AuthContext;