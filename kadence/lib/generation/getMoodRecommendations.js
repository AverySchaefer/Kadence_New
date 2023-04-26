import generateMoodParams from '@/lib/generation/generateMoodParams';
import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';

export default async function getMoodRecommendations(prefData, chosenMood) {
    const accessToken = await getSpotifyAccessToken();
    const searchParameters = await generateMoodParams(prefData, chosenMood);
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
