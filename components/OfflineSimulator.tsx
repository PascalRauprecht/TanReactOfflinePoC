import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { onlineManager } from '@tanstack/react-query';

const OfflineSimulator = () => {
    const [isOnline, setIsOnline] = useState(onlineManager.isOnline());
    const [networkAvailable, setNetworkAvailable] = useState(true);

    // Animation values
    const switchTranslateX = useRef(new Animated.Value(isOnline ? 1 : 0)).current;
    const containerBgColor = useRef(new Animated.Value(isOnline ? 1 : 0)).current;
    const statusIconScale = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;

    // Animate when online status changes
    useEffect(() => {
        // Animate switch position
        Animated.spring(switchTranslateX, {
            toValue: isOnline ? 1 : 0,
            friction: 6,
            tension: 300,
            useNativeDriver: false,
        }).start();

        // Animate container background
        Animated.timing(containerBgColor, {
            toValue: isOnline ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();

        // Animate status icon
        Animated.sequence([
            Animated.timing(statusIconScale, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.spring(statusIconScale, {
                toValue: 1,
                friction: 3,
                tension: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isOnline]);

    // Check if network is actually available
    useEffect(() => {
        // Function to check network status
        const checkNetwork = () => {
            // Simple check using navigator.onLine
            const isNetworkAvailable = typeof navigator !== 'undefined' && navigator.onLine;
            setNetworkAvailable(isNetworkAvailable);

            // If network is not available, ensure React Query knows we're offline
            if (!isNetworkAvailable) {
                onlineManager.setOnline(false);
                setIsOnline(false);
            }
        };

        // Check immediately
        checkNetwork();

        // Set up event listeners for online/offline events
        if (typeof window !== 'undefined') {
            window.addEventListener('online', checkNetwork);
            window.addEventListener('offline', checkNetwork);

            // Clean up event listeners
            return () => {
                window.removeEventListener('online', checkNetwork);
                window.removeEventListener('offline', checkNetwork);
            };
        }
    }, []);

    // If network is not available (ethernet unplugged), don't show the simulator
    if (!networkAvailable) {
        return null;
    }

    // Calculate interpolated values for animations
    const switchPosition = switchTranslateX.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 30],
    });

    const bgColor = containerBgColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#fef2f2', '#f0fdf4'],
    });

    const toggleNetwork = () => {
        // Only animate the thumb and icon, not the whole card
        const newStatus = !isOnline;
        onlineManager.setOnline(newStatus);
        setIsOnline(newStatus);
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={toggleNetwork}>
                <Animated.View 
                    style={[
                        styles.statusDisplay, 
                        { backgroundColor: bgColor }
                    ]}
                >
                    <View style={styles.contentContainer}>
                        <Animated.View 
                            style={[
                                styles.statusIcon, 
                                isOnline ? styles.statusIconOnline : styles.statusIconOffline, 
                                { transform: [{ scale: statusIconScale }] }
                            ]}
                        >
                            <Text style={styles.statusIconText}>{isOnline ? '✓' : '✕'}</Text>
                        </Animated.View>

                        <View style={styles.statusTextContainer}>
                            <Text 
                                style={[
                                    styles.statusLabel, 
                                    isOnline ? styles.statusLabelOnline : styles.statusLabelOffline
                                ]}
                            >
                                {isOnline ? 'ONLINE' : 'OFFLINE'}
                            </Text>
                        </View>
                    </View>

                    {/* Custom Toggle Switch */}
                    <View style={styles.switchContainer}>
                        <Animated.View 
                            style={[
                                styles.switchTrack, 
                                isOnline ? styles.switchTrackOnline : styles.switchTrackOffline
                            ]}
                        >
                            <Animated.View 
                                style={[
                                    styles.switchThumb, 
                                    { transform: [{ translateX: switchPosition }] }, 
                                    isOnline ? styles.switchThumbOnline : styles.switchThumbOffline
                                ]} 
                            />
                        </Animated.View>
                    </View>
                </Animated.View>
            </Pressable>
        </View>
    );
};

export default OfflineSimulator;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchContainer: {
        height: 28,
        width: 56,
        justifyContent: 'center',
    },
    switchTrack: {
        width: 56,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
    },
    switchTrackOnline: {
        backgroundColor: '#dcfce7',
        borderWidth: 1,
        borderColor: '#86efac',
    },
    switchTrackOffline: {
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    switchThumb: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    switchThumbOnline: {
        backgroundColor: '#22c55e',
    },
    switchThumbOffline: {
        backgroundColor: '#ef4444',
    },
    statusDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    statusIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    statusIconOnline: {
        backgroundColor: '#dcfce7',
    },
    statusIconOffline: {
        backgroundColor: '#fee2e2',
    },
    statusIconText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusTextContainer: {
        flex: 1,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '700',
    },
    statusLabelOnline: {
        color: '#22c55e',
    },
    statusLabelOffline: {
        color: '#ef4444',
    },
    statusDescription: {
        fontSize: 13,
        color: '#64748b',
    },
});
