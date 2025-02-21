import { supabase } from "../lib/supabase";

export const getUserData = async (id)=>{
    try {
        const {data, error} = await supabase.from('users').select().eq('id', id).single();
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
        const {error} = await supabase.from('users').update({name: data.name, phone: data.phone_number, address: data.address, image: data?.image}).eq('id', studentId);
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

export const getTeacherData = async ()=>{
    
    
    try {
        const {data, error} = await supabase.from('users').select().eq('role', 'Teacher');
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