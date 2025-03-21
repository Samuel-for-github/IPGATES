import { RefreshControl, Image, FlatList, StyleSheet, Text, View } from 'react-native';
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
import { getCourseData3 } from '../../../services/courseService.js';
import { getStudentData } from '../../../services/studentService.js';

const Verify = () => {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourseData = async () => {
    setRefreshing(true); // Indicate pull-to-refresh
    try {
      const res = await getCourseData3();
      console.log(res);

      // Fetch course and student data along with image URL
      const courseData = await Promise.all(res.data.map(async (val) => {
        const studentData = await getStudentData(val.student_id);
        
        // Get image URL from Supabase Storage
        const { data, error } = await supabase
          .storage
          .from('screenshot') // Replace with your bucket name
          .getPublicUrl(`public/${val.c_id}.jpeg`); // File path
console.log(data.publicUrl);

        return {
          ...val,
          studentName: studentData ? studentData[0]?.name : 'Unknown',
          imageUrl: error ?  null:data.publicUrl, // Handle the error case
        };
      }));

      setPending(courseData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const handleAccept = async (index, cId) => {
    const updatedPending = pending.filter((_, i) => i !== index);
    setPending(updatedPending);

    const { data, error } = await supabase
      .from('course')
      .update({ request: 'Accepted' })
      .eq('c_id', cId);

    if (error) {
      console.error(error.message);
    } else {
      console.log(data);
    }
  };

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style='dark' />
      <BackButton size={35} />
      <View style={styles.container}>
        <Text style={styles.header}>Verify Courses</Text>

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={pending}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchCourseData} />
            }
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <Text style={styles.courseName}>Course Name: {item.c_name}</Text>
                <Text style={styles.courseName}>Student Name: {item.studentName}</Text>
                <Text style={styles.courseName}>Price: {item.fees}</Text>
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                  />
                )}
                <Button buttonStyle={styles.button} title='Accept' onPress={() => handleAccept(index, item.c_id)} />
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.noCourses}>No pending courses.</Text>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Verify;

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
  noCourses: {
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
  courseName: {
    fontSize: hp(2.2),
    color: '#333',
    fontWeight: 'bold',
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
