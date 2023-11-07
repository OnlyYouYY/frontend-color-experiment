import axios from "axios";

const API_URL = "http://localhost:3000/api";

export async function fetchColors() {
    try {
        const response = await fetch(`${API_URL}/colors/`);
        if (!response.ok) {
            throw new Error("Error al obtener datos de la API");
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function fetchMessage() {
    try {
        const response = await fetch(`${API_URL}/messages/`);
        if (!response.ok) {
            throw new Error("Error al obtener las frases");
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function postReaction(data) {
    try {
        const response = await fetch(`${API_URL}/reactions/createReaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getIpAddress() {
    try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const ipAddress = response.data.ip;
        return ipAddress;
    } catch (error) {
        console.error("Error al obtener la dirección IP:", error);
        return null;
    }
}
