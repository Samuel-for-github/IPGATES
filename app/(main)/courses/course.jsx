import { Alert, Pressable, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../../components/ScreenWrapper.jsx'
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js'
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../../constants/theme.js'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useSearchParams, useLocalSearchParams, useSegments } from 'expo-router';
import BackButton from '../../../components/BackButton.jsx'
import Button from '../../../components/Button.jsx'
import { MicrosoftData, CiscoData, RedHatLinuxData, PythonData, HandNData, DPData } from '../../../constants/data.js';

import * as Linking from 'expo-linking'
import { getCourseData } from '../../../services/courseService.js';
const courses = () => {

    const router = useRouter()
    const segments = useSegments();
    const { path,price, badge } = useLocalSearchParams()

      
        const [loading, setLoading]=useState(false);
        const [limit, setLimit] = useState(true)
        const [pending, setPending] = useState('not-applied')
        const { user } = useAuth()

        const fetchCourseData = async () => {
            try {
                const res = await getCourseData(user?.id);
                
                res.data.forEach((val) => {
                    
                    
                    if (path === val.c_name) {
                        
                        setPending(val.request);
                    }
                    
                });
            } catch (err) {
                console.error("Error fetching course data:", err.message);
            } finally {
                setLoading(false);
                
                  // Stop loading after fetching
            }
        };
        const getAllCousers = async()=>{
            try {
                const { count, error } = await supabase
  .from('course')
  .select('*', { count: 'exact' })  // Enables counting rows
  .eq('c_name', path)               // Check for c_name
  .in('request', ['pending', 'Accepted']);
                if (error) {
                    console.log('got error', error);
                    return {success: false, message: error.message}
                }
                console.log(count);
                
                //change to ten later
                if (count==10) {
                    setLimit(false)
                }
                
                return{success: true, count};
            } catch (error) {
                console.log('got error', error);
                return {success: false, message: error.message}
                
            }
        }
            useEffect(() => {
                setLoading(true);
                getAllCousers()
                fetchCourseData();
            }, [path]); 
        
    async function signOut() {

        const { error } = await supabase.auth.signOut()
        console.log(error);

        if (error) {
            Alert.alert('Error', error.message)
        }
        setTimeout(() => {
            router.replace('/welcome');
        }, 1500);
    }

    const handleLogout = async () => {
        Alert.alert('Confirm', 'Are you sure you want to log out?', [
            {
                text: 'Cancel',
                onPress: () => console.log("logout cancel"),
                style: 'cancel'

            }, {
                text: 'Logout',
                onPress: () => signOut(),
                style: 'destructive'
            }
        ])
    }
    return (
        <ScreenWrapper bg="#b7e4c7">
            <StatusBar style='dark' />
            <View style={styles.container}>

                <View style={styles.header}>
                    <BackButton  size={35} />

                   
                </View>
                <View>
                    <Text style={styles.heading}>{path}</Text>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        {path == 'Microsoft' && MicrosoftData.map((text, i) => {

                            return (
                                <View key={i} style={[styles.cards]}>
                                    <View>

                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={{ marginHorizontal: wp(7), marginTop: hp(2) }}>
                                            <Text style={{ color: theme.colors.textDark }}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                       
                        {path == 'Cisco' && CiscoData.map((text, i) => {
                            return (
                                <View key={i} style={[styles.cards]}>
                                    <View>{/* router.push(`/courses/enroll?path=${encodeURIComponent(text.heading)}&data=${encodeURIComponent(text.subheading)}&price=${encodeURIComponent(text.price)}`); */}
                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={[{ marginHorizontal: wp(10), marginTop: hp(2) },]}>
                                            <Text style={{ color: theme.colors.textDark}}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                        {path == 'Red Hat Linux' && RedHatLinuxData.map((text, i) => {
                            return (
                                <View key={i} style={[styles.cards]}>
                                    <View>
                                        {/* // router.push(`/courses/enroll?path=${encodeURIComponent(text.heading)}&data=${encodeURIComponent(text.subheading)}&price=${encodeURIComponent(text.price)}`); */}
                                
                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={{ marginHorizontal: wp(7), marginTop: hp(2) }}>
                                            <Text style={{ color: theme.colors.textDark }}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                        {path == 'Python' && PythonData.map((text, i) => {
                            return (
                                <View key={i} style={[styles.cards]}>
                                    <View>
                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={{ marginHorizontal: wp(7), marginTop: hp(2) }}>
                                            <Text style={{ color: theme.colors.textDark }}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                        {path == 'Hardware & Networking' && HandNData.map((text, i) => {
                            return (
                                <View key={i} style={[styles.cards]}>
                                    <View>
                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={{ marginHorizontal: wp(7), marginTop: hp(2) }}>
                                            <Text style={{ color: theme.colors.textDark }}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                        <View style={{ marginVertical: hp(2) }}>
    <Text style={{ marginVertical: hp(1), fontSize: hp(5) }}>Price: {price}</Text>
    {badge !== 'standard' ? (
        <Text style={{ fontSize: hp(3), color: 'red', fontWeight: 'bold' }}>Coming Soon</Text>
    ) : (
        pending === 'not-applied' && limit && (
            <Button
                title='Enroll'
                onPress={() => {
                    router.push(
                        `courses/form?course=${encodeURIComponent(path)}&name=${user?.name}&phone=${user?.phoneNumber}&address=${user?.address}&email=${user?.email}&sId=${user?.id}&fees=${price}`
                    );
                }}
                buttonStyle={styles.button}
            />
        ) || loading && <Text>Loading...</Text>
    )}
    {!limit && <Text>Enrollment is full</Text>}
    {pending === 'Completed' && <Text>You have Completed the Course</Text>}
    {pending === 'not-paid' && <Text>Not paid</Text>}
    {pending === 'paid' && <Text>Pending</Text>}
    {pending === 'Accepted' && <Text>Already Enrolled</Text>}
</View>

                        
                    </View>
                </ScrollView>
                
            </View>

        </ScreenWrapper>
    )
}

export default courses

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        color: theme.colors.textDark,
        fontSize: hp(6),
        width: wp(80),
        marginVertical: hp(3),
        marginLeft: wp(4),
        textAlign: 'left'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: wp(3),
        marginTop: hp(2)
    },
    logo: {
        height: 60,
        width: 150,
        backgroundColor: 'rgba(228, 222, 222, 0.91)',
        borderRadius: 10,
    },
    icon: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between'
    },
    content: {
        flex: 1,
        alignItems: 'center'
    },
    cards: {
        flex: 1,
        marginVertical: hp(3),
        paddingVertical: hp(5),
        paddingHorizontal: wp(4),
        borderRadius: theme.radius.xl,
        width: wp(81),
        borderCurve: 'continuous',
        alignItems: 'center',
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        backgroundColor: '#40916c',
    },
    card1: {
        position: 'absolute',
        top: -80,
        width: wp(40),
        height: hp(40),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '90deg' }]
    },
    cardsText: {
        fontSize: hp(2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark,
    },
    background: {
        position: 'absolute',
        height: hp(150),
        width: wp(100),
    },
    button:{
        paddingHorizontal: wp(5)
      },
})