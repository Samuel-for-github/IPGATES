import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
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
import { Calendar } from "react-native-calendars";
import { getCourseData } from "../../../services/courseService.js";

const Demos = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState({
    markedDates: {},
    percentage: undefined,
    present: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { folder } = useLocalSearchParams();
  const [allow, setAllow] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [monthlyWarnings, setMonthlyWarnings] = useState([]);

  // Format month key (e.g., "2024-05" to "May 2024")
  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  // Check if the user has access to the course
  const checkAccess = async () => {
    try {
      setLoading(true);
      const res = await getCourseData(user?.id);
      res.data.forEach((val) => {
        if (folder === val.c_name && val.request === "Accepted") {
          setAllow(true);
          setIsAccepted(true);
        }
      });
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance data from Supabase and update the state
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select()
        .eq("course_name", folder)
        .eq("student_id", user?.id);

      if (error) throw error;

      const totalClassesPerMonth = 20;
      const markedDates = {};
      const monthlyAttendanceData = {};
      const warnings = [];

      data.forEach((attendance) => {
        const [year, month, day] = attendance.date.split("-");
        const date = new Date(Date.UTC(year, month - 1, day));
        const utcDay = date.getUTCDay();

        if (utcDay === 0 || utcDay === 6) return;

        const monthKey = `${year}-${month}`;
        if (!monthlyAttendanceData[monthKey]) {
          monthlyAttendanceData[monthKey] = { present: 0, total: 0 };
        }

        if (attendance.status === "present") {
          monthlyAttendanceData[monthKey].present++;
        }
        monthlyAttendanceData[monthKey].total++;

        markedDates[attendance.date] = {
          marked: true,
          dotColor: attendance.status === "present" ? "green" : "red",
          disableTouchEvent: true,
        };
      });

      const attendanceArray = [];
      Object.keys(monthlyAttendanceData)
        .sort()
        .forEach((monthKey) => {
          const { present, total } = monthlyAttendanceData[monthKey];
          const percentage = Math.round((present / totalClassesPerMonth) * 100);

          attendanceArray.push({ month: monthKey, percentage });

          if (percentage < 75) {
            warnings.push(`Your attendance is ${percentage}%.
            
Please note that attendance below 75% may lead to course withdrawal. Please improve your attendance.`);
          }
        });

      setMonthlyAttendance(attendanceArray);
      setMonthlyWarnings(warnings);

      const totalClasses = totalClassesPerMonth * 6;
      const presentCount = Object.values(monthlyAttendanceData).reduce(
        (sum, month) => sum + month.present,
        0
      );
      const attendancePercentage = Math.round((presentCount / totalClasses) * 100);

      setAttendanceData({
        markedDates,
        percentage: attendancePercentage,
        present: presentCount,
        total: totalClasses,
      });
    } catch (error) {
      console.error("Attendance error:", error);
      Alert.alert("Error", "Failed to fetch attendance data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkAccess();
    fetchAttendance();
  }, [folder]);

  return (
    <ScreenWrapper bg="#b7e4c7">
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <BackButton size={35} />
          <View style={styles.icon}>
            <Pressable accessibilityLabel="Notifications">
              <Ionicons name="notifications-outline" size={24} />
            </Pressable>
            <Pressable accessibilityLabel="Log out">
              <Feather name="log-out" size={24} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.heading}>{folder} Attendance</Text>

        {isAccepted && monthlyAttendance.length > 0 && (
          <View style={styles.attendanceBox}>
            <Text style={styles.attendanceHeader}>Monthly Attendance</Text>
            {monthlyAttendance
              .sort((a, b) => a.month.localeCompare(b.month))
              .map((data, index) => (
                <Text key={index} style={styles.attendanceText}>
                  {formatMonth(data.month)}: {data.percentage}%
                </Text>
              ))}
          </View>
        )}

        {isAccepted && monthlyWarnings.length > 0 && (
          <View style={styles.warningBox}>
            {monthlyWarnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>
                {warning}
              </Text>
            ))}
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAttendance} />}>
            {allow ? (
              <Calendar
                markedDates={attendanceData.markedDates}
                theme={{
                  calendarBackground: theme.colors.background,
                  dayTextColor: "black",
                  monthTextColor: "black",
                  arrowColor: "black",
                  selectedDayBackgroundColor: "blue",
                  selectedDayTextColor: "white",
                }}
                markingType={"simple"}
              />
            ) : (
              <View style={styles.noAccessContainer}>
                <Text style={styles.noAccessText}>You do not have access to this course.</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Demos;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#b7e4c7" },
  heading: { fontSize: hp(3), marginVertical: hp(3), marginLeft: wp(4), color: theme.colors.textDark },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: wp(3), marginTop: hp(2) },
  icon: { flexDirection: "row", gap: 10 },
  percentageContainer: { marginHorizontal: wp(5), marginBottom: hp(1) },
  percentageText: { fontSize: hp(2.5), fontWeight: "600", color: theme.colors.textDark },
  attendanceBox: { padding: hp(2), marginHorizontal: wp(5), marginVertical: wp(2), backgroundColor: "#e3f2fd", borderRadius: 8 },
  attendanceHeader: { fontWeight: "bold", fontSize: hp(2.2), marginBottom: hp(1) },
  attendanceText: { fontSize: hp(2) },
  warningBox: { backgroundColor: "#FFEBEE", padding: hp(2), marginHorizontal: wp(5), borderRadius: 8, borderLeftWidth: 4, borderLeftColor: "#FF5252" },
  warningText: { color: "#D32F2F", fontSize: hp(1.9) },
  noAccessContainer: { justifyContent: "center", alignItems: "center", marginTop: 20 },
  noAccessText: { fontSize: hp(2), color: "red" },
});