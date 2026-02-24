import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME = {
    colors: {
        background: '#F8FAFC',
        white: '#FFFFFF',
        textMain: '#0F172A',
        textSecondary: '#64748B',
        textLabel: '#94A3B8',
        border: '#F1F5F9',
        darkCircle: '#1D4F6D', // Dark blue for the edit icon background
    }
};

const InfoRow = ({ icon, label, value, isLast = false }: { icon: any, label: string, value: string, isLast?: boolean }) => (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: isLast ? 0 : 20
    }}>
        <View style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: '#F8FAFC',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <MaterialCommunityIcons name={icon} size={22} color={THEME.colors.textSecondary} />
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={{ fontSize: 13, color: THEME.colors.textLabel, marginBottom: 2 }}>{label}</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#475569' }}>{value}</Text>
        </View>
    </View>
);

const PersonalInfoScreen = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const pickProfileImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.white }} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 64,
                paddingHorizontal: 20,
                backgroundColor: THEME.colors.white
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Feather name="chevron-left" size={32} color={THEME.colors.textMain} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: THEME.colors.textMain }}>Personal info</Text>
                <TouchableOpacity
                    onPress={() => router.push('/screens/worker/edit_profile')}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: THEME.colors.darkCircle,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <MaterialCommunityIcons name="square-edit-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 }}
            >
                {/* Profile Section */}
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <View style={{ width: 120, height: 120, position: 'relative' }}>
                        <Image
                            source={{ uri: profileImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop' }}
                            style={{ width: '100%', height: '100%', borderRadius: 60 }}
                        />
                        <TouchableOpacity
                            onPress={pickProfileImage}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                backgroundColor: '#1D4F6D',
                                borderWidth: 2,
                                borderColor: 'white',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Ionicons name="camera" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: THEME.colors.textMain, marginTop: 16 }}>Rokey</Text>
                </View>

                {/* Information Card */}
                <View style={{
                    backgroundColor: THEME.colors.white,
                    borderRadius: 24,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: THEME.colors.border,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 10,
                    elevation: 1,
                }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 20 }}>Personal Information</Text>

                    <InfoRow icon="account-outline" label="Full Name" value="Rokey Mahmud" />

                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B', marginTop: 12, marginBottom: 20 }}>Contact Information</Text>

                    <InfoRow icon="email-outline" label="Email" value="alice@example.com" />
                    <InfoRow icon="phone-outline" label="Phone" value="+1 (555) 123-4567" isLast={true} />
                </View>

                {/* Change Password Card */}
                <TouchableOpacity
                    onPress={() => router.push('/screens/worker/change_password')}
                    style={{
                        backgroundColor: THEME.colors.white,
                        borderRadius: 20,
                        padding: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderWidth: 1,
                        borderColor: THEME.colors.border,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 10,
                        elevation: 1,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#475569' }}>Change Password</Text>
                    <Feather name="chevron-right" size={20} color="#94A3B8" />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default PersonalInfoScreen;
