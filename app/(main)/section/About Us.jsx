
  
  import { Alert, Linking, ScrollView, Image, StyleSheet, Text, Pressable, View } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import ScreenWrapper from '../../../components/ScreenWrapper.jsx';
  import { supabase } from '../../../lib/supabase.js';
  import { useAuth } from '../../../context/AuthContext.js';
  import { hp, wp } from '../../../helper/common.js';
  import Feather from '@expo/vector-icons/Feather';
  import { theme } from '../../../constants/theme.js';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { StatusBar } from 'expo-status-bar';
  import { useRouter } from 'expo-router';
  import { getCourseData } from '../../../services/courseService.js';
  import Footer from '../../../components/Footer.jsx';
  import Loading from '../../../components/Loading.jsx';
  import { ipgatesInfo, contactInfo } from '../../../constants/data.js';
import WebView from 'react-native-webview';
import MapView,{Marker, PROVIDER_GOOGLE} from 'react-native-maps';
  import * as Location from 'expo-location';
  import Fontisto from '@expo/vector-icons/Fontisto';
  import BackButton from '../../../components/BackButton.jsx';
  const InfoCard = ({ title, description, points }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {points && (
        <View>
          {points.map((item, index) => (
            <Text key={index} style={styles.point}>• {item}</Text>
          ))}
        </View>
      )}
    </View>
  );
  
  const ContactInfo = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Contact Information</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{contactInfo.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{contactInfo.address}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Phone:</Text>
        <View style={styles.valueColumn}>
          {contactInfo.phone.map((number, index) => (
            <Text key={index} style={[styles.value, { width: wp(47) }]}>{number}</Text>
          ))}
        </View>
      </View>
      <Text style={styles.title}>Working Hours</Text>
      {contactInfo.hours.map((item, index) => (
        <View key={index} style={styles.infoRow}>
          <Text style={styles.label}>{item.day}:</Text>
          <Text style={styles.value}>{item.time}</Text>
        </View>
      ))}
  
    </View>
  );
  
  
  const AboutUs = () => {
    const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // useEffect(() => {
  //   const getLocation = async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }
  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   };
  //   getLocation();
  // }, []);

  // Function to handle logout
  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: async () => await supabase.auth.signOut(), style: 'destructive' }
    ]);
  };

  // Fetch course data
  const fetchCourseData = async () => {
    if (!user?.id) return; // Ensuring user exists before fetching
    try {
      const res = await getCourseData(user.id);
      setCourse(res.data || []);
    } catch (err) {
      console.error("Error fetching course data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [user?.id]); // Only runs when user.id changes

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  const handleMapPress = () => {
    const lat = 15.27980447678085; // Example latitude
    const long = 73.9600832351579; // Example longitude
    const url = `https://www.google.com/maps?q=${lat},${long}`; // Link to Google Maps
    
    Linking.openURL(url).catch((err) => console.error('Error opening map', err));
  };
  
    return (
          <ScreenWrapper bg="#b7e4c7">
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <BackButton/>
          <View style={styles.iconGroup}>
            <Pressable>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Feather name="log-out" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        {/* About Us Section */}
        <View>
          <Text style={styles.sectionTitle}>About Us</Text>
        </View>

        {/* Info Cards */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {ipgatesInfo.map((info, index) => (
            <InfoCard key={index} title={info.title} description={info.description} points={info.points} />
          ))}
          <ContactInfo />
          
        <View style={{ borderRadius: theme.radius.md,backgroundColor: theme.colors.primary,  paddingVertical: hp(2),height: hp(50), width: wp(95), alignItems: 'center'}}>
         <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: wp(10), justifyContent: 'center'}}>
         <Image style={{height: hp(20), width: wp(40), borderRadius: theme.radius.md}} source={{uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738693412/ipgates/IMG-20250203-WA0004_vundnh.jpg'}}/>
          <Image style={{height: hp(20), width: wp(40), borderRadius: theme.radius.md}} source={{uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738693410/ipgates/IMG-20250203-WA0001_pizxvi.jpg'}}/>
          <Image style={{height: hp(20), width: wp(40), borderRadius: theme.radius.md}} source={{uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738693407/ipgates/IMG-20250203-WA0003_fjijcw.jpg'}}/>
          <Image style={{height: hp(20), width: wp(40), borderRadius: theme.radius.md}} source={{uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738693403/ipgates/IMG-20250203-WA0002_tw3jsm.jpg'}}/>
         </View>
         
        </View>
        <View style={styles.mapContainer}>
  <Pressable onPress={handleMapPress}>
    <Image style={styles.Image} source={{ uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738753121/Screenshot_2025-02-05_162518_gsk2ow.png' }} />
  </Pressable>
</View>
        </ScrollView>

        {/* Map Section */}

      </View>
      </ScreenWrapper>
    );
  };
  
  export default AboutUs;
  
  // const styles = StyleSheet.create({
  //   webview: {
  //       flex: 1,
  //     },
  //   container: {
  //     flex: 1,
  //   //   backgroundColor: "#b7e4c7",
  //   },
  //   heading: {
  //     color: theme.colors.textDark,
  //     fontSize: hp(6),
  //     width: wp(80),
  //     marginVertical: hp(3),
  //     textAlign: "left",
  //     marginLeft: wp(4),
  //   },
  //   header: {
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     marginHorizontal: wp(3),
  //     marginTop: hp(2),
  //   },
  //   icon: {
  //     flexDirection: "row",
  //     gap: 10,
  //     justifyContent: "space-between",
  //   },
  //   note: {
  //     marginVertical: 5,
  //     padding: 10,
  //     backgroundColor: "white",
  //     borderRadius: 5,
  //   },
  //   noteText: {
  //     color: "black",
  //   },
  // });
  const styles = StyleSheet.create({
    Image:{
      height: hp(25),
      width: wp(96)
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
    buttonText: {
      color: "#fff",
      fontSize: hp(2),
      fontWeight: "bold",
    },
    container: {
      flex: 1,
      paddingHorizontal: wp(3),
    },
    scrollContainer: {
      paddingBottom: 20, // Ensures space at the bottom
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
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.colors.textDark,
    },
    description: {
      fontSize: 14,
      color: theme.colors.darkLight,
    },
    point: {
      fontSize: 14,
      color: theme.colors.darkLight,
      marginVertical: 2,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.textDark,
      width: '40%',
    },
    value: {
      fontSize: 16,
      color: theme.colors.darkLight,
      width: '55%',
    },
    valueColumn: {
      flexDirection: 'column',
    },
    mapContainer: {
      height: 250,
      marginTop: 20,
    },
    map: {
  
      width: '100%',
      height: '100%',
    },
  });
  