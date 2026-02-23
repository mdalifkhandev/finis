import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME = {
    colors: {
        background: '#F8FAFC',
        white: '#FFFFFF',
        textMain: '#0F172A',
        textSecondary: '#64748B',
        bluePrimary: '#3B82F6',
        blueBg: '#D8F0FF', // Specific highlighted blue from image
        border: '#F1F5F9',
        cardBg: '#FFFFFF',
        red: '#FF4D4D',
    }
};

export default function WorkerProfile() {
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const handleLogout = () => {
        setIsLogoutModalVisible(false);
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            >
                {/* Profile Header Card */}
                <View style={{
                    backgroundColor: THEME.colors.white,
                    borderRadius: 24,
                    padding: 32,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: THEME.colors.border,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 10,
                    elevation: 1,
                }}>
                    <View style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden', marginBottom: 20 }}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop' }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: THEME.colors.textMain, marginBottom: 4 }}>Abcd.LTD</Text>
                    <Text style={{ fontSize: 14, color: THEME.colors.textSecondary }}>ID: #225432</Text>

                    <View style={{ width: '100%', marginTop: 24 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: THEME.colors.textMain, marginBottom: 20 }}>Account Information</Text>

                        <TouchableOpacity
                            onPress={() => router.push('/screens/worker/personalinfo')}
                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                        >
                            <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialCommunityIcons name="account-details-outline" size={24} color={THEME.colors.textSecondary} />
                            </View>
                            <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#475569', fontWeight: '500' }}>Personal info</Text>
                            <Feather name="chevron-right" size={20} color="#94A3B8" />
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: THEME.colors.blueBg,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderRadius: 12
                        }}>
                            <Text style={{ flex: 1, fontSize: 16, color: '#0F172A', fontWeight: '700' }}>Payroll</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Setting Card */}
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
                    <Text style={{ fontSize: 16, fontWeight: '700', color: THEME.colors.textMain, marginBottom: 20 }}>Setting</Text>

                    <TouchableOpacity
                        onPress={() => router.push('/screens/worker/permissions')}
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
                    >
                        <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="shield-checkmark-outline" size={22} color={THEME.colors.textSecondary} />
                        </View>
                        <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#475569', fontWeight: '500' }}>Permission</Text>
                        <Feather name="chevron-right" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/screens/worker/settings')}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="settings-outline" size={22} color={THEME.colors.textSecondary} />
                        </View>
                        <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#475569', fontWeight: '500' }}>Settings</Text>
                        <Feather name="chevron-right" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>

                {/* Logout Card */}
                <TouchableOpacity
                    onPress={() => setIsLogoutModalVisible(true)}
                    style={{
                        backgroundColor: THEME.colors.white,
                        borderRadius: 20,
                        padding: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: THEME.colors.border,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 10,
                        elevation: 1,
                    }}
                >
                    <MaterialCommunityIcons name="logout" size={24} color={THEME.colors.textSecondary} style={{ transform: [{ scaleX: -1 }] }} />
                    <Text style={{ marginLeft: 16, fontSize: 16, fontWeight: '600', color: '#475569' }}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Logout Confirmation Modal */}
            <Modal
                visible={isLogoutModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsLogoutModalVisible(false)}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 24
                    }}
                    onPress={() => setIsLogoutModalVisible(false)}
                >
                    <Pressable
                        style={{
                            backgroundColor: 'white',
                            width: '100%',
                            borderRadius: 24,
                            padding: 24,
                            alignItems: 'center'
                        }}
                    >
                        <View style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: '#FFEEEE',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16
                        }}>
                            <Ionicons name="log-out" size={32} color={THEME.colors.red} />
                        </View>

                        <Text style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: THEME.colors.textMain,
                            marginBottom: 12
                        }}>Logout Confirmation</Text>

                        <Text style={{
                            fontSize: 14,
                            color: THEME.colors.textSecondary,
                            textAlign: 'center',
                            lineHeight: 20,
                            marginBottom: 24
                        }}>
                            Are you sure you want to logout? You will need to login again to access your account.
                        </Text>

                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <TouchableOpacity
                                onPress={() => setIsLogoutModalVisible(false)}
                                style={{
                                    flex: 1,
                                    height: 56,
                                    borderRadius: 14,
                                    backgroundColor: '#F1F5F9',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: THEME.colors.textSecondary }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleLogout}
                                style={{
                                    flex: 1,
                                    height: 56,
                                    borderRadius: 14,
                                    backgroundColor: THEME.colors.red,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
