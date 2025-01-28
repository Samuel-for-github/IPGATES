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
      const assetId = require('../../../assets/video/org.mp4');
      const assetId2 = require('../../../assets/video/linux.mp4');
      const assetId3 = require('../../../assets/video/song.mp4');
      const assetId4 = require('../../../assets/video/add.mp4');
      const videoSource1= {
        assetId,
        metadata: {
          title: 'Org',
          artist: 'IPGATES',
        }
      }
   

 const player1 = useVideoPlayer(videoSource1, player => {
    player.loop = true;
  });
  const player2 = useVideoPlayer(assetId2, player => {
    player.loop = true;
  });
  const player3 = useVideoPlayer(assetId3, player => {
    player.loop = true;
  });
  const player4 = useVideoPlayer(assetId4, player => {
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