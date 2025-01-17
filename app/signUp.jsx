import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import BackButton from '../components/BackButton'
import AntDesign from '@expo/vector-icons/AntDesign';
import { wp, hp } from '../helper/common'
import Input from '../components/Input'
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
const SignUp = () => {
    const router = useRouter()
    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current|| !usernameRef.current) {
            Alert.alert('Sign Up', "please fill all the fields");
            return;
        }
       if(passwordRef.current.length<8){
        Alert.alert('Sign Up', "password should be atleast 8 characters");
            return;
       }
       let username = usernameRef.current.trim();
       let email = emailRef.current.trim();
       let password = passwordRef.current.trim();
       setLoading(true)
    const {data: { session },error} = await supabase.auth.signUp({
      email: email,
      password: password,
      options:{
        data:{
          s_name: username,
          email: email
        }
      }
    })
    // console.log("session", session);
    
    if (error) Alert.alert('Sign Up',error.message)
   
    setLoading(false)
       
    }
    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>
                <BackButton style={styles.backButton} size={28} />
                <View>
                    <Text style={styles.welcomeText}>Let's Get Started</Text>
                </View>
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(2), color: theme.colors.text }}>Please fill the details to create new account</Text>
                    <Input icon={<AntDesign name="user" size={24} color="black" />} placeholder="Enter your name" onChangeText={(value) => { usernameRef.current = value }} />
                    <Input icon={<MaterialIcons name="mail-outline" size={24} color="black" />} placeholder="Enter your email" onChangeText={(value) => { emailRef.current = value }} />
                    <Input icon={<Ionicons name="lock-closed-outline" size={24} color="black" />} secureTextEntry placeholder="Enter your password" onChangeText={(value) => { passwordRef.current = value }} />
                    <Button title='Sign Up' loading={loading} onPress={onSubmit} />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Pressable onPress={()=>router.push('login')}><Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>Login</Text></Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5)
    },
    welcomeText: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
    },
    form: {
        gap: 25
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2)
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0, 0.07)'
    }
    
})