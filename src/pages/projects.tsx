import { GetStaticProps } from 'next';
import Link from 'next/link';
import Card from '@/components/Card';
import Catalog from '@/components/Catalog';
import CatalogItem, { Item } from '@/components/CatalogItem';
import Layout from '@/components/Layout';
import projectData from '@/data/projects';
import { md } from '@/lib/markdown';

interface ProjectsData {
  projects: Array<{
    id: number;
    type: string;
    anchor: string;
    data: Item[];
  }>;
}

export const getStaticProps: GetStaticProps = async () => {
  const { projects } = projectData as ProjectsData;

  for (const group of projects) {
    for (const project of group.data) {
      project.description = await md(project.description);
    }
  }

  return {
    props: { projects },
  };
};

export default function Projects({ projects }: ProjectsData) {
  return (
    <Layout customMeta={{ title: 'Projects', description: `Selected projects by laymonage.` }}>
      {projects.map((group) => (
        <div className="w-full mx-auto mt-8 first:mt-0" key={group.id}>
          <Card
            header={
              <h2 id={group.anchor}>
                <Link href={`#${group.anchor}`}>
                  <a>{group.type} Projects</a>
                </Link>
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
        </div>
      ))}
    </Layout>
  );
}
