import { Alert, RefreshControl, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import ScreenWrapper from '../../../components/ScreenWrapper.jsx'
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js'
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../../constants/theme.js'
import BackButton from '../../../components/BackButton.jsx'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Input from '../../../components/Input.jsx'
import Button from '../../../components/Button.jsx'
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import Loading from '../../../components/Loading.jsx';
import { courses } from '../../../constants/data.js';

const demo = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [dynamicCourses, setDynamicCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Static courses from constants/data.js
  const staticCourses = courses; 

  // Fetch dynamic courses from Supabase
  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('new_courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDynamicCourses(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // console.log(dynamicCourses);
    
    fetchCourses();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCourses();
  }, []);

  // Combine static and dynamic courses, removing duplicates
  const allCourses = staticCourses;


  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style='dark' />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton size={35} />
          <View style={styles.icon}>
            <Pressable onPress={() => router.back()}>
              <Feather name="log-out" size={24} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.heading}>Demo Videos</Text>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={styles.content}>
            {allCourses.map((course, i) => (
              <TouchableOpacity 
                key={course.id || i} // Use ID for dynamic, index for static
                style={styles.cards}
                onPress={() => {
                  const courseTitle = course.title || course.heading || course.c_name;
                  router.push(`admin/demo/demos?course=${encodeURIComponent(courseTitle)}`)
                }}
              >
                <Text style={styles.cardsText}>{course.title || course.heading|| course.c_name}</Text>
                {/* {course.subheading && (
                  <Text style={styles.courseSubheading}>{course.subheading}</Text>
                )} */}
                {/* Show badge for dynamic courses */}
                {course.id && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>New</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};


export default demo;

const styles = StyleSheet.create({cards: {
    flex: 1,
    marginVertical: hp(3),
    paddingVertical: hp(5),
    borderRadius: theme.radius.xl,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: '#40916c',
    width: wp(81),
    borderCurve: 'continuous',
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardsText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  container: {
    flex: 1,
  },
  heading: {
    color: theme.colors.textDark,
    fontSize: hp(3),
    marginVertical: hp(3),
    textAlign: 'left',
    marginLeft: wp(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(3),
    marginTop: hp(2),
  },
  icon: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  feedbackCard: {
    backgroundColor: '#40916c',
    padding: wp(4),
    marginVertical: hp(1),
    borderRadius: theme.radius.md,
    width: wp(90),
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  courseName: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: 'white',
  },
  rating: {
    fontSize: hp(2),
    color: 'white',
    marginTop: hp(0.5),
  },
  feedbackText: {
    fontSize: hp(2),
    color: 'white',
    marginTop: hp(1),
  },
  user: {
    fontSize: hp(1.8),
    color: '#ddd',
    marginTop: hp(1),
    textAlign: 'right',
  },
  noFeedback: {
    fontSize: hp(2),
    color: 'white',
    textAlign: 'center',
    marginTop: hp(5),
  },courseSubheading: {
    fontSize: hp(2),
    color: theme.colors.textDark,
    marginTop: hp(1),
    textAlign: 'center'
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  newBadgeText: {
    color: 'white',
    fontSize: hp(1.8),
    fontWeight: 'bold'
  }
});