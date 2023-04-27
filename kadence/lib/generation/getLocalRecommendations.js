import refreshToken from '@/lib/spotify/refreshToken';
import generateLocalParams from '@/lib/generation/generateLocalParams';
import getCurrentSong from '@/lib/generation/getCurrentSong';

export default async function getLocalRecommendations(token, prefData) {
    const { access_token: accessToken } = await refreshToken(token);
    const response = await getCurrentSong(token);
    const songItem = await response.json();
    const songSeedID = songItem.item.id;
    console.log(songSeedID);
    const searchParameters = await generateLocalParams(
        songSeedID,
        prefData,
    );

    const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations?`;
    try {
        const recs = await fetch(
            RECOMMENDATIONS_ENDPOINT + searchParameters,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const results = await recs.json();

        return results.tracks;
    } catch (err) {
        console.log('Something went wrong fetching recs from Spotify');
        console.log(err);
        return null;
    }
}