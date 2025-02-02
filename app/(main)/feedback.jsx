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
  const [loading, setLoading] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);

  // Fetch existing feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('student_id', user?.id)
        .eq('course_name', course)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        Alert.alert('Error', error.message);
      }
      if (data) {
        setExistingFeedback(data);
        setRating(data.rating);
        setFeedback(data.content);
      }
    };
    
    fetchFeedback();
  }, [user?.id, course]);

  // Function to handle submitting feedback
  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter feedback before submitting.');
      return;
    }

    setLoading(true);
    let response;

    if (existingFeedback) {
      // Update existing feedback
      response = await supabase
        .from('feedback')
        .update({ rating, content: feedback })
        .eq('id', existingFeedback.id);
    } else {
      // Insert new feedback
      response = await supabase.from('feedback').insert([
        { student_id: user?.id, course_name: course, rating, content: feedback },
      ]);
    }

    setLoading(false);

    if (response.error) {
      Alert.alert('Error', response.error.message);
    } else {
      Alert.alert('Success', existingFeedback ? 'Feedback updated successfully!' : 'Feedback submitted successfully!');
      router.back(); // Navigate back after submission
    }
  };

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headingText}>Hi, {user && user?.s_name}</Text>
          <View style={styles.iconGroup}>
            <Pressable>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.heading}>{existingFeedback ? 'Your Feedback' : 'Give Feedback'}</Text>

        {/* Feedback Form */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Rating */}
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

          {/* Feedback Input */}
          <Text style={styles.label}>Your Feedback:</Text>
          <TextInput
            style={styles.input}
            placeholder="Write your feedback here..."
            placeholderTextColor="gray"
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitFeedback}
            disabled={loading}
          >
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
  container: {
    flex: 1,
    padding: wp(4),
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
  iconGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  heading: {
    fontSize: hp(4),
    color: 'black',
    marginBottom: hp(2),
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingBottom: hp(3),
  },
  label: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: hp(1),
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: hp(2),
  },
  input: {
    backgroundColor: 'white',
    padding: hp(1.5),
    borderRadius: 8,
    fontSize: hp(2),
    minHeight: hp(15),
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'gray',
  },
  submitButton: {
    backgroundColor: '#40916c',
    padding: hp(1.8),
    borderRadius: 8,
    alignItems: 'center',
    marginTop: hp(2),
  },
  submitText: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: 'white',
  },
});