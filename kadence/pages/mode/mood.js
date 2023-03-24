import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';
import { Button, Card } from '@mui/material';
import { useState, useEffect } from 'react';
import NetworkAPI from '@/lib/networkAPI';
import styles from '@/styles/Home.module.css';

export default function MoodModeSetup() {
    const router = useRouter();

    return <PageLayout title="Mood Mode" prevLink="/home"></PageLayout>;
}
