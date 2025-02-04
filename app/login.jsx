import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../constants/theme'
import AntDesign from '@expo/vector-icons/AntDesign';
import { wp, hp } from '../helper/common'
import Input from '../components/Input'
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

const Login = () => {
    const router = useRouter()
    
    const [role, setRole] = useState('Student')  // Default role
    const [loading, setLoading] = useState(false)
    
    const emailRef = useRef()
    const passwordRef = useRef()

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Login', "Please fill all the fields");
            return;
        }
        if (passwordRef.current.length < 8) {
            Alert.alert('Login', "Password should be at least 8 characters");
            return;
        }
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();
        
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert('Login', error.message);
        setLoading(false);
    };

    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>
                <BackButton style={styles.backButton} />
                <View>
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                </View>
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(2), color: theme.colors.text }}>Please Login to Continue</Text>
                    <Input icon={<MaterialIcons name="mail-outline" size={24} color="black" />} placeholder="Enter your email" onChangeText={(value) => { emailRef.current = value }} />
                    <Input icon={<Ionicons name="lock-closed-outline" size={24} color="black" />} secureTextEntry placeholder="Enter your password" onChangeText={(value) => { passwordRef.current = value }} />
                    
                    {/* Role Selection */}
                    <Text style={styles.label}>Select Role:</Text>
                    <View style={styles.roleContainer}>
                        {['Admin', 'Student', 'Teacher'].map((item) => (
                            <Pressable key={item} onPress={() => setRole(item)} style={[styles.roleButton, role === item && styles.selectedRole]}>
                                <Text style={[styles.roleText, role === item && styles.selectedRoleText]}>{item}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Button title='Login' loading={loading} onPress={onSubmit} />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Pressable onPress={() => router.push('signUp')}>
                        <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5)
    },
    welcomeText: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
    },
    form: {
        gap: 25
    },
    label: {
        fontSize: hp(2),
        color: theme.colors.text,
        fontWeight: theme.fonts.semibold,
        marginBottom: 10
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    roleButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primaryDark,
    },
    selectedRole: {
        backgroundColor: theme.colors.primaryDark,
    },
    roleText: {
        fontSize: hp(2),
        color: theme.colors.primaryDark,
    },
    selectedRoleText: {
        color: 'white',
        fontWeight: theme.fonts.semibold
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2)
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0, 0.07)'
    }
});
