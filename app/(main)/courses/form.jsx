import { ScrollView, StyleSheet, Image,Text, View, ActivityIndicator } from 'react-native'
import React, { useState,useEffect, useContext } from 'react'
import ScreenWrapper from '../../../components/ScreenWrapper.jsx'
import { router, useLocalSearchParams } from 'expo-router'
import Input from '../../../components/Input.jsx'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../../../components/BackButton.jsx'
import { theme } from '../../../constants/theme.js'
import { hp, wp } from '../../../helper/common.js'
import Button from '../../../components/Button.jsx'
import { supabase } from '../../../lib/supabase.js'
import { useRouter } from 'expo-router'
import FooterContext from '../../../context/FooterContext.js'
import Loading from '../../../components/Loading.jsx'
import {useAuth} from '../../../context/AuthContext.js'
const Form = () => {
  const params = useLocalSearchParams()
  const {user} = useAuth()
  const { isActive, setIsActive } = useContext(FooterContext);
  const [formData, setFormData] = useState({
    s_name: params.name || '',
    email: params.email || '',
    phone: params.phone || '',
    age: '',
    school: '',
    address: params.address || '',
    course: params.course || '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)  // New state for loading

  const handleChange = (key, value) => {
    setFormData(prevState => ({ ...prevState, [key]: value }))
    setErrors(prevErrors => ({ ...prevErrors, [key]: '' }))
  }

  const inputFields = [
    { label: 'Student Name', key: 's_name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone Number', key: 'phone', keyboardType: 'phone-pad' },
    { label: 'Age', key: 'age', keyboardType: 'numeric' },
    { label: 'IT Background', key: 'background' },
    { label: 'Address', key: 'address' },
  ]

  const validateForm = () => {
    let newErrors = {}
    inputFields.forEach(({ key }) => {
      if (!formData[key].trim()) {
        newErrors[key] = 'This field is required'
      }
    })

    if (!formData.course.trim()) {
      newErrors.course = 'Course selection is required'
    }

    const age = parseInt(formData.age, 10)
    if (formData.age && (isNaN(age) || age < 15)) {
      newErrors.age = 'Age must be 15 or older'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const enrolling = async (courseName, description, s_name, studentId, fees) => {
    setLoading(true)  // Start loading
    const { data, error } = await supabase.from('course').insert({ c_name: courseName, student_id: studentId, fees: fees, s_name })
    
    setLoading(false)  // Stop loading

    if (error) {
      console.log(error.message)
      return { success: false, message: error.message }
    } else {
      
      
      // const {} = await supabase.from('student').update()
      setIsActive('course')
      router.push('/myCourse')
    }
  }

  const submit = async () => {
    if (!validateForm()) return
    setLoading(true)  // Set loading to true during form submission
    console.log('Form submitted:', formData)
    enrolling(formData.course, params.des, formData.s_name, params.sId, params.fees)
    setLoading(false)  // Stop loading after submitting
  }

  useEffect(() => {
    console.log(params);
    
  }, [params])
  

  return (
    <ScreenWrapper bg="#b7e4c7">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton size={35} />
        <Text style={styles.heading}>Registration Form</Text>
        <ScrollView contentContainerStyle={styles.content}>
          {inputFields.map(({ label, key, keyboardType }) => (
            <View key={key} style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              <Input
                color="black"
                fontSize={hp(3)}
                value={formData[key]}
                onChangeText={text => handleChange(key, text)}
                containerStyles={styles.input}
                keyboardType={keyboardType}
              />
              {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
            </View>
          ))}

          <Text style={styles.label}>Fees</Text>
          <Input
            color="black"
            fontSize={hp(3)}
            value={params.fees}
            readOnly
            containerStyles={styles.input}
          />

          <Text style={styles.label}>Chosen Course</Text>
          <ScrollView horizontal>
            <Input
              color="black"
              fontSize={hp(3)}
              value={formData.course}
              readOnly
              containerStyles={styles.input}
            />
          </ScrollView>
          {errors.course && <Text style={styles.error}>{errors.course}</Text>}
          {loading ? (
            <Loading/>
          ) : (
            <View style={{alignItems: 'center', paddingVertical: wp(4)}}>
              {/* <Image style={{width: wp(40), height: hp(20)}} source={{uri: 'https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738425595/WhatsApp_Image_2025-02-01_at_20.34.40_213de77e_1_1_r1x16m.png'}}/> */}
               {/* https://res.cloudinary.com/dyhjjsb5g/image/upload/v1738425595/WhatsApp_Image_2025-02-01_at_20.34.40_213de77e_1_1_r1x16m.png  */}
              <Button buttonStyle={styles.button} onPress={submit} title="Submit" />
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    color: theme.colors.textDark,
    fontSize: hp(2),
    width: wp(80),
    marginVertical: hp(2),
    marginHorizontal: wp(4),
    textAlign: 'center',
    fontWeight: theme.fonts.bold,
  },
  content: {
    paddingBottom: wp(15),
    paddingHorizontal: wp(5),
  },
  label: {
    fontSize: hp(2),
    color: theme.colors.textDark,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  input: {
    backgroundColor: 'white',
    borderRadius: theme.radius.sm,
    width: wp(90)
  },
  error: {
    color: 'red',
    fontSize: hp(1.8),
    marginTop: 2,
  },
  button: {
    marginTop: hp(5),
    width: wp(90)
  },
  loadingIndicator: {
    marginTop: hp(5),
  },
})

export default Form
