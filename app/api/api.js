const API_URL = 'http://localhost:3000/api'

export async function fetchColors() {
    try {
        const response = await fetch(`${API_URL}/colors/`);
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
            
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}
