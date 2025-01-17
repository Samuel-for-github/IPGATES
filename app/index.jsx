import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar'
import Loading from '../components/Loading';
const index = () => {
    const router = useRouter();
  return (
   <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
    <Loading/>
   </View>
  )
}

export default index

const styles = StyleSheet.create({})