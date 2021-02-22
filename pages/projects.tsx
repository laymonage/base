import { GetStaticProps } from 'next';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Card from '../components/Card';
import Catalog from '../components/Catalog';
import CatalogItem, { propTypes as itemPropTypes } from '../components/CatalogItem';
import Layout from '../components/Layout';
import projectData from '../data/projects';
import { md } from '../lib/markdown';

const propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      anchor: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)),
    }),
  ),
};

type ProjectsData = PropTypes.InferProps<typeof propTypes>;

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

const Projects: React.FC<ProjectsData> = ({ projects }) => {
  return (
    <Layout title="Projects">
      <div className="w-full mx-auto mb-16 sm:mt-32 sm:mb-0 md:w-11/12 lg:w-9/12 xl:w-7/12">
        {projects.map((group) => (
          <div className="mx-auto mt-16 mb-16 first:mt-0" key={group.id}>
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
Projects.propTypes = propTypes;
export default Projects;
