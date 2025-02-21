import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper.jsx';
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import BackButton from '../../../components/BackButton.jsx';
import Footer from '../../../components/Footer.jsx';
import { hp, wp } from '../../../helper/common.js';
import { theme } from '../../../constants/theme.js';

const JobNotification = () => {
  const { user } = useAuth(); // Get the logged-in user
  const router = useRouter();
  const [notifications, setNotifications] = useState([]); // State to hold the job notifications
  const [loading, setLoading] = useState(true);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
  }

  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('logout cancel'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => signOut(),
        style: 'destructive',
      },
    ]);
  };

  // Fetch job notifications for the logged-in user
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('jobNotification')
        .select('*')
        .eq('student_id', user?.id); // Assuming `user.id` is the identifier for the user

      if (error) {
        throw error;
      }
      console.log(data);
      
      setNotifications(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
      fetchNotifications();
    console.log(user);
    
  }, [user]);

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton size={35} />
          <View style={styles.icon}>
            <Pressable>
              <Ionicons name="notifications-outline" size={24} />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Feather name="log-out" size={24} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.heading}>Job Notifications</Text>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : notifications.length === 0 ? (
          <Text style={styles.noNotificationsText}>No notifications available</Text>
        ) : (
          <ScrollView style={styles.notificationsContainer}>
            {notifications.map((notification, index) => (
              <View key={index} style={styles.notificationCard}>
                <Text style={styles.notificationTitle}>Job Title:- {notification.job_title}</Text>
                <Text style={styles.notificationCompany}>Job Company:- {notification.company}</Text>
                <Text style={styles.notificationDescription}>
                  Job description:- {notification.description}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <Footer />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  heading: {
    color: theme.colors.textDark,
    fontSize: hp(4.5),
    fontWeight: '600',
    marginVertical: hp(3),
    textAlign: 'left',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(4),
  },
  icon: {
    flexDirection: 'row',
    gap: wp(4),
  },
  notificationsContainer: {
    flex: 1,
    marginTop: hp(3),
  },
  notificationCard: {
    backgroundColor: theme.colors.white,
    paddingVertical: hp(3),
    paddingHorizontal: wp(4),
    borderRadius: theme.radius.md,
    marginBottom: hp(2),
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.borderLight, // Border color for a subtle border effect
  },
  notificationTitle: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
    marginBottom: hp(1),
  },
  notificationCompany: {
    fontSize: hp(2),
    color: theme.colors.textSecondary,
    marginBottom: hp(1),
  },
  notificationDescription: {
    fontSize: hp(2),
    color: theme.colors.textSecondary,
    lineHeight: hp(2.4),
  },
  loadingText: {
    fontSize: hp(2.5),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: hp(5),
  },
  noNotificationsText: {
    fontSize: hp(2.5),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: hp(5),
  },
});

export default JobNotification;
