import PageLayout from '@/components/PageLayout';
import MusicPlayer from '@/components/MusicPlayer';

export default function largePlayer() {
    return (
        <PageLayout title="" includeNav={true}>
            <div style={{ overflow: 'hidden', height: '100%' }}>
                <MusicPlayer size="large" type="spotify" />
            </div>
        </PageLayout>
    );
}
