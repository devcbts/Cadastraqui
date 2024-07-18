import axios from 'axios';

export default async function calculateDistance(origin: string, destination: string): Promise<number> {
    const apiKey ="AIzaSyAKV_bglPFDHMLhkliCFuzARUGBzDlNJNU";
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const distance = response.data.rows[0].elements[0].distance.value;
        return distance;
    } catch (error) {
        console.error('Error calculating distance:', error);
        throw error;
    }
}

// Exemplo de uso:
const origin = 'R. Carlos Gomes - Amargosa, BA, 45300-000';
const destination = 'R. Prudente de Morais, 114 - Centro, Santo Antônio de Jesus - BA, 44572-060';

calculateDistance(origin, destination)
    .then(distance => {
        console.log(`A distância entre ${origin} e ${destination} é de ${distance} metros.`);
    })
    .catch(error => {
        console.error('Error:', error);
    });