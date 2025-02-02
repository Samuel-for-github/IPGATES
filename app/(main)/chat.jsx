import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js';
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../constants/theme.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { faq } from '../../constants/data.js';
import Footer from '../../components/Footer.jsx';

const Chat = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();

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
        onPress: () => console.log("logout cancel"),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => signOut(),
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headingText}>Hi, {user && user?.s_name}</Text>
          <View style={styles.icon}>
            <Pressable>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Feather name="log-out" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.heading}>FAQ's</Text>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            {faq.map((val, i) => (
              <View key={i} style={styles.faqItem}>
                <Text style={styles.faqTitle}>{val.title}</Text>
                <Text style={styles.faqDescription}>{val.des}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

      </View>
        <Footer />
    </ScreenWrapper>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headingText: {
    fontSize: hp(3),
    color: 'black',
    fontWeight: 'bold',
  },
  icon: {
    flexDirection: 'row',
    gap: 10,
  },
  heading: {
    fontSize: hp(5),
    color: theme.colors.textDark,
    marginBottom: hp(2),
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingBottom: hp(3),
  },
  content: {
    marginVertical: hp(2),
  },
  faqItem: {
    marginBottom: hp(3),
    padding: wp(4),
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.radius.md,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  faqTitle: {
    fontSize: hp(3),
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: hp(1),
  },
  faqDescription: {
    fontSize: hp(2.5),
    color: theme.colors.textMedium,
  },
});
