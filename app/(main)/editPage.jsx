import { Alert, Image, Text, Pressable, StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper.jsx'
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import AntDesign from '@expo/vector-icons/AntDesign';
import { hp, wp } from '../../helper/common.js'
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../constants/theme.js'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import BackButton from '../../components/BackButton.jsx';
import Button from '../../components/Button.jsx'
import Avatar from '../../components/Avatar.jsx';
import Input from '../../components/Input.jsx';
import { updateStudent } from '../../services/studentService.js';
import * as ImagePicker from 'expo-image-picker';

import { getImage, uploadFile } from '../../services/imageService.js';
const editPage = () => {
    const [loading, setLoading] = useState(false);
    const imagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          });
      
          console.log("result pick",result);
      
          if (!result.canceled) {
            setInputs({...inputs, image: result.assets[0].uri});
          }
    }
    const router = useRouter()
    const [inputs, setInputs] = useState({
        name: '',
        phoneNumber: '',
        image: '',
        address: ''
    })
    const { user,  setUserData  } = useAuth()


    useEffect(() => {
        if (user) {
            setInputs({
                name: user.s_name || '',
                phoneNumber: user.phoneNumber || '',
                image: user.image || '',
                address: user.address || ''
            })
        }
    }, [user])
const onSubmit = async ()=>{
    let userdata = {...inputs};
    let {name, phoneNumber, address,image}= userdata;
    
    
    if (!name || !phoneNumber || !address || !image) {
       Alert.alert("Edit", "Please enter the details") 
       return ;
    }
    if (typeof image == 'object') {
        console.log('img uri', image.uri);
        
        let imageRes = await uploadFile('profiles', image?.uri, userdata)
        if (imageRes.success) {
            userdata.image = imageRes.data
        }
        else{
            userdata.image = null
        }
    }
    setLoading(true)
    const res = await updateStudent(user?.id, inputs)
    setLoading(false)
    console.log(res);
    if (res.success) {
        setUserData({...user, ...userdata});
        router.back();
    }
    
    //update user
}



let imageSrc = user.image && typeof inputs.image == 'object' ? inputs.image.uri : getImage(inputs.image)
console.log("img", imageSrc.uri);

    return (
        <ScreenWrapper bg="#000">
            <StatusBar style='light' />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <BackButton color="white" size={wp(8)} />
                    </View>
                    <View>
                        <Text style={styles.heading}>Edit Profile</Text>
                    </View>
                </View>
                <View style={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Image source={imageSrc} style={{borderRadius: 30, height: hp(12), width:hp(12)}} />
                        <Pressable onPress={imagePick}>
                            <Feather name="camera" style={styles.editIcon} size={24} color="black" />
                        </Pressable>
                    </View>
                    <Text style={{ fontSize: hp(2), fontWeight: theme.fonts.semibold,color: theme.colors.textLight }}>Please fill your profile details</Text>
                    <Input value={inputs.name} containerStyles={styles.containerStyles} style={styles.input} onChangeText={value => {
                        setInputs({ ...inputs, name: value })

                    }} icon={<Feather name='user' size={25} color="black" />} placeholderTextColor={theme.colors.textDark} placeholder="Enter your name" />
                    
                    <Input keyboardType='numeric' value={inputs.phoneNumber} containerStyles={styles.containerStyles} style={styles.input} onChangeText={value => {
                        setInputs({ ...inputs, phoneNumber: value })

                    }} icon={<Ionicons name='call-outline' size={25} color="black" />} placeholderTextColor={theme.colors.textDark} placeholder="Enter your Phone Number" />
                    
                    <Input value={inputs.address} containerStyles={styles.containerStyles} style={styles.input} onChangeText={value => {
                        setInputs({ ...inputs, address: value })

                    }} icon={<EvilIcons name="location" size={25} color="black" />} placeholderTextColor={theme.colors.textDark} placeholder="Enter your address" />
                
                <Button title='Update' loading={loading} onPress={onSubmit}/>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default editPage

const styles = StyleSheet.create({
    containerStyles: {

        backgroundColor: 'white'
    },
    input: {
        flex: 1
    },
    form: {
        marginTop: hp(2),
        marginHorizontal: wp(2),
        gap: hp(3)
    },
    courseSection: {
        alignItems: 'center',
        marginTop: hp(5),
    },
    courseText: {
        color: 'white',
        fontSize: hp(5),
        fontWeight: theme.fonts.bold
    },
    container: {
        flex: 1,
    },
    heading: {
        color: theme.colors.textLight,
        fontSize: hp(4),
        marginLeft: wp(20)

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: wp(3),
        marginTop: hp(2),
    },
    icon: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between'
    },
    content: {
        flex: 1
    },
    avatarContainer: {
        alignSelf: 'center',
        height: hp(12),
        width: hp(12)
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
    },
    userIcon: {
        borderColor: 'white',
        borderRadius: wp(5),
        borderWidth: 1,
        height: hp(12),
        width: hp(12)
    },
    username: {
        fontSize: hp(4),
        fontWeight: '500',
        color: theme.colors.textLight
    },
    infoText: {
        fontSize: hp(2),
        fontWeight: theme.fonts.medium,
        color: theme.colors.blue
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }

})