import Card from '@/components/Card';
import Catalog from '@/components/Catalog';
import CatalogItem, { Item } from '@/components/CatalogItem';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import projectData from '@/data/projects';
import { md } from '@/lib/markdown';
import { InferGetStaticPropsType } from 'next';

interface ProjectsData {
  projects: Array<{
    id: number;
    type: string;
    anchor: string;
    data: Item[];
  }>;
}

export async function getStaticProps() {
  const { projects } = projectData as ProjectsData;

  for (const group of projects) {
    for (const project of group.data) {
      project.description = await md(project.description);
    }
  }

  return {
    props: { projects },
  };
}

export default function Projects({
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      customMeta={{
        title: 'Projects',
        description: `Selected projects by laymonage.`,
      }}
    >
      {projects.map((group) => (
        <Card
          className="w-full mx-auto my-16 first:mt-0"
          key={group.id}
          header={
            <h2 id={group.anchor}>
              <Link href={`#${group.anchor}`}>{group.type} Projects</Link>
            </h2>
          }
        >
          <Catalog
            border
            items={group.data.map((item) => (
              <CatalogItem key={item.id} {...item} />
            ))}
          />
        </Card>
      ))}
    </Layout>
  );
}
