import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';
import generateFitnessParams from '@/lib/generation/generateFitnessParams';

export default async function getFitnessRecommendations(prefData, heartrate) {
    const accessToken = await getSpotifyAccessToken();
    const searchParameters = await generateFitnessParams(prefData, heartrate);

    const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations?`;
    try {
        const response = await fetch(
            RECOMMENDATIONS_ENDPOINT + searchParameters,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const results = await response.json();
        return results.tracks;
    } catch (err) {
        console.log('Something went wrong fetching recs from Spotify');
        console.log(err);
        return null;
    }
}