import { Alert, Image, Text, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper.jsx'
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import AntDesign from '@expo/vector-icons/AntDesign';
import { hp, wp } from '../../helper/common.js'
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../constants/theme.js'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import BackButton from '../../components/BackButton.jsx';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import Ionicons from '@expo/vector-icons/Ionicons';

import Avatar from '../../components/Avatar.jsx';
import Footer from '../../components/Footer.jsx';
const profile = () => {
    const router = useRouter()
    const { user} = useAuth()


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
                    <View>
                        <BackButton  size={wp(8)} />
                    </View>
                    <View>
                        <Text style={styles.heading}>Profile</Text>
                    </View>
                    <View style={styles.icon}>
                        <Pressable>
                            <Ionicons name="notifications-outline" size={24}  />
                        </Pressable>
                        <Pressable onPress={handleLogout}>
                            <Feather name="log-out" size={24}  />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={{ gap: 15 }}>
                        <View style={styles.avatarContainer}>
                            <Avatar uri={user?.image}
                                size={hp(12)}
                                rounded={theme.radius.xxl}
                            />
                            <Pressable onPress={()=>router.push('editPage')}>
                                <Feather name="edit" style={styles.editIcon}  size={24} color="black" />
                            </Pressable>
                        </View>
                        <View style={{alignItems: 'center' , gap:4}}>
                               <Text style={styles.username}>{user && user.s_name}</Text> 
                               <Text style={styles.infoText}>{user && user.address? user.address:'Null'}</Text> 
                        </View>
                        <View style={{gap: 10, marginHorizontal: wp(4)}}>
                            <View style={styles.info}>
                                <Ionicons name='mail-outline' size={hp(5)} />
                                <Text style={styles.infoText}>{user && user.email}</Text>
                            </View>
                            <View style={styles.info}>
                                <Ionicons name='call-outline' size={hp(5)} />
                                <Text style={styles.infoText}>{user && user.phoneNumber? user.phoneNumber: 'Null'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.courseSection}>
                        <Text style={styles.courseText}>Courses Enrolled</Text>
                    </View>
                </View>
            </View>
            <Footer/>
        </ScreenWrapper>
    )
}

export default profile

const styles = StyleSheet.create({
    courseSection:{
        alignItems: 'center',
        marginTop: hp(5),
    },
    courseText:{
        color: 'white',
        fontSize: hp(5),
        fontWeight: theme.fonts.bold
    },
    container: {
        flex: 1,
    },
    heading: {
        // color: theme.colors.textLight,
        fontSize: hp(4),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: wp(3),
        marginTop: hp(2),
    },
    icon: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between'
    },
    content: {
        flex: 1
    },
    avatarContainer: {
        alignSelf: 'center',
        height: hp(12),
        width: hp(12)
    },
    editIcon:{
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
    },
    userIcon:{
        borderColor: 'white',
        borderRadius: wp(5),
        borderWidth: 1,
        height: hp(12),
        width: hp(12)
    },
    username:{
        fontSize: hp(4),
        fontWeight: '500',
        // color: theme.colors.textLight
    },
    infoText: {
        fontSize: hp(2),
        fontWeight: theme.fonts.medium,
        // color: theme.colors.blue
    },
    info:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }

})