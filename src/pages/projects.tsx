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
    shown: boolean;
    type: string;
    anchor: string;
    data: Item[];
  }>;
}

export async function getStaticProps() {
  const { projects: rawProjects } = projectData as ProjectsData;

  const projects = await Promise.all(
    rawProjects
      .filter(({ shown }) => shown)
      .map(async ({ data, ...groupRest }) => ({
        ...groupRest,
        data: await Promise.all(
          data
            .filter(({ shown }) => shown)
            .map(async (item) => ({
              ...item,
              description: await md(item.description),
            })),
        ),
      })),
  );

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
