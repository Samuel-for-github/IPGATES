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
  import React, { useEffect, useState } from "react";
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
  import { MicrosoftData, CiscoData, RedHatLinuxData, PythonData, HandNData, courses } from '../../../constants/data.js';
  import Avatar from '../../../components/Avatar.jsx';
  import Footer from '../../../components/Footer.jsx';
  import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer } from "expo-video";
  import { VideoView } from "expo-video";
  
  const demos = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]); // State to hold notes
    const [loading, setLoading] = useState(false);
    const {folder} = useLocalSearchParams();
  const router = useRouter()
   
  
//   https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738338619/WhatsApp_Video_2025-01-27_at_14.54.53_395e58af_ouzq4m.mp4

const cisco = useVideoPlayer('https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738338619/WhatsApp_Video_2025-01-27_at_14.54.53_395e58af_ouzq4m.mp4', player=>{
    player.loop = true;
})

const microsoft = useVideoPlayer(' https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738008421/IPGATES-DEMO/VID-20250127-WA0003_a1fvtb.mp4', player => {
    player.loop = true;
  });
  const hard = useVideoPlayer('https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738008422/IPGATES-DEMO/VID-20250127-WA0006_bjxgw5.mp4', player => {
    player.loop = true;
  });
  const python = useVideoPlayer('https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738008422/IPGATES-DEMO/VID-20250127-WA0007_wbxsks.mp4', player => {
    player.loop = true;
  });
  const linux = useVideoPlayer('https://res.cloudinary.com/dyhjjsb5g/video/upload/v1738008421/IPGATES-DEMO/VID-20250127-WA0004_skfdcm.mp4', player => {
    player.loop = true;
  });
    useEffect(() => {
    console.log(folder);
    
    }, [folder]);
  
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
        <Text style={styles.heading}>{folder} Demo Video</Text>
       <ScrollView>
       <View style={styles.contentContainer}>
        {folder ==='Cisco'?(
            <View style={{alignItems: 'center'}}>

                <VideoView style={styles.video} player={cisco} allowsFullscreen allowsPictureInPicture />
                <View style={styles.controlsContainer}/>
            </View>
                ):(
                    <View></View>
                )}
           {folder ==='Python'?(
            <View style={{alignItems: 'center'}}>

                <VideoView style={styles.video} player={python} allowsFullscreen allowsPictureInPicture />
                <View style={styles.controlsContainer}/>
            </View>
                ):(
                    <View></View>
                )}
                 {folder ==='Microsoft'?(
            <View style={{alignItems: 'center'}}>
                <VideoView style={styles.video} player={microsoft} allowsFullscreen allowsPictureInPicture />
                <View style={styles.controlsContainer}/>
            </View>
                ):(
                    <View></View>
                )}
                {folder ==='Red Hat Linux'?(
            <View style={{alignItems: 'center'}}>
                <VideoView style={styles.video} player={linux} allowsFullscreen allowsPictureInPicture />
                <View style={styles.controlsContainer}/>
            </View>
                ):(
                    <View></View>
                )}
                 {folder ==='Hardware & Networking'?(
            <View style={{alignItems: 'center'}}>
                <VideoView style={styles.video} player={hard} allowsFullscreen allowsPictureInPicture />
                <View style={styles.controlsContainer}/>
            </View>
                ):(
                    <View></View>
                )}
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
      fontSize: hp(3),
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
  },video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
  });
  