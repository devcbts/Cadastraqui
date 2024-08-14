import { env } from '@/env';
import axios from 'axios';

export default async function calculateDistance(origin: string, destination: string): Promise<number> {
    const apiKey = env.MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const distance = response.data?.rows[0]?.elements[0]?.distance?.value;
        return distance;
    } catch (error) {
        console.error('Error calculating distance:', error);
        throw error;
    }
}

