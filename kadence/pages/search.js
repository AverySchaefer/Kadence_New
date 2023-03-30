import { Dialog } from '@capacitor/dialog';

import Link from 'next/link';
import { Avatar } from '@mui/material/';
import { BiSearchAlt } from 'react-icons/bi';
import ClearIcon from '@mui/icons-material/Clear';

import { useState, useEffect, useCallback } from 'react';

import styles from '@/styles/Search.module.css';

import NetworkAPI from '@/lib/networkAPI';
import debounce from '@/lib/debounce';
import PageLayout from '@/components/PageLayout';

export default function Search() {
    const [query, setQuery] = useState('');
    const [matches, setMatches] = useState([]);

    function fetchMatches(searchedUsername) {
        NetworkAPI.get('/api/users/search', { username: searchedUsername })
            .then(({ data }) => {
                setMatches(data.results);
            })
            .catch((err) => {
                Dialog.alert({
                    title: 'Error',
                    message: `An error occurred while querying the database: ${err.message}.`,
                });
            });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetchMatches = useCallback(debounce(fetchMatches, 250), []);
    useEffect(() => {
        if (query === '') {
            setMatches([]);
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
            <div className={styles.searchContainer}>
                <div className={styles.searchBarContainer}>
                    <div className={styles.icon}>
                        <BiSearchAlt />
                    </div>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search for users"
                            value={query}
                            onChange={(e) => setQuery(e.target.value.trim())}
                        />
                    </div>
                    <div className={styles.icon}>
                        <ClearIcon onClick={() => setQuery('')} />
                    </div>
                </div>
                <div className={styles.searchResults}>
                    {matches.map((match) => (
                        <Link
                            key={match.username}
                            href={`/profile/${match.username}`}
                        >
                            <div className={styles.searchResult}>
                                <div className={styles.profilePic}>
                                    <Avatar
                                        src={match.profilePic ?? ''}
                                        alt="NS"
                                        sx={{
                                            backgroundColor: '#4f378b',
                                        }}
                                    >
                                        {match.username[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className={styles.userInfo}>
                                    <p className={styles.username}>
                                        {match.username}
                                    </p>
                                    <p className={styles.bio}>{match.bio}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
