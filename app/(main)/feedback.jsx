import { Alert, Pressable, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Footer from '../../components/Footer.jsx';

const Feedback = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { course } = useLocalSearchParams();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [improvements, setImprovements] = useState('');
  const [teachingSpeed, setTeachingSpeed] = useState('');
  const [materialsFeedback, setMaterialsFeedback] = useState('');
  const [confidence, setConfidence] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);

  useEffect(() => {
    if (!user?.id || !course) return;

    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('student_id', user.id)
        .eq('course_name', course)
        .maybeSingle();

      if (error) {
        console.error('Fetch Feedback Error:', error);
        Alert.alert('Error', 'Failed to load feedback.');
      } else if (data) {
        setExistingFeedback(data);
        setRating(data.rating || 0);
        setFeedback(data.content || '');
        setImprovements(data.improvements || '');
        setTeachingSpeed(data.teaching_speed || '');
        setMaterialsFeedback(data.materials_feedback || '');
        setConfidence(data.confidence || '');
      }
    };

    fetchFeedback();
  }, [user?.id, course]);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter feedback before submitting.');
      return;
    }
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating.');
      return;
    }
    if (!teachingSpeed.trim()) {
      Alert.alert('Error', 'Please specify the teaching speed.');
      return;
    }
    if (!materialsFeedback.trim()) {
      Alert.alert('Error', 'Please provide feedback on materials.');
      return;
    }
    if (!confidence.trim()) {
      Alert.alert('Error', 'Please answer whether the course made you confident.');
      return;
    }

    setLoading(true);
    
    const feedbackData = {
      student_id: user.id,
      course_name: course,
      rating,
      content: feedback,
      improvements,
      teaching_speed: teachingSpeed,
      materials_feedback: materialsFeedback,
      confidence,
    };

    let response;
    if (existingFeedback) {
      response = await supabase
        .from('feedback')
        .update(feedbackData)
        .eq('id', existingFeedback.id);
    } else {
      response = await supabase.from('feedback').insert([feedbackData]);
    }

    setLoading(false);

    if (response.error) {
      Alert.alert('Error', response.error.message);
    } else {
      Alert.alert('Success', existingFeedback ? 'Feedback updated successfully!' : 'Feedback submitted successfully!');
      router.back();
    }
  };

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.heading}>{existingFeedback ? 'Your Feedback' : 'Give Feedback'}</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>

          <Text style={styles.label}>Rate the Course:</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={star <= rating ? '#f4a261' : 'gray'}
                />
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Feedback:</Text>
          <TextInput
            style={styles.input}
            value={feedback}
            onChangeText={(text) => {
              console.log("Feedback Updated:", text);
              setFeedback(text);
            }}
            multiline
          />

          <Text style={styles.label}>What enhancements or additions would you recommend for the course?</Text>
          <TextInput style={styles.input} value={improvements} onChangeText={setImprovements} multiline />

          <Text style={styles.label}>Was the pace of instruction appropriate, or did it feel too fast or too slow?</Text>
          <TextInput style={styles.input} value={teachingSpeed} onChangeText={setTeachingSpeed} multiline />

          <Text style={styles.label}>Did the course materials effectively support your learning experience?</Text>
          <TextInput style={styles.input} value={materialsFeedback} onChangeText={setMaterialsFeedback} multiline />

          <Text style={styles.label}>Did this course enhance your confidence in utilizing IT tools and technologies?</Text>
          <TextInput style={styles.input} value={confidence} onChangeText={setConfidence} multiline />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback} disabled={loading}>
            <Text style={styles.submitText}>{loading ? 'Submitting...' : existingFeedback ? 'Update Feedback' : 'Submit Feedback'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Footer />
    </ScreenWrapper>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: { flex: 1, padding: wp(4) },
  heading: { fontSize: hp(4), fontWeight: 'bold', marginBottom: hp(2) },
  scrollViewContent: { paddingBottom: hp(3) },
  label: { fontSize: hp(2.5), fontWeight: 'bold', marginBottom: hp(1) },
  ratingContainer: { flexDirection: 'row', marginBottom: hp(2) },
  input: { backgroundColor: 'white', padding: hp(1.5), borderRadius: 8, minHeight: hp(8), borderWidth: 1, borderColor: 'gray' },
  submitButton: { backgroundColor: '#40916c', padding: hp(1.8), borderRadius: 8, alignItems: 'center', marginTop: hp(2) },
  submitText: { fontSize: hp(2.2), fontWeight: 'bold', color: 'white' },
});
