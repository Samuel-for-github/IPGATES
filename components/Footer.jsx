import { Alert, Button, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

// import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../context/AuthContext.js';
import { hp, wp } from '../helper/common.js'
import { theme } from '../constants/theme.js'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Avatar from '../components/Avatar.jsx';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FooterContext from '../context/FooterContext.js';
const Footer = (props) => {
  const { user } = useAuth()
  const router = useRouter()
  const { isActive, setIsActive } = useContext(FooterContext);


  return (

    <View style={[styles.footer, props.style]}>
      <Pressable style={[
        styles.footerIcon,
        isActive === 'home' ? styles.tab : {}
      ]}
        onPress={() => {
          setIsActive('home')
          router.push('/home')
        }}>
        <AntDesign name="home" size={23} color="black" />
        <Text style={{ color: isActive=='home'? theme.colors.dark:'#b7e4c7'}}>Home</Text>
      </Pressable>
      <Pressable onPress={() => {
        setIsActive('course')
      }} style={[
        styles.footerIcon,
        isActive === 'course' ? styles.tab : {}
      ]}>
        <FontAwesome6 name="graduation-cap" size={23} color="black" />
        <Text style={{ color: isActive=='course'? theme.colors.dark:'#b7e4c7'}}>My Course</Text>
      </Pressable>
      <Pressable onPress={() => setIsActive('chat')} style={[
        styles.footerIcon,
        isActive === 'chat' ? styles.tab : {}
      ]}>
        <Ionicons name="chatbox-outline" size={23} color="black" />
        <Text style={{ color: isActive=='chat'? theme.colors.dark:'#b7e4c7'}}>Chat</Text>
      </Pressable>
      <Pressable onPress={() => {
        setIsActive('profile')
        router.push('profile')
      }} style={[
        styles.footerIcon,
        isActive === 'profile' ? styles.tab : {}
      ]}>
        <Avatar uri={user?.image} size={hp(3)} rounded={theme.radius.xl} style={{ borderWidth: 2, borderColor: 'black' }} />
        <Text style={{ color: isActive=='profile'? theme.colors.dark:'#b7e4c7'}}>Account</Text>
      </Pressable>
    </View>

  )
}

export default Footer

const styles = StyleSheet.create({
  tab:{
    // alignItems: 'center',
    backgroundColor: 'white',
    width: wp(25),
    height: hp(7),
    borderRadius: 90
    // paddingHorizontal: wp(5),
   
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    backgroundColor: 'rgb(222, 224, 228)',
    marginHorizontal: wp(3),
    borderRadius: theme.radius.md,
    gap: hp(10),
    paddingBottom: hp(3),

  },
  containerStyles: {
    marginHorizontal: wp(3.5),
    borderRadius: 10

  },
  headingText: {
    fontSize: hp(3),
    color: 'black'
  },
  footer: {
    shadowColor: 'white',
    flexDirection: 'row',
    width: wp(99),
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    paddingVertical: 5
    // borderWidth: 2,
    // elevation: 5,
  },
  footerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(8),
    borderRadius: '100%'
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
    flexDirection: 'row'
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
    fontSize: hp(7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  background: {
    position: 'absolute',
    height: hp(150),
    width: wp(100),
  }
})