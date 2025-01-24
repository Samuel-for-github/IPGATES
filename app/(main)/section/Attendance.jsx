import { Alert, Button, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../../components/ScreenWrapper.jsx'
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import AntDesign from '@expo/vector-icons/AntDesign';
import { hp, wp } from '../../../helper/common.js'
import Feather from '@expo/vector-icons/Feather';
import {theme} from '../../../constants/theme.js'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter} from 'expo-router';
import BackButton from '../../../components/BackButton.jsx'
import Footer from '../../../components/Footer.jsx';
import Avatar from '../../../components/Avatar.jsx';
const attendance = () => {
  const { setAuth, user } = useAuth()
      const router = useRouter()


   async function signOut() {
  
          const { error } = await supabase.auth.signOut()
          console.log(error);
  
          if (error) {
              Alert.alert('Error', error.message)
          }
      }
  
      const handleLogout= async()=>{
          Alert.alert('Confirm', 'Are you sure you want to log out?', [
              {
                  text: 'Cancel',
                  onPress: ()=>console.log("logout cancel"),
                  style: 'cancel'
                  
              },{
                  text: 'Logout',
                  onPress: ()=>signOut(),
                  style: 'destructive'
              }
          ])
      }
  return (
    <ScreenWrapper bg="#000">
      <StatusBar style='light' />
           {/* <Image  */}
      {/* style={styles.background} */}
      {/* blurRadius={40} */}
      {/* source={{uri: 'https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}}/> */}
      <View style={styles.container}>
 
        <View style={styles.header}>
          {/* <Text style={styles.appName}>IPGATES</Text> */}

    <BackButton color="white" size={35}/>
        
          <View style={styles.icon}>
           
            <Pressable>
            <Ionicons name="notifications-outline" size={24} color="white" />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Feather name="log-out" size={24} color="white" />
            </Pressable>
          </View>
        </View>
       <View>
        <Text style={styles.heading}>Attendance</Text>
       </View>
      </View>
       <Footer/>
     
    </ScreenWrapper>
  )
}

export default attendance

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading:{
    color: theme.colors.textLight,
    fontSize: hp(6),
    width: wp(80),
    marginVertical: hp(3),
    textAlign: 'left',
    marginLeft: wp(4)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(3),
    marginTop: hp(2)
  },
  logo:{
    height: 60,
    width: 150,
    backgroundColor: 'rgba(228, 222, 222, 0.91)',
    borderRadius: 10,
  },
  icon: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    alignItems: 'center'
  },
  cards:{
    flex: 1,
    marginVertical: hp(3),
    paddingVertical: hp(5),
    borderRadius: theme.radius.xl,
    width: wp(81),
    borderCurve: 'continuous',
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 8,  
  },
  card1:{
    position: 'absolute',
    top: -80,
    width: wp(40),
    height: hp(40),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '90deg'}]
  },
  cardsText:{
    fontSize: hp(7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  background:{
    position: 'absolute',
    height: hp(150),
    width: wp(100),
  }
})