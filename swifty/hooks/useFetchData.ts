const BASE_URL = "https://api.intra.42.fr";
const TOKEN_URL = `${BASE_URL}/oauth/token`;
const CLIENT_ID = process.env("CLIENT_ID");
const CLIENT_SECRET = process.env("CLIENT_SECRET");
const TOKEN_DATA = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

export async function getToken() {
    try {
        const response = await fetch(TOKEN_URL, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: TOKEN_DATA,
        });
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function useFetchData(token: string, url: string) {
    try {
        if (!token || !url)
            console.error("Error:");
        const response = await fetch(`${BASE_URL}/v2/users/${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}