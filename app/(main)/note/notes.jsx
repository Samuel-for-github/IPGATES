import {
  Alert,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase.js";
import { useAuth } from "../../../context/AuthContext.js";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../../components/BackButton.jsx";
import { hp, wp } from "../../../helper/common.js";
import { theme } from "../../../constants/theme.js";
import ScreenWrapper from "../../../components/ScreenWrapper.jsx";
import { useLocalSearchParams } from "expo-router";
import { getCourseData } from "../../../services/courseService.js";

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { folder } = useLocalSearchParams();
  const [allow, setAllow] = useState(false);

  // ✅ Function to fetch user courses
  const checkAccess = async () => {
    try {
      const res = await getCourseData(user?.id);
      res.data.map((val,i)=>{
        
        if (folder==val.c_name && val.request == 'Accepted') {
          setAllow(true)
        }

     
        
      })
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  // ✅ Function to fetch notes
  const getNotes = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("notes")
        .list(`public/${folder}`);
      if (error) throw error;

      if (!data || data.length === 0) return [];

      const excludedFiles = [".emptyFolderPlaceholder", "test.txt"];
      return data.filter((note) => !excludedFiles.includes(note.name));
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  };

  // ✅ Function to download file
  const download = async (fileName) => {
    try {
      const { data, error } = await supabase.storage
        .from("notes")
        .getPublicUrl(`public/${folder}/${fileName}`);
      if (error) throw error;

      console.log("File URL:", data.publicUrl);
      Linking.openURL(data.publicUrl);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // ✅ Check user access first
  useEffect(() => {
    if (user) {
      checkAccess();
    }
  }, [user]);

  // ✅ Fetch notes after access is granted
  useEffect(() => {
    const fetchNotes = async () => {
      if (!allow) return;
      setLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
      setLoading(false);
    };

    fetchNotes();
  }, [allow, user]); // ✅ Runs only when `allow` changes

  return (
    <ScreenWrapper bg="#b7e4c7">
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <BackButton size={35} />
          <View style={styles.icon}>
            <Pressable>
              <Ionicons name="notifications-outline" size={24} />
            </Pressable>
            <Pressable>
              <Feather name="log-out" size={24} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.heading}>{folder} Notes</Text>

        <ScrollView contentContainerStyle={styles.content}>
          {loading ? (
            <Text style={styles.noNotesText}>Loading notes...</Text>
          ) : notes.length === 0 ? (
            <Text style={styles.noNotesText}>No notes available.</Text>
          ) : (
            notes.map((val, i) => (
              <View key={i} style={styles.noteCard}>
                <Text style={styles.noteText}>{val.name}</Text>
                <Pressable
                  style={styles.downloadButton}
                  onPress={() => download(val.name)}
                >
                  <Feather name="download" size={20} color="white" />
                  <Text style={styles.downloadText}>Download</Text>
                </Pressable>
              </View>
            ))
          )}
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
    fontSize: hp(4),
    marginVertical: hp(3),
    marginLeft: wp(3),
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
  },
  content: {
    alignItems: "center",
    paddingBottom: hp(10),
  },
  noNotesText: {
    fontSize: hp(2.5),
    color: theme.colors.textDark,
    textAlign: "center",
    marginTop: hp(3),
  },
  noteCard: {
    backgroundColor: "#40916c",
    padding: hp(2),
    borderRadius: theme.radius.md,
    marginVertical: hp(1),
    width: wp(80),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  noteText: {
    fontSize: hp(2),
    color: "white",
    flex: 1,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b4332",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: theme.radius.md,
  },
  downloadText: {
    color: "white",
    fontSize: hp(2),
    marginLeft: wp(2),
  },
});
