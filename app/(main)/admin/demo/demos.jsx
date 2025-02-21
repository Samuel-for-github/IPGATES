import { 
    Alert, 
    Pressable, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    ActivityIndicator, 
    TextInput 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../../../../components/ScreenWrapper.jsx';
import { supabase } from '../../../../lib/supabase.js';
import { useAuth } from '../../../../context/AuthContext.js';
import { hp, wp } from '../../../../helper/common.js';
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../../../constants/theme.js';
import BackButton from '../../../../components/BackButton.jsx';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Button from '../../../../components/Button.jsx';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

const Demo = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { course } = useLocalSearchParams();
    
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState([]);
    const [videoName, setVideoName] = useState("");
    const [selectedVideo, setSelectedVideo] = useState(null);

    // 📌 Fetch Videos
    const fetchVideos = async () => {
        setLoading(true);
        const { data, error } = await supabase.storage.from("videos").list(course);
        if (error) {
            Alert.alert("Error", "Failed to fetch videos");
        } else {
            setVideos(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // 📌 Select Video using Expo Media Library
    const selectVideo = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "We need access to your media library.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 1,
            });

            if (result.canceled) return;

            const fileUri = result.assets[0].uri;
            const fileExt = fileUri.split('.').pop();
            const defaultName = `video.${fileExt}`;

            setSelectedVideo({ uri: fileUri, name: defaultName, type: `video/${fileExt}` });
            setVideoName(defaultName.replace(/\.[^/.]+$/, "")); // Remove extension for editing
        } catch (error) {
            Alert.alert("Error", "Failed to select video");
        }
    };

    // 📌 Upload Video
    const uploadVideo = async () => {
        if (!selectedVideo) {
            Alert.alert("Error", "No video selected.");
            return;
        }

        try {
            setLoading(true);
            const fileExt = selectedVideo.name.split('.').pop();
            const finalName = `${videoName.trim()}.${fileExt}`;
            const filePath = `${course}/${finalName}`;

            // Read file as Base64
            const fileData = await FileSystem.readAsStringAsync(selectedVideo.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const { data, error } = await supabase.storage
                .from("videos")
                .upload(filePath, decode(fileData), {
                  contentType: 'video/mp4'
                });

            if (error) throw error;

            Alert.alert("Success", "Video uploaded successfully!");
            setSelectedVideo(null);
            setVideoName("");
            fetchVideos();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    // 📌 Delete Video
    const deleteVideo = async (videoName) => {
        try {
            setLoading(true);
            const filePath = `${course}/${videoName}`;

            const { error } = await supabase.storage.from("videos").remove([filePath]);

            if (error) throw error;

            Alert.alert("Success", "Video deleted successfully!");
            fetchVideos();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper bg="#b7e4c7">
            <StatusBar style="dark" />
            <View style={styles.container}>
                {/* 🔹 Header */}
                <View style={styles.header}>
                    <BackButton size={35} />
                    <View style={styles.icon}>
                        <Pressable onPress={() => router.back()}>
                            <Feather name="log-out" size={24} />
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.heading}>{course} Demo Videos</Text>

                {/* 🔹 Select & Display Video Name */}
                <Button buttonStyle={styles.button} title="Select Video" onPress={selectVideo} />
                
                {selectedVideo && (
                    <View style={styles.selectedVideoContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter video name"
                            onChangeText={setVideoName}
                        />
                       
                        <Button buttonStyle={styles.upload} title="Upload Video" onPress={uploadVideo} />
                    </View>
                )}

                {/* 🔹 Video List */}
                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <ScrollView>
                        <View style={styles.content}>
                            {videos.length > 0 ? (
                                videos.map((video, index) => (
                                    <View key={index} style={styles.videoCard}>
                                        <Text style={styles.videoName}>{video.name}</Text>
                                        <TouchableOpacity onPress={() => deleteVideo(video.name)}>
                                            <AntDesign name="delete" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noVideos}>No videos uploaded</Text>
                            )}
                        </View>
                    </ScrollView>
                )}
            </View>
        </ScreenWrapper>
    );
};

export default Demo;

const styles = StyleSheet.create({
    button:{
        marginHorizontal: wp(5)
    },
    upload: {
        width: wp(90)
    },
    container: {
        flex: 1,
    },
    heading: {
        color: theme.colors.textDark,
        fontSize: hp(3),
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
    content: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        backgroundColor: 'white',
        marginHorizontal: wp(4),
        padding: hp(1.5),
        borderRadius: theme.radius.md,
        fontSize: hp(2),
        marginBottom: hp(2),
        borderWidth: 1,
        width: wp(90),
        borderColor: theme.colors.primary,
    },
    selectedVideoContainer: {
        alignItems: 'center',
        marginVertical: hp(2),
    },
    videoCard: {
        backgroundColor: '#40916c',
        padding: wp(4),
        marginVertical: hp(1),
        borderRadius: theme.radius.md,
        width: wp(90),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    videoName: {
        fontSize: hp(2.2),
        fontWeight: 'bold',
        color: 'white',
    },
    noVideos: {
        fontSize: hp(2),
        color: 'white',
        textAlign: 'center',
        marginTop: hp(5),
    },
});
