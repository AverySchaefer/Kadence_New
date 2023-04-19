import { PageLayout } from '@/components';
import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/Social.module.css';

import { Avatar } from '@mui/material/';
import Link from 'next/link';

import { useState, useEffect } from 'react';

const fadeOutDurationMs = 500; // How long the fade out animation should take
const opacityDiffPerLoop = 2; // Subtracted each interval

export default function Social() {
    const [friendRequests, setFriendRequests] = useState([]);

    // Fetch requests
    useEffect(() => {
        NetworkAPI.get('/api/friends/getRequests', {
            username: localStorage.getItem('username'),
        }).then(({ data }) => {
            setFriendRequests(data.requests.map((req) => ({ ...req })));
        });
    }, []);

    // Set up loop to reduce opacity of finished objects
    useEffect(() => {
        const transparentLoop = setInterval(() => {
            setFriendRequests((prev) => {
                const reduced = prev.map((req) =>
                    typeof req.opacity === 'number'
                        ? { ...req, opacity: req.opacity - opacityDiffPerLoop }
                        : req
                );
                const filtered = reduced.filter(
                    (req) => req.opacity === undefined || req.opacity >= 0
                );

                return filtered;
            });
        }, fadeOutDurationMs / (100 / opacityDiffPerLoop));
        return () => clearInterval(transparentLoop);
    }, []);

    function handleActivity() {
        NetworkAPI.get('/api/activity/gatherLogs', {
            username: localStorage.getItem('username')
        }).then((result) => {
            console.log(result);
        });
    }

    function handleFriendRequest(isAcceptingRequest, senderUsername) {
        if (isAcceptingRequest) {
            // Accept pending friend request
            NetworkAPI.post('/api/friends/accept', {
                senderUsername,
                recipientUsername: localStorage.getItem('username'),
            }).then(() => {
                NetworkAPI.post('/api/activity/insert', {
                    username: senderUsername,
                    timestamp: new Date().toLocaleString(),
                    actionType: 'friend',
                    friend: localStorage.getItem('username'),
                    genMode: null,
                    saved: null,
                });

                NetworkAPI.post('/api/activity/insert', {
                    username: localStorage.getItem('username'),
                    timestamp: new Date().toLocaleString(),
                    actionType: 'friend',
                    friend: senderUsername,
                    genMode: null,
                    saved: null,
                });

                setFriendRequests((prev) =>
                    prev.map((req) =>
                        req.username === senderUsername
                            ? { ...req, opacity: 100 }
                            : req
                    )
                );
            });
        } else {
            // Deny pending friend request
            NetworkAPI.post('/api/friends/deny', {
                senderUsername,
                recipientUsername: localStorage.getItem('username'),
            }).then(() => {
                setFriendRequests((prev) =>
                    prev.map((req) =>
                        req.username === senderUsername
                            ? { ...req, opacity: 100 }
                            : req
                    )
                );
            });
        }
    }

    return (
        <PageLayout title="Social" activeTab="social">
            <main className={styles.main}>
                <div className={styles.section}>
                    <h3>Friend Requests ({friendRequests.length})</h3>
                    {friendRequests.length > 0 && (
                        <div className={styles.friendRequests}>
                            {friendRequests.map((request) => (
                                <div
                                    key={request.username}
                                    className={styles.friendRequest}
                                    style={{
                                        opacity:
                                            typeof request.opacity === 'number'
                                                ? `${request.opacity}%`
                                                : '100%',
                                    }}
                                >
                                    <Link href={`/profile/${request.username}`}>
                                        <div
                                            className={styles.friendRequestInfo}
                                        >
                                            <div className={styles.profilePic}>
                                                <Avatar
                                                    src={
                                                        request.profilePic ?? ''
                                                    }
                                                    alt="NS"
                                                    sx={{
                                                        backgroundColor:
                                                            '#4f378b',
                                                    }}
                                                >
                                                    {request.username[0].toUpperCase()}
                                                </Avatar>
                                            </div>
                                            <p className={styles.username}>
                                                {request.username}
                                            </p>
                                        </div>
                                    </Link>
                                    <div
                                        className={styles.friendRequestButtons}
                                    >
                                        <button
                                            className={
                                                styles.acceptRequestButton
                                            }
                                            onClick={() => {
                                                if (
                                                    request.opacity ===
                                                    undefined
                                                ) {
                                                    handleFriendRequest(
                                                        true,
                                                        request.username
                                                    );
                                                }
                                            }}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className={styles.denyRequestButton}
                                            onClick={() => {
                                                if (
                                                    request.opacity ===
                                                    undefined
                                                ) {
                                                    handleFriendRequest(
                                                        false,
                                                        request.username
                                                    );
                                                }
                                            }}
                                        >
                                            Deny
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.section}>
                    <h3>Friend Activity</h3>
                    <div>Friend Activity Box</div>
                    <button
                        className={styles.denyRequestButton}
                        onClick={handleActivity}
                    >  Get Friend Activity
                    </button>
                </div>
            </main>
        </PageLayout>
    );
}
