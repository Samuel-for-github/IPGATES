import { Alert, Pressable, TouchableOpacity, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper.jsx';
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js';
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../../constants/theme.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import BackButton from '../../../components/BackButton.jsx';
import { courses as staticCourses } from '../../../constants/data.js';

const Courses = () => {
    const { user } = useAuth();
    const router = useRouter();

    const [statics] = useState(staticCourses); // Permanent static courses
    const [dynamic, setDynamic] = useState([]); // Dynamic courses from DB
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    // Fetch dynamic courses with pagination
    const fetchCourses = async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('new_courses') // Ensure correct table name
                .select('*')
                .order('created_at', { ascending: false })
                .range((page - 1) * 5, page * 5 - 1);

            if (error) throw error;

            if (data.length > 0) {
                // Filter out duplicates and static course matches
                const newCourses = data.filter(course => 
                    !statics.some(s => s.title === course.title) &&
                    !dynamic.some(d => d.id === course.id)
                );

                setDynamic(prev => [...prev, ...newCourses]);
                setPage(prev => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to load courses');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, []); // Initial load

    // Combine courses without duplicates
    const allCourses = [...statics, ...dynamic];

    const handleScroll = ({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const paddingToBottom = 20;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            fetchCourses();
        }
    };

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
                        <Pressable onPress={() => Alert.alert("Logout", "Not implemented")}>
                            <Feather name="log-out" size={24} />
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.heading}>Courses Available</Text>

                <ScrollView 
                    onScroll={handleScroll}
                    scrollEventThrottle={400}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.content}>
                        {allCourses.map((course) => (
                            <TouchableOpacity 
                                key={course.id || course.title} // Unique key
                                style={styles.cards}
                                
                                onPress={() => router.push(
                                    `/courses/course?path=${encodeURIComponent(course.title || course.c_name)}&price=${course.price ||course.fees}&badge=${course.badge}`
                                )}
                            >
                                <Text style={styles.cardsText}>{course.title || course.c_name}</Text>
                                {/* Show origin badge */}
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {course.id ? 'New' : 'Standard'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {loading && (
                        <ActivityIndicator 
                            size="large" 
                            color={theme.colors.primary} 
                            style={styles.loader} 
                        />
                    )}

                    {!hasMore && (
                        <Text style={styles.endText}>No more courses to load</Text>
                    )}
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
        fontSize: hp(4),
        marginVertical: hp(2),
        marginHorizontal: wp(4),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: wp(3),
        marginTop: hp(2)
    },
    icon: {
        flexDirection: 'row',
        gap: 10,
    },
    content: {
        flexGrow: 1,
        gap: hp(2),
        paddingBottom: hp(4),
        alignItems: 'center'
    },
    cards: {
        width: wp(90),
        minHeight: hp(15),
        backgroundColor: '#40916c',
        borderRadius: theme.radius.xl,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        padding: hp(2),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    cardsText: {
        fontSize: hp(2.5),
        fontWeight: '600',
        color: theme.colors.textDark,
        textAlign: 'center'
    },
    loader: {
        marginVertical: hp(2)
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12
    },
    badgeText: {
        color: 'white',
        fontSize: hp(1.5),
        fontWeight: 'bold'
    },
    endText: {
        textAlign: 'center',
        color: theme.colors.textDark,
        marginVertical: hp(2)
    },
    scrollContent: {
        flexGrow: 1
    }
});

export default Courses;