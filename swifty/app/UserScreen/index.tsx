import { View, StyleSheet, Image, ScrollView, ActivityIndicator, SafeAreaView, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React from 'react';
import { useFetchData, getToken, checkIfTokenIsValid } from '@/hooks/useFetchData';
import { useEffect, useState } from 'react';
import { Card, Text, Avatar, ProgressBar, MD3Colors, Appbar } from 'react-native-paper';

interface Student {
    name: string;
    login: string;
    email: string;
    wallet: number;
    level: number;
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
            medium: string;
            large: string;
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
        level: number;
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
                if (result) { setData(result) }
                setLoading(false);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [input, token]);

    if (data && data.usual_full_name) {
        student = {
            name: data.usual_full_name,
            login: data.login,
            email: data.email,
            wallet: data.wallet,
            correction_point: data.correction_point,
            location: data.location,
            photo: data.image.versions.large,
            cursus_users: data.cursus_users,
            level: data.cursus_users[1]?.level || data.cursus_users[0]?.level,
            skills: data.cursus_users[1]?.skills.map(skill => `${skill.name} - ${skill.level} - ${(skill.level / 21 * 100).toFixed(2)}%`) || data.cursus_users[0]?.skills.map(skill => `${skill.name} - ${skill.level} - ${(skill.level / 21 * 100).toFixed(2)}%`),
            projects_users: data.projects_users,
        };
    }
    else {
        student = null;
    }

    const _goBack = () => {
        router.push('/');
    }

    return (
        <View style={styles.main}>
            <Appbar.Header>
                <Appbar.BackAction onPress={_goBack} />
                <Appbar.Content title={input} />
            </Appbar.Header>
            <SafeAreaView style={styles.container}>
                {loading && (
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator size="large" color="#0d1b2a" />
                    </View>
                )}
                {!loading && !student && <Text style={styles.noDataText}>No User found</Text>}
                {!loading && data && student && (
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Card>
                            <Card.Cover source={{ uri: student.photo }} />
                            <View style={{ padding: 10 }} />
                            <Card.Content>
                                <Text variant="titleLarge">{student.name} ({student.login})</Text>
                                <View style={{ padding: 5 }} />
                                <ProgressBar progress={student.level % 1} />
                                <Text variant="bodyMedium" >{student.level.toFixed(2)}</Text>
                                <View style={{ padding: 5 }} />
                                <Text variant="bodyMedium"><Text style={{ fontWeight: 'bold' }}>Email: </Text>{student.email}</Text>
                                <Text variant="bodyMedium"><Text style={{ fontWeight: 'bold' }}>Location: </Text>{student.location ? student.location : "Not available"}</Text>
                                <Text variant="bodyMedium"><Text style={{ fontWeight: 'bold' }}>Correction Points: </Text>{student.correction_point}</Text>
                                <Text variant="bodyMedium"><Text style={{ fontWeight: 'bold' }}>Wallet: </Text>{student.wallet}₳</Text>
                            </Card.Content>
                        </Card>
                        <View style={{ padding: 5 }} />
                        <Card>
                            <Card.Title
                                title="Skills"
                                titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
                                subtitle="List of skills and their levels"
                                subtitleStyle={{ color: "grey" }}
                                left={(props: any) => <Avatar.Icon {...props} icon="dumbbell" />}
                            />
                            <Card.Content>
                                {!student.skills.length && <Text variant="bodyMedium">No skills found...</Text>}
                                {student.skills.map((skill, index) => (
                                    <View key={index} style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{skill.split(' - ')[0]}</Text>
                                            <Text variant="bodyMedium">Level: {skill.split(' - ')[1]} | {skill.split(' - ')[2]}</Text><ProgressBar progress={parseInt(skill.split(' - ')[1]) / 21} />
                                        </View>
                                    </View>
                                ))}
                            </Card.Content>
                        </Card>
                        <View style={{ padding: 5 }} />
                        <Card>
                            <Card.Title
                                title="Projects"
                                titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
                                subtitle="List of projects and their status"
                                subtitleStyle={{ color: "grey" }}
                                left={(props: any) => <Avatar.Icon {...props} icon="abacus" />}
                            />
                            <Card.Content>
                                {!student.projects_users.length && <Text variant="bodyMedium">No projects found...</Text>}
                                <ScrollView style={{ maxHeight: 300 }}  contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled={true}>
                                    {student.projects_users.map((project, index) => (
                                        <View key={index} style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{project.project.name}</Text>
                                                <Text variant="bodyMedium">Status: {project.status}</Text>
                                            </View>
                                            <Text variant="bodyMedium" style={{ fontWeight: 'bold', marginLeft: 10 }}>
                                                {project.final_mark}
                                                {project.final_mark && '/100'}
                                                {project.status === 'finished' && project.final_mark > 65 && ' ✅'}
                                                {project.status === 'finished' && project.final_mark <= 65 && ' ❌'}
                                                {project.status === 'in_progress' && project.final_mark <= 0 && ' ⏳'}
                                                {project.status === 'in_progress' && project.final_mark == 100 && ' ✅'}
                                                {project.status === 'searching_a_group' && ' 🔍'}
                                                {project.status === 'waiting_for_correction' && ' 🕒'}
                                            </Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </Card.Content>
                        </Card>
                    </ScrollView>
                )
                }
            </SafeAreaView >
        </View >
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
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
        paddingHorizontal: 10,
    },
});
