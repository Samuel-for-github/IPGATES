import { createContext, useContext, useState } from "react";

const CourseContext = createContext();

export const CourseProvider=({children})=>{
    const [status, setStatus] = useState('not-applied');
    
    return(
        <CourseContext.Provider value={{status, setStatus}}>{
            children
        }</CourseContext.Provider>
    )
}

export default CourseContext;