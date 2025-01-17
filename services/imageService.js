import AntDesign from '@expo/vector-icons/AntDesign';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
export const getImage = imagePath =>{
    if(imagePath){
        return {uri: imagePath}
    }
    else{
        return require('../assets/images/images.png')
    }
}

export const uploadFile = async (folderName, fileUri, isImage=true)=>{
    try {
        let fileName =getFilePath(folderName,isImage)
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: 'base64'
        })
        let imageData = decode(fileBase64)
        let {data, error}=await supabase.storage.from('uploads').upload(fileName, imageData, {contentType: isImage? 'image/*': 'video/*', cacheControl: '3600', upsert: false})

        if (error) {
            console.log("file upload error", error);
        return {success: false}
        }
       
        
        return {success: true, data: data.path}
    }catch (error) {
        console.log("file upload error", error);
        return {success: false}
        
    }
}

export const getFilePath= (folderName, isImage)=>{
    return `/${folderName}/${(new Date()).getTime()}${isImage? '.png'||'.jpg':'.mp4'}`
}