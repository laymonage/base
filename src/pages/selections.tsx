import Layout from '@/components/Layout';
import SavedTracksTable from '@/components/SavedTracksTable';

export default function Selections() {
  return (
    <Layout
      customMeta={{ title: 'Selections', description: `Selections of things.` }}
    >
      <SavedTracksTable className="bleed w-full max-w-4xl place-self-center" />
    </Layout>
  );
}
