import {
  Alert,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
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
import { useRouter, useSearchParams, useLocalSearchParams } from "expo-router";
import { Calendar } from "react-native-calendars";
import { getCourseData } from "../../../services/courseService.js";

const Demos = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State to control refresh
  const { folder } = useLocalSearchParams();
  const router = useRouter();
  const [allow, setAllow] = useState(false);

  const checkAccess = async () => {
    try {
      const res = await getCourseData(user?.id);
      res.data.map((val, i) => {
        if (folder == val.c_name && val.request == "Accepted") {
          setAllow(true);
        }
      });
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  // Fetch attendance data for the student
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select()
        .eq("course_name", folder)
        .eq("student_id", user?.id);

      if (error) throw error;

      // Convert the data to a format suitable for the calendar
      const markedDates = {};
      data.forEach((attendance) => {
        markedDates[attendance.date] = {
          marked: true,
          dotColor: attendance.status === "present" ? "green" : "red",
        };
      });

      setAttendanceData(markedDates);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch attendance data");
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing when the fetch is done
    }
  };

  // Function to trigger pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance(); // Refresh data
  };

  useEffect(() => {
    checkAccess();
    fetchAttendance();
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
            <Pressable accessibilityLabel="Notifications" accessibilityRole="button">
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
        <Text style={styles.heading}>{folder} Attendance</Text>

        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {allow ? (
            <Calendar
              markedDates={attendanceData} // Use the updated attendanceData object here
              theme={{
                calendarBackground: theme.colors.background,
                dayTextColor: "black",
                monthTextColor: "black",
                arrowColor: "black",
                selectedDayBackgroundColor: "blue",
                selectedDayTextColor: "white",
              }}
              markingType={"simple"}
              onDayPress={(day) => {
                console.log("Selected day", day);
                // You can add additional actions on day press if needed
              }}
            />
          ) : (
            <View style={styles.noAccessContainer}>
              <Text style={styles.noAccessText}>You do not have access to this course.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Demos;

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
  content: {
    flex: 1,
    gap: 10,
    marginBottom: wp(15),
    alignItems: "center",
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
  noAccessContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noAccessText: {
    fontSize: hp(2),
    color: "red",
  },
});
