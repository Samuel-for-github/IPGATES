import { createContext, useContext, useState } from "react";

const FooterContext = createContext();

export const FooterProvider=({children})=>{
    const [isActive, setIsActive] = useState('home');
    
    return(
        <FooterContext.Provider value={{isActive, setIsActive}}>{
            children
        }</FooterContext.Provider>
    )
}

export default FooterContext;