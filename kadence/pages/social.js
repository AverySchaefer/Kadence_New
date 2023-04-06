import { PageLayout } from '@/components';
import NetworkAPI from '@/lib/networkAPI';

import { useState, useEffect } from 'react';

export default function Social() {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        NetworkAPI.get('/api/friends/getRequests', {
            username: localStorage.getItem('username'),
        }).then(({ data }) => {
            setFriendRequests(data.requests);
        });
    }, []);

    return (
        <PageLayout title="Social" activeTab="social">
            <p>Notifications</p>
            <div>
                <ul>
                    {friendRequests.map((request) => (
                        <li key={request}>{request}</li>
                    ))}
                </ul>
            </div>
            <p>Friend Activity</p>
            <div>Friend Activity Box</div>
        </PageLayout>
    );
}
