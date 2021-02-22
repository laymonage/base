import { GetStaticProps } from 'next';
import Link from 'next/link';
import Card from '../components/Card';
import Catalog from '../components/Catalog';
import CatalogItem, { Item } from '../components/CatalogItem';
import Layout from '../components/Layout';
import projectData from '../data/projects';
import { md } from '../lib/markdown';

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
      if (project.details) {
        project.details = await Promise.all(project.details.map(md));
      }
    }
  }

  return {
    props: { projects },
  };
};

const Projects = ({ projects }: ProjectsData) => {
  return (
    <Layout title="Projects">
      <div className="w-full mx-auto md:w-11/12 lg:w-9/12 xl:w-7/12">
        {projects.map((group) => (
          <div className="mx-auto mt-16 first:mt-0" key={group.id}>
            <Card
              header={
                <Link href={`#${group.anchor}`}>
                  <a>
                    <h2 id={group.anchor}>{group.type} Projects</h2>
                  </a>
                </Link>
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
      </div>
    </Layout>
  );
};
export default Projects;
