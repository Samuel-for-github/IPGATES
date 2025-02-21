import { supabase } from "../lib/supabase";

export const getCourseData = async (studentId)=>{
    try {
        const {data, error} = await supabase.from('course').select('*').eq('student_id', studentId);
        if (error) {
            console.log('got error', error);
            return {success: false, message: error.message}
        }
        
        return{success: true, data};
    } catch (error) {
        console.log('got error', error);
        return {success: false, message: error.message}
        
    }
}

export const getCourseData2 = async ()=>{
    try {
        const {data, error} = await supabase.from('course').select('*').eq('request', 'not-paid')
        if (error) {
            console.log('got error', error);
            return {success: false, message: error.message}
        }
        
        return{success: true, data};
    } catch (error) {
        console.log('got error', error);
        return {success: false, message: error.message}
        
    }
}
export const getCourseData3 = async ()=>{
    try {
        const {data, error} = await supabase.from('course').select('*').eq('request', 'paid')
        if (error) {
            console.log('got error', error);
            return {success: false, message: error.message}
        }
        
        return{success: true, data};
    } catch (error) {
        console.log('got error', error);
        return {success: false, message: error.message}
        
    }
}