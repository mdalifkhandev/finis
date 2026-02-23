import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
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
    }
};

const Section = ({ title, content }: { title: string, content: string }) => (
    <View style={{ marginBottom: 32 }}>
        <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: THEME.colors.textMain,
            marginBottom: 12
        }}>{title}</Text>
        <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: THEME.colors.textSecondary,
            textAlign: 'justify'
        }}>{content}</Text>
    </View>
);

const AboutUsScreen = () => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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
                <Text style={{ fontSize: 18, fontWeight: '700', color: THEME.colors.textMain }}>About Us</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
            >
                <Section
                    title="About Us"
                    content={lorem}
                />
                <Section
                    title="Our Mission"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet."
                />
                <Section
                    title="Our Vision"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis."
                />
                <Section
                    title="Why Choose Us"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit."
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default AboutUsScreen;
