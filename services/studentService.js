import { supabase } from "../lib/supabase";

export const getStudentData = async (studentId)=>{
    try {
        const {data, error} = await supabase.from('student').select().eq('id', studentId).single();
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

export const updateStudent = async (studentId, data)=>{
    try {
        const {error} = await supabase.from('student').update({s_name: data.name, phoneNumber: data.phoneNumber, address: data.address, image: data.image}).eq('id', studentId);
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