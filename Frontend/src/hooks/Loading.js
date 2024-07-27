import { useState, createContext, useContext } from "react";

const LoadingContext = createContext({})

export const LoadProvider = ({ children }) => {
    const [isLoading,setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return(
        <LoadingContext.Provider value={{isLoading, showLoading, hideLoading}}>
            {children}
        </LoadingContext.Provider>
    )
}

export const Loading = () => useContext(LoadingContext);