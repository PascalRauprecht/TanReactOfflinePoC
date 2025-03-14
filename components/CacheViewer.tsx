import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CacheViewer = () => {
    const [cacheData, setCacheData] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchCacheData = async () => {
            try {
                setIsLoading(true);
                const data = await AsyncStorage.getItem('REACT_QUERY_OFFLINE_CACHE');
                setCacheData(data);
            } catch (error) {
                console.error('Error fetching cache data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCacheData();

        // Clean up interval on component unmount
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, []);

    const toggleExpand = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);

        // Set up or clear the refresh interval based on expanded state
        if (newExpandedState) {
            refreshCache(); // Refresh immediately when expanding
            refreshIntervalRef.current = setInterval(refreshCache, 100); // Refresh every second
        } else if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
    };

    const refreshCache = async () => {
        try {
            // Don't set loading to true for automatic refreshes to avoid flickering
            const data = await AsyncStorage.getItem('REACT_QUERY_OFFLINE_CACHE');
            setCacheData(data);
        } catch (error) {
            console.error('Error refreshing cache data:', error);
        }
    };

    // Format JSON for better display
    const formatJSON = (jsonString: string | null) => {
        if (!jsonString) return 'No cache data available';
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return jsonString;
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={toggleExpand} activeOpacity={0.7}>
                <Text style={styles.headerText}>React Query Cache {isExpanded ? '▲' : '▼'}</Text>
                {/* {!isExpanded && (
                    <TouchableOpacity style={styles.refreshButton} onPress={refreshCache} activeOpacity={0.7}>
                        <Text style={styles.refreshButtonText}>↻</Text>
                    </TouchableOpacity>
                )} */}
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.contentContainer}>
                    {isLoading ? (
                        <Text style={styles.loadingText}>Loading cache data...</Text>
                    ) : (
                        <View style={styles.actionsContainer}>
                            {/* <TouchableOpacity 
                style={styles.actionButton} 
                onPress={refreshCache}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>Refresh Cache</Text>
              </TouchableOpacity> */}

                            <ScrollView style={styles.codeContainer}>
                                <Text style={styles.codeText}>{formatJSON(cacheData)}</Text>
                            </ScrollView>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f1f5f9',
    },
    headerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    contentContainer: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    codeContainer: {
        maxHeight: 600,
        backgroundColor: '#1e293b',
        padding: 12,
        borderRadius: 6,
        marginTop: 8,
    },
    codeText: {
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#f8fafc',
    },
    loadingText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        padding: 12,
    },
    actionsContainer: {
        marginBottom: 8,
    },
    actionButton: {
        backgroundColor: '#0ea5e9',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 8,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    refreshButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshButtonText: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '600',
    },
});

export default CacheViewer;
