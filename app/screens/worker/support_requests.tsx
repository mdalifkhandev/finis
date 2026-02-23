import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME = {
    colors: {
        background: '#FFFFFF',
        white: '#FFFFFF',
        textMain: '#1A1C1E',
        textSecondary: '#475569',
        inputBg: '#F8FAFC',
        inputBorder: '#F1F5F9',
        bluePrimary: '#1D4F6D', // Dark blue for the send button
    }
};

const SupportRequestsScreen = () => {
    const [complain, setComplain] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 64,
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ position: 'absolute', left: 20 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Feather name="chevron-left" size={32} color={THEME.colors.textMain} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: THEME.colors.textMain }}>Support Requests</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 }}
                >
                    {/* Dropdown Placeholder */}
                    <TouchableOpacity
                        style={{
                            height: 64,
                            backgroundColor: '#F3F9FB',
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            borderWidth: 1,
                            borderColor: '#E2E8F0',
                            marginBottom: 16
                        }}
                    >
                        <Text style={{ flex: 1, fontSize: 16, color: '#94A3B8', fontWeight: '500' }}>Send to admin</Text>
                        <Feather name="chevron-down" size={24} color="#1A1C1E" />
                    </TouchableOpacity>

                    {/* TextArea */}
                    <View style={{
                        height: 200,
                        backgroundColor: '#F3F9FB',
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: '#E2E8F0',
                        marginBottom: 24
                    }}>
                        <TextInput
                            placeholder="Write your complain here"
                            placeholderTextColor="#CBD5E1"
                            multiline
                            textAlignVertical="top"
                            value={complain}
                            onChangeText={setComplain}
                            style={{
                                flex: 1,
                                fontSize: 16,
                                color: THEME.colors.textMain,
                                fontWeight: '500'
                            }}
                        />
                    </View>

                    {/* Send Button */}
                    <TouchableOpacity
                        style={{
                            height: 56,
                            backgroundColor: THEME.colors.bluePrimary,
                            borderRadius: 14,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => router.back()}
                    >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Send</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SupportRequestsScreen;
