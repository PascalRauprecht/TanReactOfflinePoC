import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

import { onlineManager } from '@tanstack/react-query';

const OfflineSimulator = () => {
    const [isOnline, setIsOnline] = useState(onlineManager.isOnline());
    const [networkAvailable, setNetworkAvailable] = useState(true);

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
            if (isNetworkAvailable) {
                onlineManager.setOnline(true);
                setIsOnline(true);
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

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>
                <Pressable
                    style={({ pressed }) => [styles.button, isOnline && styles.activeButton, pressed && styles.buttonPressed]}
                    onPress={() => {
                        onlineManager.setOnline(true);
                        setIsOnline(onlineManager.isOnline());
                    }}
                >
                    <Text style={[styles.buttonText, isOnline && styles.activeButtonText]}>Online</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.button, !isOnline && styles.activeButton, pressed && styles.buttonPressed]}
                    onPress={() => {
                        onlineManager.setOnline(false);
                        setIsOnline(onlineManager.isOnline());
                    }}
                >
                    <Text style={[styles.buttonText, !isOnline && styles.activeButtonText]}>Offline</Text>
                </Pressable>
            </View>
            <View style={styles.statusContainer}>
                <View style={[styles.statusDot, isOnline ? styles.onlineDot : styles.offlineDot]} />
                <Text style={styles.statusText}>{isOnline ? 'Connected' : 'Offline'}</Text>
            </View>
        </View>
    );
};

export default OfflineSimulator;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#f1f5f9',
        minWidth: 100,
        alignItems: 'center',
    },
    buttonPressed: {
        opacity: 0.8,
    },
    activeButton: {
        backgroundColor: '#0ea5e9',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    activeButtonText: {
        color: '#ffffff',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    onlineDot: {
        backgroundColor: '#22c55e',
    },
    offlineDot: {
        backgroundColor: '#ef4444',
    },
    statusText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
});
