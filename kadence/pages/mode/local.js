import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';

export default function LocalModeSetup() {
    const router = useRouter();

    return <PageLayout title="Local Artist Mode" prevLink="/home"></PageLayout>;
}
