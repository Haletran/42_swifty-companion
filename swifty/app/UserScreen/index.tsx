import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useFetchData, getToken } from '@/hooks/useFetchData';
import { useEffect, useState } from 'react';

interface Student {
    name: string;
    login: string;
    email: string;
    wallet: number;
    correction_point: number;
    location: string;
    photo: string;
    usual_full_name: string;
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
    image: {
        versions: {
            small: string;
        };
    };
}

export default function UserScreen() {
    const { input } = useLocalSearchParams<{ input: string }>();
    const [data, setData] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string>("");

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
                console.log("Here");
                const result = await useFetchData(token, input);
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

    let student: Student | null = null;
    if (data) {
        student = {
            name: data.usual_full_name,
            usual_full_name: data.usual_full_name,
            login: data.login,
            email: data.email,
            wallet: data.wallet,
            correction_point: data.correction_point,
            location: data.location,
            photo: data.image.versions.small,
            image: data.image,
            cursus_users: data.cursus_users,
            skills: data.cursus_users[1].skills.map(skill => `${skill.name} - ${skill.level}`),
            projects_users: data.projects_users,
        };
    }

    return (
        <View style={styles.container}>
            {loading && <Text>Loading...</Text>}
            {!loading && !data && <Text>No data found</Text>}
            {!loading && data && student && (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Image source={{ uri: student.photo }} style={{ width: 100, height: 100 }} />
                    <Text>Name: {student.name}</Text>
                    <Text>Login: {student.login}</Text>
                    <Text>Email: {student.email}</Text>
                    <Text>Wallet: {student.wallet}</Text>
                    <Text>Skills: </Text>
                    {student.skills.map((skill, index) => (
                        <Text key={index}>{skill}</Text>
                    ))}
                    <Text>Projects:</Text>
                    {student.projects_users.map((project, index) => (
                        <Text key={index}>{project.project.name} - Mark: {project.final_mark} - Status: {project.status}</Text>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
});
