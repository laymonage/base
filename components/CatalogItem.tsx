import cn from 'classnames';
import Image from 'next/image';
import PropTypes from 'prop-types';

export const propTypes = {
  id: PropTypes.number,
  url: PropTypes.string.isRequired,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    lowContrast: PropTypes.bool,
  }),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.string.isRequired),
};
export type Item = PropTypes.InferProps<typeof propTypes>;

const CatalogItem: React.FC<Item> = (item) => {
  return (
    <div className="flex flex-col items-center my-12 md:flex-row">
      {item.image && (
        <div className="w-9/12 p-2 mb-6 mr-0 rounded md:w-5/12 md:mb-0 md:mr-8">
          <div className="relative h-48 md:h-36">
            <Image
              className={cn('rounded', { 'dark:bg-white': item.image.lowContrast })}
              src={item.image.src}
              alt={item.title}
              title={item.title}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col justify-between w-full">
        <h3 className="text-3xl md:text-4xl">
          <a href={item.url} className="dark:text-blue-200" rel="noreferrer noopener nofollow">
            <strong>{item.title}</strong>
          </a>
        </h3>
        <div className="mt-2 md:text-base lg:text-lg">
          <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
          {item.details && item.details.length && (
            <ul className="mt-2 ml-8 text-base list-disc">
              {item.details.map((detail, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: detail }}></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
CatalogItem.propTypes = propTypes;
export default CatalogItem;
