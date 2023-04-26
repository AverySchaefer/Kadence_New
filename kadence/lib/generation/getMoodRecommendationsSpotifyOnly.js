import generateMoodParamsSpotifyOnly from '@/lib/generation/generateMoodParamsSpotifyOnly';
import getCurrentSong from '@/lib/generation/getCurrentSong';
import refreshToken from '@/lib/spotify/refreshToken';

export default async function getMoodRecommendationsSpotifyOnly(token, chosenMood, prefData) {
    const { access_token: accessToken } = await refreshToken(token);
    const response = await getCurrentSong(token);
    const songItem = await response.json();
    const songSeedID = songItem.item.id;
    console.log(songSeedID);
    const searchParameters = await generateMoodParamsSpotifyOnly(
        prefData,
        songSeedID,
        chosenMood
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