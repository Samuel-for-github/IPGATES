import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper.jsx';
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js';
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../../constants/theme.js';
import BackButton from '../../../components/BackButton.jsx';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Button from '../../../components/Button.jsx';
import Loading from '../../../components/Loading.jsx';

const Job = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [completedStudents, setCompletedStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allSelected, setAllSelected] = useState(false);

    useEffect(() => {
        fetchCompletedStudents();
    }, []);

    async function fetchCompletedStudents() {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('completedStudent').select('*');
            if (error) {
                console.error(error);
                return;
            }

            const studentsWithNames = await Promise.all(
                data.map(async (student) => {
                    if (!student.student_id) return null; // Ignore records with missing student_id

                    const { data: studentData, error: studentError } = await supabase
                        .from('users')
                        .select('name')
                        .eq('id', student.student_id)
                        .single();

                    if (studentError) {
                        console.error(studentError);
                        return { ...student, s_name: 'Unknown' };
                    }

                    return {
                        ...student,
                        s_name: studentData?.name || 'Unknown',
                    };
                })
            );

            // Filter out null values and ensure unique student IDs
            const uniqueStudents = studentsWithNames
                .filter((student) => student !== null)
                .filter((student, index, self) =>
                    index === self.findIndex(s => s.student_id === student.student_id)
                );

            setCompletedStudents(uniqueStudents);
        } catch (error) {
            console.error('Error fetching completed students:', error);
        } finally {
            setLoading(false);
        }
    }

    // Function to toggle student selection
    const toggleStudentSelection = (student_id) => {
        setSelectedStudents((prev) => {
            const updatedSelection = prev.includes(student_id)
                ? prev.filter(id => id !== student_id) // Deselect
                : [...prev, student_id]; // Select

            setAllSelected(updatedSelection.length === completedStudents.length);
            return updatedSelection;
        });
    };

    // Function to toggle "Select All"
    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedStudents([]);
            setAllSelected(false);
        } else {
            setSelectedStudents(completedStudents.map(student => student.student_id));
            setAllSelected(true);
        }
    };

    // Function to navigate to the send page with selected students
    const handleSendNotification = () => {
        if (selectedStudents.length === 0) {
            Alert.alert("Error", "Select at least one student!");
            return;
        }
        router.push(`admin/send/send?students=${JSON.stringify(selectedStudents)}`);
    };

    return (
        <ScreenWrapper bg="#b7e4c7">
            <StatusBar style='dark' />
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton size={35} />
                    <View style={styles.icon}>
                        <Pressable onPress={() => Alert.alert('Confirm', 'Logout?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Logout', onPress: async () => await supabase.auth.signOut(), style: 'destructive' },
                        ])}>
                            <Feather name="log-out" size={24} />
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.heading}>Send Notification</Text>

                <ScrollView>
                    <View style={styles.content}>
                        <Text style={styles.heading}>Completed Students</Text>

                        {/* Select All Button */}
                        <TouchableOpacity
                            onPress={toggleSelectAll}
                            style={[styles.selectAllButton, allSelected && styles.selectedStudent]}
                        >
                            <Text style={styles.selectAllText}>{allSelected ? "Deselect All" : "Select All"}</Text>
                        </TouchableOpacity>

                        {/* Student List */}
                        {loading ? (
                            <Loading />
                        ) : completedStudents.length > 0 ? (
                            completedStudents.map((student) => (
                                <TouchableOpacity
                                    key={`${student.student_id}-${student.course_name}`} // Ensuring unique key
                                    style={[
                                        styles.completedStudentCard,
                                        selectedStudents.includes(student.student_id) && styles.selectedStudent,
                                    ]}
                                    onPress={() => toggleStudentSelection(student.student_id)}
                                >
                                    <Text style={styles.completedStudentText}>
                                        Student Name: <Text style={{ color: theme.colors.textLight }}>{student.s_name}</Text>
                                    </Text>
                                    <Text style={styles.completedStudentText}>
                                        Course Name: <Text style={{ color: theme.colors.textLight }}>{student.course_name}</Text>
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.cardsText}>No students have completed any courses yet.</Text>
                        )}

                        {/* Send Notification Button */}
                        <Button
                            buttonStyle={{ paddingHorizontal: wp(4), marginTop: hp(2) }}
                            title="Send Notifications"
                            onPress={handleSendNotification}
                            disabled={loading || selectedStudents.length === 0}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default Job;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        color: theme.colors.textDark,
        fontSize: hp(3),
        width: wp(80),
        marginVertical: hp(3),
        textAlign: 'left',
        marginLeft: wp(4),
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
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    selectAllButton: {
        padding: hp(2),
        borderRadius: theme.radius.md,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: theme.colors.primary,
        marginBottom: hp(2),
        width: wp(80),
        alignItems: 'center',
    },
    selectAllText: {
        fontSize: hp(2),
        fontWeight: 'bold',
    },
    completedStudentCard: {
        marginVertical: hp(2),
        padding: hp(3),
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.primary,
        width: wp(80),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        opacity: 0.9,
        elevation: 3,
    },
    selectedStudent: {
        backgroundColor: theme.colors.secondary, // Highlight selected students
    },
    completedStudentText: {
        fontSize: hp(2),
        color: theme.colors.textDark,
    },
    cardsText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark,
    },
});
