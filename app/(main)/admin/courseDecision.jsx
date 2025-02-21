import { Alert, ScrollView, StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'
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
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import AntDesign from '@expo/vector-icons/AntDesign';

const CourseAdmin = () => {
    const { user } = useAuth();
    const router = useRouter()

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

                  
                    <View style={styles.coursesContainer}>
    <TouchableOpacity onPress={()=>{
        router.push('admin/course')
    }} style={styles.courseButton}>
        <Text style={styles.courseButtonText}>Add/Delete Course</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>router.push('admin/selectCourse')} style={styles.courseButton}>
        <Text style={styles.courseButtonText}>End Course</Text>
    </TouchableOpacity>
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
    },
    courseButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: hp(1),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    courseButtonText: {
        fontSize: hp(2.2),
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
    },
    
})