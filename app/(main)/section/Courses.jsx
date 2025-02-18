import { Alert, Pressable, TouchableOpacity, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
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
import { MicrosoftData, CiscoData, RedHatLinuxData, PythonData, HandNData, courses } from '../../../constants/data.js';
import Avatar from '../../../components/Avatar.jsx';
import Footer from '../../../components/Footer.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking'

const Courses = () => {

    const { setAuth, user } = useAuth()
    const router = useRouter()
    const segments = useSegments();
    const { path } = useLocalSearchParams()


    async function signOut() {

        const { error } = await supabase.auth.signOut()
        console.log(error);

        if (error) {
            Alert.alert('Error', error.message)
        }
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
                    <BackButton size={35} />

                    <View style={styles.icon}>
                        <Pressable>
                            <Ionicons name="notifications-outline" size={24} />
                        </Pressable>
                        <Pressable onPress={handleLogout}>
                            <Feather name="log-out" size={24} />
                        </Pressable>
                    </View>
                </View>
                <View>
                    <Text style={styles.heading}>Courses Available</Text>
                </View>
                <ScrollView>

                    <View style={styles.content}>
                        {courses.map((value, i) => {
                            return (
                                <TouchableOpacity key={i} style={styles.cards}
                                    onPress={() => {
                                        router.push(`/courses/course?path=${encodeURIComponent(value.title)}&price=${value.price}`)
                                    }}
                                >
                                    <Text style={styles.cardsText}>{value.title}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
                {/* <Footer /> */}
            </View>

        </ScreenWrapper>
    )
}

export default Courses

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    top: {
        // backgroundColor: 'rgb(222, 224, 228)',
        marginHorizontal: wp(3),
        borderRadius: theme.radius.md,
        gap: hp(10),
        paddingBottom: hp(3)
        // borderWidth: 2
    },
    containerStyles: {
        marginHorizontal: wp(3.5),
        borderRadius: 10

    },
    headingText: {
        fontSize: hp(3),
        color: 'black'
    },
    heading: {
        color: theme.colors.textDark,
        fontSize: hp(6),
        width: wp(80),
        marginVertical: hp(2),
        marginHorizontal: wp(4),
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
        // flexDirection: 'row',
        gap: 10,
        marginBottom: wp(15),
        alignItems: 'center'
    },
    cards: {
        //   flex: 1,
        marginVertical: hp(3),
        //   paddingVertical: hp(5),
        borderColor: theme.colors.primary,
        borderWidth: 2,
        backgroundColor: '#40916c',
        borderRadius: theme.radius.xl,
        width: wp(80),
        borderCurve: 'continuous',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        height: hp(15)
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
        //     borderColor: theme.colors.primary,
        //   borderWidth: 1,
        //   paddingVertical: hp(5),
        justifyContent: 'center',
        // height: hp(10),
        fontSize: hp(4),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark,
    },
    background: {
        position: 'absolute',
        height: hp(150),
        width: wp(100),
    },

})