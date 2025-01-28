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
import { courses, features } from '../../constants/data.js';
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
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style='dark' />
      <View style={styles.container}>
      {/* <Image source={require('../../assets/images/welcome.png')} style={styles.welcomeImage} resizeMode='contain' /> */}
        <View style={styles.top}>
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
          <Input icon={<AntDesign name="search1" size={24} color="black" />} containerStyles={[{backgroundColor: '#d8f3dc'}, styles.containerStyles]} placeholderTextColor={theme.colors.textDark} placeholder="Search here"/>
        </View>
        </View>
       

       
       
       <ScrollView>
       <View style={styles.content}>
             {features.map((value, i)=>{
        return(
          <TouchableOpacity key={i} style={styles.cards}
          onPress={() => {
              router.push(`/section/${value.title}`)
          }}
        >
        
          
         <Image style={{height: 100, width: 100}} source={value.img}/>
          <Text style={styles.cardsText}>{value.title}</Text>
         
        </TouchableOpacity>
        )
      })} 
          </View>
       </ScrollView>
        
      
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
        
  
      
       <Footer/>
      </View>

    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({
  welcomeImage: {
    position: 'absolute',
    height: hp(100),
    width: wp(100),
    opacity: 0.3
    // alignSelf: 'center'
},
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
top:{
// backgroundColor: 'rgb(106, 167, 116)',
marginHorizontal: wp(3),
borderRadius: theme.radius.md,
gap: hp(10),
paddingBottom: hp(3)
// borderWidth: 2
  },
  containerStyles:{
    marginHorizontal: wp(3.5),
    borderRadius: 70
    
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
    flexWrap: 'wrap',
    width: wp(95),
    height: hp(100),
    gap: wp(4),
    // marginHorizontal: wp(5),
    marginLeft: wp(2),
    justifyContent: 'center',
  //  borderWidth: 2

  },
  cards: {
    backgroundColor: '#40916c',
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: wp(45),
    height: hp(25),
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    
    // flex: 1
  },
  cardsText: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  background: {
    position: 'absolute',
    height: hp(150),
    width: wp(100),
  },
  box:{
    width: '50%',
    height: '50%',
    backgroundColor: '#40916c'
  }
})