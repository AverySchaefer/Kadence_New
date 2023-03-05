import PageLayout from '@/components/PageLayout';

export default function NewPage() {
    return (
        <PageLayout
            prevLink="/settings"
            player="spotify"
            footer={<button>Yo bros!</button>}
        >
            Hello!
        </PageLayout>
    );
}
