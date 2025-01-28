import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useFetchData, getToken, checkIfTokenIsValid } from '@/hooks/useFetchData';
import { useEffect, useState } from 'react';

interface Student {
    name: string;
    login: string;
    email: string;
    wallet: number;
    correction_point: number;
    location: string;
    photo: string;
    projects_users: Array<{
        project: {
            name: string;
        };
        final_mark: number;
        status: string;
    }>;
    skills: string[];
    cursus_users: {
        skills: {
            name: string;
            level: number;
        }[];
    }[];
}

interface ApiResponse {
    usual_full_name: string;
    login: string;
    email: string;
    wallet: number;
    correction_point: number;
    location: string;
    image: {
        versions: {
            small: string;
        };
    };
    projects_users: Array<{
        project: {
            name: string;
        };
        final_mark: number;
        status: string;
    }>;
    cursus_users: {
        skills: {
            name: string;
            level: number;
        }[];
    }[];
}



export default function UserScreen() {
    const { input } = useLocalSearchParams<{ input: string }>();
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string>("");
    let student: Student | null = null;

    const fetchData = async () => {
        try {
            if (!token) {
                const newToken = await getToken();
                if (newToken) {
                    setToken(newToken);
                } else {
                    console.error("Failed to get token");
                }
            }
            if (token) {
                if (await checkIfTokenIsValid(token) == false) {
                    const newToken = await getToken();
                    if (newToken) {
                        setToken(newToken);
                    } else {
                        console.error("Failed to get token");
                    }
                }
                const result = await useFetchData(token, input);
                console.log(result);
                setData(result);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [input, token]);

    if (data) {
        student = {
            name: data.usual_full_name,
            login: data.login,
            email: data.email,
            wallet: data.wallet,
            correction_point: data.correction_point,
            location: data.location,
            photo: data.image.versions.small,
            cursus_users: data.cursus_users,
            skills: data.cursus_users[1].skills.map(skill => `${skill.name} - ${skill.level}`),
            projects_users: data.projects_users,
        };
    }

    return (
        <SafeAreaView style={styles.container}>
            {loading && (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#0d1b2a" />
                </View>
            )}
            {!loading && !data && <Text style={styles.noDataText}>No data found</Text>}
            {!loading && data && student && (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.profileCard}>
                        <Image source={{ uri: student.photo }} style={styles.img} />
                        <View style={styles.profileDetails}>
                            <Text style={styles.label}>Name:</Text>
                            <Text style={styles.value}>{student.name}</Text>
                            <Text style={styles.label}>Login:</Text>
                            <Text style={styles.value}>{student.login}</Text>
                            <Text style={styles.label}>Location:</Text>
                            {student.location ? <Text style={styles.value}>{student.location}</Text> : <Text style={styles.value}>Unavailable</Text>}
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{student.email}</Text>
                            <Text style={styles.label}>Wallet:</Text>
                            <Text style={styles.value}>{student.wallet}₳</Text>
                        </View>
                    </View>
                    <View style={{ height: 20 }} />
                    <View style={styles.profileCard}>
                        <Text style={styles.label}>Skills:</Text>
                        {student.skills.map((skill, index) => (
                            <Text key={index} style={styles.value}>
                                {skill}
                            </Text>
                        ))}
                    </View>
                    <View style={{ height: 20 }} />
                    <View style={styles.profileCard}>
                        <Text style={styles.label}>Projects:</Text>
                        {student.projects_users.map((project, index) => (
                            <Text key={index} style={styles.value}>
                                {project.project.name} - Mark: {project.final_mark} - Status: {project.status}
                            </Text>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        marginTop: 20,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    scrollContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        padding: 16,
        alignItems: 'center',
        width: '90%',
    },
    img: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    profileDetails: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
    },
    value: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
});
