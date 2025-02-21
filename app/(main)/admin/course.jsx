import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import ScreenWrapper from '../../../components/ScreenWrapper.jsx'
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js'
import { theme } from '../../../constants/theme.js'
import BackButton from '../../../components/BackButton.jsx'
import Input from '../../../components/Input.jsx'
import Button from '../../../components/Button.jsx'
import Loading from '../../../components/Loading.jsx';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import AntDesign from '@expo/vector-icons/AntDesign';

const CourseAdmin = () => {
    const { user } = useAuth()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        c_name: '',
        des: '',
        fees: ''
    })

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('new_courses')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setCourses(data)
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAddCourse = async () => {
        if (!formData.c_name || !formData.des || !formData.fees) {
            Alert.alert('Error', 'Please fill all fields')
            return
        }

        if (isNaN(formData.fees)) {
            Alert.alert('Error', 'Price must be a number')
            return
        }

        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('new_courses')
                .insert([{
                    ...formData,
                    fees: parseFloat(formData.fees),
                    
                }])

            if (error) throw error
            await fetchCourses()
            setFormData({ c_name: '', des: '', fees: '' })
            Alert.alert('Success', 'Course added successfully')
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCourse = async (id) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this course?', [
            { text: 'Cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        setLoading(true)
                        const { error } = await supabase
                            .from('new_courses')
                            .delete()
                            .eq('id', id)

                        if (error) throw error
                        await fetchCourses()
                    } catch (error) {
                        Alert.alert('Error', error.message)
                    } finally {
                        setLoading(false)
                    }
                }
            }
        ])
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Unauthorized Access</Text>
            </View>
        )
    }

    return (
        <ScreenWrapper bg="#b7e4c7">
            <StatusBar style='dark' />
            <View style={styles.container}>
                <BackButton size={35} />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.heading}>Manage Courses</Text>

                    <Input
                        placeholder="Course Title"
                        value={formData.c_name}
                        onChangeText={(text) => setFormData({ ...formData, c_name: text })}
                        containerStyles={styles.input}
                    />

                    <Input
                        placeholder="Course Description"
                        value={formData.des}
                        onChangeText={(text) => setFormData({ ...formData, des: text })}
                        multiline
                        numberOfLines={4}
                        containerStyles={styles.input}
                    />

                    <Input
                        placeholder="Price (INR)"
                        value={formData.fees}
                        onChangeText={(text) => setFormData({ ...formData, fees: text })}
                        keyboardType="numeric"
                        containerStyles={styles.input}
                    />

                    {loading ? (
                        <Loading />
                    ) : (
                        <Button
                            title="Add Course"
                            onPress={handleAddCourse}
                            buttonStyle={styles.button}
                        />
                    )}

                    <View style={styles.coursesContainer}>
                        {courses.map((course) => (
                            <View key={course.id} style={styles.courseCard}>
                                <View style={styles.courseHeader}>
                                    <Text style={styles.courseTitle}>{course.c_name}</Text>
                                    <Pressable onPress={() => handleDeleteCourse(course.id)}>
                                        <MaterialIcons name="delete" size={24} color="red" />
                                    </Pressable>
                                </View>
                                <Text style={styles.courseDesc}>{course.des}</Text>
                                <Text style={styles.coursePrice}>₹{course.fees}</Text>
                                
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default CourseAdmin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4)
    },
    heading: {
        fontSize: hp(4),
        fontWeight: 'bold',
        color: theme.colors.textDark,
        marginVertical: hp(2),
        textAlign: 'center'
    },
    input: {
        backgroundColor: 'white',
        marginVertical: hp(1),
        borderRadius: theme.radius.md,
        padding: hp(1.5)
    },
    button: {
        marginVertical: hp(2),
        backgroundColor: theme.colors.primary
    },
    coursesContainer: {
        marginTop: hp(2)
    },
    courseCard: {
        backgroundColor: 'white',
        borderRadius: theme.radius.lg,
        padding: hp(2),
        marginBottom: hp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1)
    },
    courseTitle: {
        fontSize: hp(2.5),
        fontWeight: '600',
        color: theme.colors.textDark,
        flex: 1
    },
    courseDesc: {
        fontSize: hp(2),
        color: theme.colors.textDark,
        marginBottom: hp(1)
    },
    coursePrice: {
        fontSize: hp(2.2),
        fontWeight: 'bold',
        color: theme.colors.primary
    },
    scrollContainer: {
        paddingBottom: hp(10)
    }
})