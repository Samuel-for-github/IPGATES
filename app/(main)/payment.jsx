import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../constants/theme.js';
import ScreenWrapper from '../../components/ScreenWrapper.jsx';
import { wp, hp } from '../../helper/common.js';
import BackButton from '../../components/BackButton.jsx';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase.js';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { getCourseData2 } from '../../services/courseService.js';
import { useAuth } from '../../context/AuthContext.js';

const PaymentScreen = () => {
  const { user } = useAuth();
  const { course, price } = useLocalSearchParams();
  const router = useRouter();

  const [newCoures, setNewCourses] = useState(course);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewCourses(course === "Hardware and Networking" ? "Hardware & Networking" : course);
  }, [course]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const res = await getCourseData2();
      for (const val of res.data) {
        console.log(val.c_id);
        
        const { error } = await supabase
          .from('course')
          .update({ request: 'paid' })
          .eq('c_id', val.c_id)
          .eq('c_name', newCoures)
          .eq('student_id', user?.id);

        if (error) throw new Error(`Failed to update course ID: ${val.c_id}`);

        const fileBase64 = await FileSystem.readAsStringAsync(paymentScreenshot, { encoding: 'base64' });
        const fileData = decode(fileBase64);

        const { error: uploadError } = await supabase.storage
          .from('screenshot')
          .upload(`public/${val.c_id}.jpeg`, fileData, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (uploadError) throw uploadError;
      }

      Alert.alert('Payment Successful', `You have successfully paid for ${newCoures}.`, [
        { text: 'OK', onPress: () => router.push('/myCourse') }
      ]);

    } catch (error) {
      Alert.alert('Upload Failed', error.message || 'There was an error uploading your payment screenshot.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need access to your gallery to upload a screenshot.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:  ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPaymentScreenshot(result.assets[0].uri);
    }
  };

  return (
    <ScreenWrapper bg="#b7e4c7">
      <BackButton />
      <View style={styles.container}>
        <Image
          style={{ width: wp(40), height: hp(20) }}
          source={{ uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738425595/WhatsApp_Image_2025-02-01_at_20.34.40_213de77e_1_1_r1x16m.png' }}
        />
        <Text style={styles.title}>Payment for {newCoures}</Text>
        <Text style={styles.amount}>Amount: ₹{price}</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={loading}>
          <Text style={styles.uploadText}>{loading ? 'Uploading...' : 'Upload Payment Screenshot'}</Text>
        </TouchableOpacity>
        {paymentScreenshot && <Image source={{ uri: paymentScreenshot }} style={styles.screenshot} />}
        {paymentScreenshot && (
          <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.payText}>Done Paying</Text>}
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    color: theme.colors.textDark,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  screenshot: {
    width: wp(50),
    height: hp(25),
    marginVertical: 10,
    borderRadius: 8,
  },
  payButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  payText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
