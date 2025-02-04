import { Alert, FlatList, StyleSheet, Text, Pressable, View, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js';
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../constants/theme.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { getCourseData } from '../../services/courseService.js';
import Footer from '../../components/Footer.jsx';
import Loading from '../../components/Loading.jsx';

const MyCourse = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to handle logout
  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: async () => await supabase.auth.signOut(), style: 'destructive' }
    ]);
  };

  // Fetch course data
  const fetchCourseData = async () => {
    setRefreshing(true);
    try {
      const res = await getCourseData(user?.id);
      setCourse(res.data || []);
    } catch (err) {
      console.error("Error fetching course data:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [user?.id]);

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headingText}>Hi, {user && user?.name}</Text>
          <View style={styles.iconGroup}>
            <Pressable>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Feather name="log-out" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        {/* My Course Section */}
        <Text style={styles.sectionTitle}>My Courses</Text>

        {/* Loading State */}
        {loading ? (
          <Loading />
        ) : course.length === 0 ? (
          <Text style={styles.noCourseText}>No courses found.</Text>
        ) : (
          <FlatList
            data={course}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchCourseData} />
            }
            renderItem={({ item }) => (
              <View style={styles.courseCard}>
                <Text style={styles.courseName}>{item.c_name}</Text>
                <Text style={styles.courseStatus}>
                  Status: {item.request}
                </Text>
                {item.request === 'Completed' && (
  <TouchableOpacity style={styles.feedbackButton} onPress={()=>{
    router.push(`/feedback?course=${item.c_name}`)
  }}>
    <Text style={styles.feedbackText}>Give Feedback</Text>
  </TouchableOpacity>
)}
              </View>
            )}
            contentContainerStyle={styles.courseContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Footer />
    </ScreenWrapper>
  );
};

export default MyCourse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(3),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
  },
  headingText: {
    fontSize: hp(3),
    color: 'black',
    fontWeight: 'bold',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginVertical: hp(2),
  },
  noCourseText: {
    fontSize: hp(2),
    color: theme.colors.textDark,
    textAlign: 'center',
    marginTop: hp(3),
  },
  courseContainer: {
    paddingBottom: hp(10),
  },
  courseCard: {
    backgroundColor: '#40916c',
    padding: hp(2),
    borderRadius: theme.radius.md,
    marginVertical: hp(1),
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  courseName: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: 'white',
  },
  courseStatus: {
    fontSize: hp(1.8),
    color: 'white',
    marginTop: 5,
  },feedbackButton: {
    marginTop: hp(1.5),
    backgroundColor: theme.colors.dark, // Light orange for contrast
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(5),
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start', // Prevent stretching in flex views
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow effect
  },
  
  feedbackText: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: 'white',
  },
});
