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

export async function getStaticProps(): Promise<{ props: ProjectsData }> {
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
}

const Projects: React.FC<ProjectsData> = ({ projects }) => {
  return (
    <Layout>
      <div className="mx-auto mt-2 mb-16 sm:mt-32">
        {projects.map((group) => (
          <div
            className="mx-auto mt-16 mb-2 md:w-11/12 lg:w-11/12 xl:w-9/12 first:mt-0"
            key={group.id}
          >
            <Card header={`${group.type} Projects`}>
              <Catalog
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
