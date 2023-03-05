import { Header, BottomNav } from '@/components/';
import NetworkAPI from '@/lib/networkAPI';
import { Dialog } from '@capacitor/dialog';
import { Inter } from '@next/font/google';
import Link from 'next/link';

import styles from '@/styles/Search.module.css';
import { Avatar } from '@mui/material/';

import { useState, useEffect, useCallback } from 'react';
import debounce from '@/lib/debounce';
import PageLayout from '@/components/PageLayout';

const inter = Inter({ subsets: ['latin'] });

export default function Search() {
    const [query, setQuery] = useState('');
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    function fetchMatches(searchedUsername) {
        setLoading(true);
        NetworkAPI.get('/api/users/search', { username: searchedUsername })
            .then(({ data }) => {
                setMatches(data.results);
            })
            .catch((err) => {
                Dialog.alert({
                    title: 'Error',
                    message: `An error occurred while querying the database: ${err.message}.`,
                });
            })
            .finally(() => setLoading(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetchMatches = useCallback(debounce(fetchMatches, 250), []);
    useEffect(() => {
        if (query === '') {
            setMatches([]);
            setLoading(false);
        } else {
            debouncedFetchMatches(query);
        }
    }, [query, debouncedFetchMatches]);

    // Second check in case race condition leaves query field empty
    // but still shows results (doesn't make sense)
    useEffect(() => {
        if (query === '' && matches.length > 0) {
            setMatches([]);
        }
    }, [query, matches]);

    return (
        <PageLayout activeTab="search" title="Search">
            <main className={styles.main}>
                <div className={styles.searchBarContainer}>
                    <input
                        type="text"
                        placeholder="Search for users"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.trim())}
                    />
                </div>
                <h2 className={styles.resultsHeader}>Results</h2>

                {matches.length === 0 || loading || query === '' ? (
                    <div>
                        {loading ? 'Loading results...' : 'No results found!'}
                    </div>
                ) : (
                    <div className={styles.searchResults}>
                        {matches.map((match) => (
                            <Link
                                key={match.username}
                                className={styles.searchResult}
                                href={`/profile/${match.username}`}
                            >
                                <div className={styles.profilePic}>
                                    <Avatar
                                        alt="NS"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#888',
                                        }}
                                    >
                                        {match.username[0].toUpperCase()}
                                    </Avatar>
                                    {/* {match.profilePic} */}
                                </div>
                                <div>{match.username}</div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </PageLayout>
    );
}
