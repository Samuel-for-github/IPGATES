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


const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]); // State to hold notes
  const [loading, setLoading] = useState(false);
const router = useRouter()
  // const getNotes = async () => {
  //   const { data, error } = await supabase.storage
  //     .from("notes")
  //     .list("public"); // Ensure the bucket and folder names are correct
  //   if (error) {
  //     console.error("Error fetching notes:", error.message);
  //     return [];
  //   }
  //   if (!data || data.length === 0) {
  //     console.warn("No files found in the specified folder.");
  //     return [];
  //   }
  //   return data;
  // };

  const download = async(fileName)=>{
    const { data, error } = await supabase
  .storage
  .from('notes')
  .getPublicUrl(`public/${fileName}`)
  if (error) {
    console.error("Error fetching notes:", error.message);
    return [];
  }
  console.log(data);
  Linking.openURL(`${data.publicUrl}`)
  return data;

  }

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(false);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
      // console.log(notes);
      
      setLoading(false);
    };

    if (user) {
      fetchNotes();
    }
  }, [user]);

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
      <Text style={styles.heading}>Notes</Text>
     <ScrollView>
     
                         <View style={styles.content}>
                             {courses.map((value, i) => {
                                 return (
                                  
                                     <TouchableOpacity key={i} style={styles.cards}
                                         onPress={() => {
                                             router.push(`/note/notes?folder=${encodeURIComponent(value.title)}`)
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

export default Notes;

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
