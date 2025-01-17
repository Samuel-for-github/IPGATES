import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js'
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../constants/theme.js'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Input from '../../components/Input.jsx'
import { LinearGradient } from 'expo-linear-gradient';
import { courses } from '../../constants/data.js';
import Footer from '../../components/Footer.jsx';
const home = () => {
  const { setAuth, user } = useAuth()
  const router = useRouter()


  async function signOut() {

    const { error } = await supabase.auth.signOut()
    console.log(error);

    if (error) {
      Alert.alert('Error', error.message)
    }
  }

  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log("logout cancel"),
        style: 'cancel'

      }, {
        text: 'Logout',
        onPress: () => signOut(),
        style: 'destructive'
      }
    ])
  }
  return (
    <ScreenWrapper bg="#000">
      <StatusBar style='light' />
      <View style={styles.container}>
        <LinearGradient colors={['rgb(218,255,185)',  '#a990eb']} style={styles.top}>
        <View style={styles.header}>
          <Text style={styles.headingText}>Hi, {user.s_name}</Text>
          <View style={styles.icon}>
            <Pressable>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Feather name="log-out" size={24} color="black" />
            </Pressable>
          </View>
        </View>
        <View>
          <Input icon={<AntDesign name="search1" size={24} color="black" />} containerStyles={[{backgroundColor: 'white'}, styles.containerStyles]} placeholderTextColor={theme.colors.textDark} placeholder="Search here"/>
        </View>
        </LinearGradient>
       

       
         <ScrollView horizontal>
       
          <View style={styles.content}>
      
      {courses.map((value, i)=>{
        return(
          <TouchableOpacity
          onPress={() => 
            router.push(`/courses/course?path=${encodeURIComponent(value.title)}`)
          }
          key={i}
          style={[styles.cards]}
        >
          <Image blurRadius={45} style={[styles.card1]} source={value.img} />
          <Text style={styles.cardsText}>{value.title}</Text>
        </TouchableOpacity>
        )
      })}
            {/* <TouchableOpacity onPress={()=>router.push('notes')} style={[styles.cards]}>
            <Image style={[styles.card1]} source={require('../../assets/images/bg2.jpg')}/>
              <Text style={styles.cardsText}>Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push('attendance')} style={[styles.cards]}>
            <Image style={[styles.card1]} source={require('../../assets/images/bg3.jpg')}/>
              <Text style={styles.cardsText}>
                Attendance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cards]}>
            <Image style={[styles.card1]} source={require('../../assets/images/bg1.jpg')}/>
              <Text style={styles.cardsText}>Feedback</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView> 
      
       <Footer/>
      </View>

    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
top:{
backgroundColor: 'rgb(222, 224, 228)',
marginHorizontal: wp(3),
borderRadius: theme.radius.md,
gap: hp(10),
paddingBottom: hp(3)
// borderWidth: 2
  },
  containerStyles:{
    marginHorizontal: wp(3.5),
    borderRadius: 10
    
  },
  headingText:{
    fontSize: hp(3),
    color: 'black'
  },
  heading: {
    color: theme.colors.textLight,
    fontSize: hp(6),
    width: wp(80),
    marginVertical: hp(3),
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(3),
    marginTop: hp(2)
  },
  logo: {
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
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: wp(3),
    // alignItems: 'center'
  },
  cards: {
    flex: 1,
    marginVertical: hp(3),
    paddingVertical: hp(5),
    borderRadius: theme.radius.xl,
    width: wp(81),
    borderCurve: 'continuous',
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    height: hp(21)
  },
  card1: {
    position: 'absolute',
    top: -80,
    width: wp(40),
    height: hp(40),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '90deg' }]
  },
  cardsText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  background: {
    position: 'absolute',
    height: hp(150),
    width: wp(100),
  }
})