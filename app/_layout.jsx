import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { getStudentData } from '../services/studentService'

const _layout = ()=>{
  return(
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  )
}

const MainLayout = () => {
  const router = useRouter()
  const {setAuth, setUserData} = useAuth();
  useEffect(()=>{
    supabase.auth.onAuthStateChange((_event, session) => {
      // console.log("session user", session?.user?.id);
      if (session) {
        setAuth(session?.user);
        updatedStudentData(session?.user)
        router.replace('/home')
      }else{
        setAuth(null);
        router.replace('/welcome')
      }
    })
  }, [])

  const updatedStudentData= async(user)=>{
    let res = await getStudentData(user?.id)
    // console.log(res.data);
    if(res.success)setUserData(res.data)
  }

  return (
    
      <Stack screenOptions={{headerShown: false}}/>
  )
}

export default _layout

