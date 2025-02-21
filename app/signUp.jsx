import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../constants/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { wp, hp } from '../helper/common';
import Input from '../components/Input';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

const SignUp = () => {
    const router = useRouter();

    const [role, setRole] = useState('Student'); // Default role
    const [loading, setLoading] = useState(false);

    // Form Fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async () => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Sign Up', 'Please fill all the fields');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Sign Up', 'Password should be at least 8 characters');
            return;
        }

        if (role === 'Admin' && password !== 'ADMIN-OF-IPGATES') {
            Alert.alert('Sign Up', 'Incorrect admin password');
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
                data: {
                    name: username.trim(),
                    email: email.trim(),
                    role: role,
                },
            },
        });

        setLoading(false);

        if (error) {
            Alert.alert('Sign Up', error.message);
        } else {
            router.push('/home');
        }
    };

    return (
        <ScreenWrapper bg="white">
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <BackButton style={styles.backButton} />
                    <View>
                        <Text style={styles.welcomeText}>Let's Get Started</Text>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.description}>
                            Please fill in the details to create a new account
                        </Text>

                        <Input
                            icon={<AntDesign name="user" size={24} color="black" />}
                            placeholder="Enter your name"
                            onChangeText={setUsername}
                            value={username}
                        />
                        <Input
                            icon={<MaterialIcons name="mail-outline" size={24} color="black" />}
                            placeholder="Enter your email"
                            onChangeText={setEmail}
                            value={email}
                        />
                        <Input
                            icon={<Ionicons name="lock-closed-outline" size={24} color="black" />}
                            secureTextEntry
                            placeholder="Enter your password"
                            onChangeText={setPassword}
                            value={password}
                        />

                        {/* Role Selection */}
                        <Text style={styles.label}>Select Role:</Text>
                        <View style={styles.roleContainer}>
                            {['Admin', 'Student', 'Teacher'].map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => setRole(item)}
                                    style={[styles.roleButton, role === item && styles.selectedRole]}
                                >
                                    <Text style={[styles.roleText, role === item && styles.selectedRoleText]}>
                                        {item}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Button title="Sign Up" loading={loading} onPress={onSubmit} />
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <Pressable onPress={() => router.push('login')}>
                            <Text style={[styles.footerText, styles.footerLink]}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
        paddingBottom: hp(5), // Ensure spacing at the bottom
    },
    welcomeText: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
    },
    description: {
        fontSize: hp(2),
        color: theme.colors.text,
    },
    form: {
        gap: 25,
    },
    label: {
        fontSize: hp(2),
        color: theme.colors.text,
        fontWeight: theme.fonts.semibold,
        marginBottom: 10,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
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
        fontWeight: theme.fonts.semibold,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 20,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2),
    },
    footerLink: {
        color: theme.colors.primaryDark,
        fontWeight: theme.fonts.semibold,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0, 0.07)',
    },
});
