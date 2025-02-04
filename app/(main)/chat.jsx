import { Alert, Pressable, TextInput, TouchableOpacity, ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js';
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../constants/theme.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Fontisto } from '@expo/vector-icons';
import Footer from '../../components/Footer.jsx';
import { computerTrainingCourses } from '../../constants/data.js';


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
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

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

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: input, type: 'user' }];
    
    // Find answer
    const matchedFAQ = computerTrainingCourses.find(item => 
      item.question.toLowerCase().includes(input.toLowerCase())
    );

    // Add bot response
    setTimeout(() => {
      const botResponse = matchedFAQ
        ? matchedFAQ.answer
        : (
          <View>
          <Text>
              I'm sorry, I don’t have an answer for that. Please call us for more details!
          </Text>
          <WhatsAppButton phoneNumber={+919960166606}/>
          </View>
          );
      setMessages([...newMessages, { text: botResponse, type: 'bot' }]);
    }, 1000);

    setMessages(newMessages);
    setInput('');
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

        <Text style={styles.heading}>Chat Support</Text>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollViewContent}
        >
          {messages.map((msg, index) => (
            <View key={index} style={msg.type === 'user' ? styles.userBubble : styles.botBubble}>
              <Text style={msg.type === 'user' ? styles.userText : styles.botText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Field */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Ask a question..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: "#25D366",
    padding: wp(4),
    borderRadius: theme.radius.md,
    maxWidth: '75%',
    marginBottom: hp(1),
  },
  userText: {
    fontSize: hp(2.5),
    color: 'white',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.darkLight,
    padding: wp(4),
    borderRadius: theme.radius.md,
    maxWidth: '75%',
    marginBottom: hp(1),
  },
  botText: {
    fontSize: hp(2.5),
    color: theme.colors.textDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: theme.radius.md,
    padding: wp(2),
    marginBottom: hp(1),
  },
  input: {
    flex: 1,
    fontSize: hp(2),
    padding: wp(2),
  },
  sendButton: {
    backgroundColor: "#25D366",
    padding: wp(3),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: "#25D366",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 20,
    gap: wp(3)
  },
});




/*
import { Alert, Pressable, TouchableOpacity,ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { Fontisto } from '@expo/vector-icons';
import Footer from '../../components/Footer.jsx';

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
                <Text style={styles.faqTitle}>{val.title}</Text>
                <Text style={styles.faqDescription}>{val.des}</Text>
              </View>
            ))}
          </View>
          <View style={styles.card}>
            <Text style={[styles.title, {fontSize: hp(3)}]}>Are you ready to get started?</Text>
            <Text style={{fontSize: hp(2)}}>If you have questions about the opportunities available in our programs, feel free to send us a message. We will get back to you as soon as possible.</Text>
          
          <WhatsAppButton phoneNumber={+919960166606}/>
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
    gap: wp(3)
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

*/
