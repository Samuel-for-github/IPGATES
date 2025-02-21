import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper.jsx';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../../../components/BackButton.jsx';
import { theme } from '../../../constants/theme.js';
import { hp, wp } from '../../../helper/common.js';
import Button from '../../../components/Button.jsx';
import { supabase } from '../../../lib/supabase.js';
import { useRouter } from 'expo-router';
import FooterContext from '../../../context/FooterContext.js';
import Loading from '../../../components/Loading.jsx';
import { useAuth } from '../../../context/AuthContext.js';
import FormInput from '../../../components/FormInput.jsx';

const Form = () => {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { isActive, setIsActive } = useContext(FooterContext);

  const [formData, setFormData] = useState({
    s_name: params.name || '',
    email: params.email || '',
    phone: '',
    age: '',
    background: '',
    address: '',
    course: params.course || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    if (key === 'phone') {
      value = value.replace(/\D/g, ''); // Remove non-numeric characters
      if (value.length > 10) return; // Limit to 10 digits
  
      setErrors(prevErrors => ({
        ...prevErrors,
        phone: value.length === 10 ? '' : 'Phone number must be exactly 10 digits',
      }));
    }
  
    if (key === 'age') {
      value = value.replace(/\D/g, ''); // Remove non-numeric characters
      if (value > 100) return; // Optional: Prevent unrealistic ages
  
      setErrors(prevErrors => ({
        ...prevErrors,
        age: value && parseInt(value, 10) >= 15 ? '' : 'Age must be 15 or older',
      }));
    }
  
    setFormData(prevState => ({ ...prevState, [key]: value }));
  };
  
  
  const validateForm = () => {
    let newErrors = {};

    // Required field validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key]?.trim()) {
        newErrors[key] = 'This field is required';
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone number validation (10-digit number)
    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Age validation
    const age = parseInt(formData.age, 10);
    if (formData.age && (isNaN(age) || age < 15)) {
      newErrors.age = 'Age must be 15 or older';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const enrolling = async (courseName, description, s_name, studentId, fees) => {
    setLoading(true);
    const { data, error } = await supabase.from('course').insert({
      c_name: courseName,
      student_id: studentId,
      fees: fees,
      s_name,
    });

    setLoading(false);

    if (error) {
      console.log(error.message);
      return { success: false, message: error.message };
    } else {
      setIsActive('course');
      router.push(`/myCourse?price=${params.fees}`);
    }
  };

  const submit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await enrolling(
      formData.course,
      params.des,
      formData.s_name,
      params.sId,
      params.fees
    );
    setLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.message || 'Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    // console.log("p",params);
  }, [params]);

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton size={35} />
        <Text style={styles.heading}>Registration Form</Text>
        <ScrollView contentContainerStyle={styles.content}>
          <FormInput
            label="Student Name"
            value={formData.s_name}
            onChangeText={text => handleChange('s_name', text)}
            error={errors.s_name}
          />
          <FormInput
            label="Email"
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
            error={errors.email}
          />
          <FormInput
  label="Phone Number"
  value={formData.phone}
  onChangeText={text => handleChange('phone', text)}
  keyboardType="phone-pad"
  error={errors.phone} // Shows error dynamically
/>
<FormInput
  label="Age"
  value={formData.age}
  onChangeText={text => handleChange('age', text)}
  keyboardType="numeric"
  error={errors.age} // Shows error dynamically
/>
          <FormInput
            label="IT Background"
            value={formData.background}
            onChangeText={text => handleChange('background', text)}
            error={errors.background}
          />
          <FormInput
            label="Address"
            value={formData.address}
            onChangeText={text => handleChange('address', text)}
            error={errors.address}
          />

          <FormInput label="Fees" value={params.fees} readOnly />

          <ScrollView horizontal>
            <FormInput label="Course" value={formData.course} readOnly />
          </ScrollView>

          {loading ? <Loading /> : <Button buttonStyle={styles.button} onPress={submit} title="Submit" />}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    color: theme.colors.textDark,
    fontSize: hp(2),
    textAlign: 'center',
    fontWeight: theme.fonts.bold,
    marginVertical: hp(2),
  },
  content: {
    paddingBottom: wp(15),
    paddingHorizontal: wp(5),
  },
  button: {
    marginTop: hp(5),
    width: wp(90),
  },
});

export default Form;
