import getSpotifyAccessToken from '@/lib/spotify/getSpotifyAccessToken';
import generateIntervalParams from '@/lib/generation/generateIntervalParams';

export default async function getIntervalRecommendations(prefData, intervalStatus) {
    const accessToken = await getSpotifyAccessToken();
    const searchParameters = generateIntervalParams(prefData, intervalStatus);

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