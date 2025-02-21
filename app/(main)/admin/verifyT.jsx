import { RefreshControl, Image, FlatList, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper.jsx';
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js';
import BackButton from '../../../components/BackButton.jsx';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Button from '../../../components/Button.jsx';
import Loading from '../../../components/Loading.jsx';
import { getTeacherData } from '../../../services/userService.js'; // Make sure to create this function for fetching teacher data

const VerifyTeacher = () => {
  const { user } = useAuth();
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeacherData = async () => {
    setRefreshing(true);
    try {
      const res = await getTeacherData();
      console.log(res);
        
      // Fetch teacher data along with image URL
      const teacherData = await Promise.all(res.data.map(async (val) => {
    //     // Get image URL from Supabase Storage for teacher credentials
    //      // File path
        return {
          ...val,
        };
      }));
// console.log(teacherData);

      setPendingTeachers(teacherData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const handleAccept = async (index, teacherId) => {
    console.log(teacherId);
    
    try {
      // Step 1: Update the role in the user table
      const { data, error } = await supabase
        .from('users') // Replace 'users' with your table name if different
        .update({ role: 'Accepted-Teacher' }) // Set the role to "Accepted-Teacher"
        .eq('id', teacherId); // Ensure we are updating the correct teacher based on their unique ID
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Step 2: Remove the teacher from the pending list
      const updatedPendingTeachers = pendingTeachers.filter((_, i) => i !== index);
      setPendingTeachers(updatedPendingTeachers);
  
      // Optionally, show a success message or handle other UI updates
      Alert.alert('Success', 'Teacher has been accepted and role updated.');
  
    } catch (error) {
      console.error('Error accepting teacher:', error);
      Alert.alert('Error', 'There was an issue accepting the teacher.');
    }
  };

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style='dark' />
      <BackButton size={35} />
      <View style={styles.container}>
        <Text style={styles.header}>Verify Teachers</Text>

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={pendingTeachers}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchTeacherData} />
            }
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <Text style={styles.teacherName}>Teacher Name: {item.name}</Text>
                <Button buttonStyle={styles.button} title='Accept' onPress={() => handleAccept(index, item.id)} />
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.noTeachers}>No pending teachers for verification.</Text>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default VerifyTeacher;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
  },
  header: {
    fontSize: hp(4),
    fontWeight: 'bold',
    marginVertical: hp(2),
  },
  noTeachers: {
    fontSize: hp(2.5),
    color: 'gray',
    textAlign: 'center',
    marginTop: hp(5),
  },
  listContainer: {
    width: '100%',
    paddingBottom: hp(10),
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: hp(2),
    borderColor: '#ddd',
    borderWidth: 1,
    gap: hp(2),
    borderRadius: 10,
    marginVertical: hp(1),
  },
  teacherName: {
    fontSize: hp(2.2),
    color: '#333',
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: hp(2.2),
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: 5,
  },
  image: {
    width: wp(40),
    height: hp(20),
    marginVertical: hp(2),
    borderRadius: 10,
  },
});
