import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useFetchData } from '@/hooks/useFetchData';
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


    useEffect(() => {
        const fetchData = async () => {
            const result = await useFetchData(input);
            setData(result);
            setLoading(false);
        };

        fetchData();
    }, [input]);

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
        };
    }

    return (
        <View style={styles.container}>
            {loading && <Text>Loading...</Text>}
            {!loading && !data && <Text>No data found</Text>}
            {!loading && data && student && (
                <>
                    <Image source={{ uri: student.photo }} style={{ width: 100, height: 100 }} />
                    <Text>Name: {student.name}</Text>
                    <Text>Login: {student.login}</Text>
                    <Text>Email: {student.email}</Text>
                    <Text>Wallet: {student.wallet}</Text>
                    <Text>Correction Points: {student.correction_point}</Text>
                    <Text>Location: {student.location}</Text>
                </>
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
});
