import cn from 'classnames';
import Image from 'next/image';

export interface Item {
  id: number;
  url: string;
  image: {
    src: string;
    lowContrast: boolean;
  };
  title: string;
  description: string;
  details: string[];
}

const CatalogItem = (item: Item) => {
  return (
    <div className="flex flex-col items-center my-4 sm:flex-row">
      {item.image && (
        <div className="w-9/12 p-2 mb-6 mr-0 rounded sm:w-5/12 sm:mb-0 sm:mr-8">
          <div className="relative h-48 sm:h-36">
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
        <h3 className="text-2xl">
          <a href={item.url} className="dark:text-blue-200" rel="noreferrer noopener nofollow">
            <strong>{item.title}</strong>
          </a>
        </h3>
        <div className="mt-2">
          <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
        </div>
      </div>
    </div>
  );
};
export default CatalogItem;
