import {
  Alert,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Linking from 'expo-linking';
import React, {  useState } from "react";
import { supabase } from "../../../lib/supabase.js";
import { useAuth } from "../../../context/AuthContext.js";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../../components/BackButton.jsx";
import { hp, wp } from "../../../helper/common.js";
import { theme } from "../../../constants/theme.js";
import ScreenWrapper from '../../../components/ScreenWrapper.jsx';
import { useRouter, useSearchParams, useLocalSearchParams, useSegments } from 'expo-router';
import { courses } from '../../../constants/data.js';


const demos = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Logout cancel"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Error logging out:", error.message);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
        <ScreenWrapper bg="#b7e4c7">
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <BackButton size={35} />
        <View style={styles.icon}>
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={24} />
          </Pressable>
          <Pressable
            onPress={handleLogout}
            accessibilityLabel="Log out button"
            accessibilityRole="button"
          >
            <Feather name="log-out" size={24} />
          </Pressable>
        </View>
      </View>
      <Text style={styles.heading}>Demos</Text>
     <ScrollView>
     
                         <View style={styles.content}>
                             {courses.map((value, i) => {
                                 return (
                                  
                                     <TouchableOpacity key={i} style={styles.cards}
                                         onPress={() => {
                                             router.push(`/demo/demos?folder=${encodeURIComponent(value.title)}`)
                                         }}
                                     >
                                         <Text style={styles.cardsText}>{value.title}</Text>
                                     </TouchableOpacity>
                                 )
     
                             })}
                         </View>
                     </ScrollView>
    </View>
    </ScreenWrapper>
  );
};

export default demos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b7e4c7",
  },
  heading: {
    color: theme.colors.textDark,
    fontSize: hp(6),
    width: wp(80),
    marginVertical: hp(3),
    textAlign: "left",
    marginLeft: wp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(3),
    marginTop: hp(2),
  },
  icon: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  note: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  noteText: {
    color: "black",
  },
  cards: {
    //   flex: 1,
    marginVertical: hp(3),
    //   paddingVertical: hp(5),
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: '#40916c',
    borderRadius: theme.radius.xl,
    width: wp(80),
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    height: hp(15)
},
content: {
  flex: 1,
  // flexDirection: 'row',
  gap: 10,
  marginBottom: wp(15),
  alignItems: 'center'
},
cardsText: {
  //     borderColor: theme.colors.primary,
  //   borderWidth: 1,
  //   paddingVertical: hp(5),
  justifyContent: 'center',
  // height: hp(10),
  fontSize: hp(4),
  fontWeight: theme.fonts.semibold,
  color: theme.colors.textDark,
},
});


/*
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
import { useVideoPlayer, VideoView} from 'expo-video';

const Demo = () => {
  const { setAuth, user } = useAuth()
      const router = useRouter()
     
     

 const player1 = useVideoPlayer(' https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738008421/IPGATES-DEMO/VID-20250127-WA0003_a1fvtb.mp4', player => {
    player.loop = true;
  });
  const player2 = useVideoPlayer('https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738008422/IPGATES-DEMO/VID-20250127-WA0006_bjxgw5.mp4', player => {
    player.loop = true;
  });
  const player3 = useVideoPlayer('https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738008422/IPGATES-DEMO/VID-20250127-WA0007_wbxsks.mp4', player => {
    player.loop = true;
  });
  const player4 = useVideoPlayer('https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738008421/IPGATES-DEMO/VID-20250127-WA0004_skfdcm.mp4', player => {
    player.loop = true;
  });
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
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style='dark' />
           
      <View style={styles.container}>
 
        <View style={styles.header}>
        

    <BackButton  size={35}/>
        
          <View style={styles.icon}>
           
            <Pressable>
            <Ionicons name="notifications-outline" size={24}  />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Feather name="log-out" size={24}  />
            </Pressable>
          </View>
        </View>
       
        <Text style={styles.heading}>Demo Videos</Text>
        <ScrollView>
        <View style={styles.contentContainer}>
          <VideoView style={styles.video} player={player1} allowsFullscreen allowsPictureInPicture />
          <View style={styles.controlsContainer}/>
          <VideoView style={styles.video} player={player2} allowsFullscreen allowsPictureInPicture />
          <View style={styles.controlsContainer}/>
          <VideoView style={styles.video} player={player3} allowsFullscreen allowsPictureInPicture />
          <View style={styles.controlsContainer}/>
          <VideoView style={styles.video} player={player4} allowsFullscreen allowsPictureInPicture />
          <View style={styles.controlsContainer}/>
      </View>
       </ScrollView>
      </View>
   
    </ScreenWrapper>
  )
}

export default Demo

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  container: {
    flex: 1,
  },
  heading:{
    // color: theme.colors.textLight,
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
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
})
  */