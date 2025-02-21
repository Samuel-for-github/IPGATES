import { Alert, Pressable, TouchableOpacity, ScrollView, StyleSheet, Text, View, Linking } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js';
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../constants/theme.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Fontisto } from '@expo/vector-icons';
import Footer from '../../components/Footer.jsx';
import { faq } from '../../constants/data.js';

const Chat = () => {
  const WhatsAppButton = ({ phoneNumber }) => {
    const openWhatsApp = () => {
      const url = `whatsapp://send?phone=${phoneNumber}`;
      Linking.openURL(url).catch(() => {
        alert("Make sure WhatsApp is installed on your device.");
      });
    };

    return (
      <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
        <Fontisto name="whatsapp" size={24} color="white" />
        <Text style={styles.buttonText}>Message us on Whatsapp</Text>
      </TouchableOpacity>
    );
  };

  const { user } = useAuth();
  const [expandedFAQ, setExpandedFAQ] = useState(null); // Track expanded FAQ item

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index); // Toggle FAQ visibility
  };

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
  }

  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      { text: 'Cancel', onPress: () => console.log("logout cancel"), style: 'cancel' },
      { text: 'Logout', onPress: () => signOut(), style: 'destructive' },
    ]);
  };

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headingText}>Hi, {user && user?.name}</Text>
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            {faq.map((val, i) => (
              <View key={i} style={styles.faqItem}>
                <TouchableOpacity onPress={() => toggleFAQ(i)} style={styles.faqHeader}>
                  <Text style={styles.faqTitle}>{val.title}</Text>
                  <Ionicons name={expandedFAQ === i ? "remove" : "add"} size={24} color="black" />
                </TouchableOpacity>
                {expandedFAQ === i && (
                  <Text style={styles.faqDescription}>{val.des}</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={[styles.title, { fontSize: hp(3) }]}>Are you ready to get started?</Text>
            <Text style={{ fontSize: hp(2) }}>If you have questions about the opportunities available in our programs, feel free to send us a message. We will get back to you as soon as possible.</Text>

            <WhatsAppButton phoneNumber={+919960166606} />
          </View>
        </ScrollView>
      </View>

      <Footer />
    </ScreenWrapper>
  );
};

export default Chat;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: "#25D366",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 20,
    gap: wp(3),
  },
  card: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
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
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(85)
  },
  faqTitle: {
    fontSize: hp(2),
    width: wp(70),
    color: theme.colors.textDark,
    marginBottom: hp(1),
  },
  faqDescription: {
    fontSize: hp(1.5),
    color: theme.colors.textMedium,
    marginTop: hp(1),
  },
});
