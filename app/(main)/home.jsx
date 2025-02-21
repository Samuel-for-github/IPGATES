import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js';
import { theme } from '../../constants/theme.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Footer from '../../components/Footer.jsx';
import { features } from '../../constants/data.js';

const home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      console.log(user);
      
      setRole(user.role); // Ensure role is fetched from user data
    }
  }, [user]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
  }

  const handleLogout = () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      { text: 'Cancel', onPress: () => console.log("Logout canceled"), style: 'cancel' },
      { text: 'Logout', onPress: () => signOut(), style: 'destructive' }
    ]);
  };

  return (
    <ScreenWrapper bg="#b7e4c7">
    <StatusBar style="dark" />
    {role === "Admin" ? (
      <AdminView handleLogout={handleLogout} />
    ) : role === "Teacher" || role === "Accepted-Teacher" ? (
      <TeacherView handleLogout={handleLogout} />
    ) : (
      <StudentView handleLogout={handleLogout} />
    )}
  </ScreenWrapper>
  );
};

const AdminView = ({handleLogout}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      console.log(user);
      
      setRole(user.role); // Ensure role is fetched from user data
    }
  }, [user]);

 
  

  return(
  <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.top}>
          <View style={styles.header}>
            <Text style={styles.headingText}>Hi, {user?.name}</Text>
            <View style={styles.icon}>
              <Pressable>
                <Ionicons name="notifications-outline" size={24} color="black" />
              </Pressable>
              <Pressable>
                <Ionicons onPress={handleLogout} name="log-out-outline" size={24} color="black" />
              </Pressable>
            </View>
          </View>
          <Image 
            source={{ uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738423695/WhatsApp_Image_2025-01-06_at_20.04.06_d94bb8d8-removebg-preview_sx06fp.png' }} 
            style={styles.welcomeImage} 
            resizeMode="contain" 
          />
        </View>
        <View style={style2.content}>
            {/* Render course navigation only if the user is not a teacher */}
        
              <TouchableOpacity style={style2.navigate} onPress={() => router.push('admin/courseDecision')}>
                <Text style={style2.card}>Courses</Text>
              </TouchableOpacity>
           
           
              <TouchableOpacity style={style2.navigate} onPress={() => router.push('admin/job')}>
                <Text style={styles.card}>Send Job Notification</Text>
              </TouchableOpacity>
     
            {/* Render verify navigation only if the user is not a teacher */}
        
              <TouchableOpacity style={style2.navigate} onPress={() => router.push('admin/verify')}>
                <Text style={style2.card}>Verify Student for Courses</Text>
              </TouchableOpacity>
            
              <TouchableOpacity style={style2.navigate} onPress={() => router.push('admin/verifyT')}>
                <Text style={style2.card}>Verify Teacher for Courses</Text>
              </TouchableOpacity>
             
              <TouchableOpacity style={style2.navigate} onPress={() => router.push('admin/feedback')}>
                <Text style={style2.card}>Feedbacks</Text>
              </TouchableOpacity>
        
            {/* Render notes and attendance for both admin and teacher */}
            {/* <TouchableOpacity style={style2.navigate} onPress={() => router.push('admin/notes')}>
              <Text style={style2.card}>Notes</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={style2.navigate} onPress={() => router.push('admin/attendance')}>
              <Text style={style2.card}>Attendance</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={style2.navigate} onPress={() => router.push('admin/demo_videos')}>
              <Text style={style2.card}>Demo Videos</Text>
            </TouchableOpacity>
          </View>

        {/* <Footer /> */}
      </View>
    </View>
)};

const TeacherView = ({ handleLogout }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      setRole(user.role); // Ensure role is fetched from user data
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.top}>
          <View style={styles.header}>
            <Text style={styles.headingText}>Hi, {user?.name}</Text>
            <View style={styles.icon}>
              <Pressable>
                <Ionicons name="notifications-outline" size={24} color="black" />
              </Pressable>
              <Pressable>
                <Ionicons onPress={handleLogout} name="log-out-outline" size={24} color="black" />
              </Pressable>
            </View>
          </View>
          <Image 
            source={{ uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738423695/WhatsApp_Image_2025-01-06_at_20.04.06_d94bb8d8-removebg-preview_sx06fp.png' }} 
            style={styles.welcomeImage} 
            resizeMode="contain" 
          />
        </View>

        <View style={styles.content}>
          {/* If the role is 'Teacher' (not 'Accepted-Teacher'), show the additional components */}
          {role === 'Teacher' && (
            <>
              <Text>Your Account is not Verified</Text>
            </>
          )}

          {/* If the role is 'Accepted-Teacher', show only Notes and Attendance */}
          {role === 'Accepted-Teacher' && (
            <>
              <TouchableOpacity style={styles.cards} onPress={() => router.push('admin/notes')}>
                <Text style={styles.cardsText}>Notes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cards} onPress={() => router.push('admin/attendance')}>
                <Text style={styles.cardsText}>Attendance</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};


const StudentView = ({ handleLogout }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      setRole(user.role); // Ensure role is fetched from user data
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.top}>
          <View style={styles.header}>
            <Text style={styles.headingText}>Hi, {user?.name}</Text>
            <View style={styles.icon}>
              <Pressable>
                <Ionicons name="notifications-outline" size={24} color="black" />
              </Pressable>
              <Pressable>
                <Ionicons onPress={handleLogout} name="log-out-outline" size={24} color="black" />
              </Pressable>
            </View>
          </View>
          <Image 
            source={{ uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738423695/WhatsApp_Image_2025-01-06_at_20.04.06_d94bb8d8-removebg-preview_sx06fp.png' }} 
            style={styles.welcomeImage} 
            resizeMode="contain" 
          />
        </View>

        <View style={styles.content}>
          {features.map((value, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.cards} 
              onPress={() => {
                router.push(`/section/${value.title}`);
              }}
            >
              {!value.img ? (
                <FontAwesome5 name="users" size={100} color="black" />
              ) : (
                <Image style={{ height: 100, width: 100 }} source={value.img} />
              )}
              <Text style={styles.cardsText}>{value.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    color: 'white',
    fontSize: hp(3),
  },
  container: {
    flex: 1,
  },
  top: {
    marginHorizontal: wp(3),
    borderRadius: theme.radius.md,
    paddingBottom: hp(3),
    gap: hp(1),
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
  },
  headingText: {
    marginLeft: wp(0),
    fontSize: hp(3),
    color: 'black',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: wp(4),
    marginTop: hp(0),
  },
  cards: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(45),
    height: hp(22),
    paddingVertical: hp(2),
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardsText: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
    textAlign: 'center',
  },
  welcomeImage: {
    width: wp(100),
    height: hp(9),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  logoutContainer: {
    marginTop: hp(3),
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.sm,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
  },
  logoutText: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: theme.fonts.semibold,
  },
});

const style2 = StyleSheet.create({
  navigate: {
    alignItems: 'center',
    height: hp(15),
    justifyContent: 'center',
    paddingVertical: hp(2),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: wp(4),
    width: wp(45)
  },
  card: {
    color: 'white',
    fontSize: hp(3),
  },
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  top: {
    marginHorizontal: wp(3),
    borderRadius: theme.radius.md,
    gap: hp(10),
    paddingBottom: hp(3)
  },
  headingText: {
    fontSize: hp(3),
    color: 'black'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(3),
    marginTop: hp(2)
  },
  icon: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp(95),
    height: hp(100),
    gap: wp(4),
    marginLeft: wp(2),
    justifyContent: 'center',
  },
})

export default home;
