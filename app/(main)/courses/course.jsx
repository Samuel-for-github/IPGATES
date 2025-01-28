import { Alert, Pressable, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { MicrosoftData, CiscoData, RedHatLinuxData, PythonData, HandNData, DPData } from '../../../constants/data.js';
import Avatar from '../../../components/Avatar.jsx';
import Footer from '../../../components/Footer.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking'
const courses = () => {

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
                    <BackButton  size={35} />

                    <View style={styles.icon}>
                        <Pressable>
                            <Ionicons name="notifications-outline" size={24}  />
                        </Pressable>
                        <Pressable onPress={handleLogout}>
                            <Feather name="log-out" size={24}  />
                        </Pressable>
                    </View>
                </View>
                <View>
                    <Text style={styles.heading}>{path}</Text>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        {path == 'Microsoft' && MicrosoftData.map((text, i) => {

                            return (
                                <View key={i} style={[styles.cards]}>
                                    <TouchableOpacity onPress={() => {
                                        if (text.heading == "Microsoft Technology Associate : MTA (Windows Server Administration Fundamentals)") {
                                            router.push(`/courses/enroll?path=${encodeURIComponent(text.heading)}&data=${encodeURIComponent(text.subheading)}`);

                                            // Linking.openURL('https://img1.wsimg.com/blobby/go/8fb25151-6c87-40dd-b318-a0caffe6d10f/downloads/MTA%20Windows%20Server%20Administration%20Fundamentals.pdf?ver=1736266649685')
                                        }
                                        if (text.heading == "Microsoft Technology Associate : MTA (Networking Fundamentals)") {
                                            router.push(`/courses/enroll?path=${encodeURIComponent(text.heading)}&data=${encodeURIComponent(text.subheading)}`);
                                            // Linking.openURL('https://img1.wsimg.com/blobby/go/8fb25151-6c87-40dd-b318-a0caffe6d10f/downloads/MTA%20Networking%20Fundamentals.pdf?ver=1736266649685')
                                        }

                                        if (text.heading == `Microsoft Azure Fundamentals (Cloud)`) {
                                            router.push(`/courses/enroll?path=${encodeURIComponent(text.heading)}&data=${encodeURIComponent(text.subheading)}`);
                                            // Linking.openURL('https://img1.wsimg.com/blobby/go/8fb25151-6c87-40dd-b318-a0caffe6d10f/downloads/Microsoft%20Certified%20Azure%20Fundamentals.pdf?ver=1736266649685')
                                        }
                                    }}>

                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={{ marginHorizontal: wp(7), marginTop: hp(2) }}>
                                            <Text style={{ color: theme.colors.textDark }}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                        {path == 'Cisco' && CiscoData.map((text, i) => {
                            return (
                                <View key={i} style={[styles.cards]}>
                                    <Pressable  onPress={() => {
                                        if (text.heading == "CCNA 200-301 : Cisco Certified Network Associate") {
                                            router.push(`/courses/enroll?path=${encodeURIComponent(text.heading)}&data=${encodeURIComponent(text.subheading)}`);
                                            // Linking.openURL('https://img1.wsimg.com/blobby/go/8fb25151-6c87-40dd-b318-a0caffe6d10f/downloads/200-301-CCNA.pdf?ver=1736266647983')
                                        }
                                        if (text.heading == "CCNP Enterprise Certifications (Core Exam-350-401) : Enterprise Network Core Technologies") {
                                            router.push(`/courses/enroll?path=${encodeURIComponent(text.heading)}&data=${encodeURIComponent(text.subheading)}`);
                                            // Linking.openURL('https://img1.wsimg.com/blobby/go/8fb25151-6c87-40dd-b318-a0caffe6d10f/downloads/350-401-ENCORE%20CCNP.pdf?ver=1736266647983')
                                        }

                                        if (text.heading == `CCNP Enterprise Certifications (Concentration Exam- 300-410 ENARSI) : Enterprise Advanced Routing`) {
                                            router.push(`/courses/enroll?path=${encodeURIComponent(text.heading)}&data=${encodeURIComponent(text.subheading)}`);
                                            // Linking.openURL('https://img1.wsimg.com/blobby/go/8fb25151-6c87-40dd-b318-a0caffe6d10f/downloads/300-410-ENARSI%20CCNP.pdf?ver=1736266647983')
                                        }
                                    }}>
                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={[{ marginHorizontal: wp(10), marginTop: hp(2) },]}>
                                            <Text style={{ color: theme.colors.textDark}}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            )
                        })}
                        {path == 'Red Hat Linux' && RedHatLinuxData.map((text, i) => {
                            return (
                                <View key={i} style={[styles.cards]}>
                                    <Pressable>
                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={{ marginHorizontal: wp(7), marginTop: hp(2) }}>
                                            <Text style={{ color: theme.colors.textDark }}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            )
                        })}
                        {path == 'Python' && PythonData.map((text, i) => {
                            return (
                                <View key={i} style={[styles.cards]}>
                                    <Pressable>
                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={{ marginHorizontal: wp(7), marginTop: hp(2) }}>
                                            <Text style={{ color: theme.colors.textDark }}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            )
                        })}
                        {path == 'Hardware & Networking' && HandNData.map((text, i) => {
                            return (
                                <View key={i} style={[styles.cards]}>
                                    <Pressable>
                                        <Text style={styles.cardsText}>
                                            {text.heading}
                                        </Text>
                                        <View style={{ marginHorizontal: wp(7), marginTop: hp(2) }}>
                                            <Text style={{ color: theme.colors.textDark }}>
                                                {text.subheading}
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            )
                        })}

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
    }
})