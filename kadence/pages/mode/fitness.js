import { useRouter } from 'next/router';
import { PageLayout } from '@/components/';

export default function FitnessModeSetup() {
    const router = useRouter();

    return <PageLayout title="Fitness Mode" prevLink="/home"></PageLayout>;
}
