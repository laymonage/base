import fs from 'fs';
import path from 'path';
import { matter, md } from './markdown';
import {
  Content,
  ContentAttributes,
  Log,
  LogAttributes,
} from './models/content';
import { parseLogSlug } from './string';

const baseContentDirectory = path.join(process.cwd(), 'content');

const getContentDirectory = (type: string) =>
  path.join(baseContentDirectory, type);

export function getSortedContentMetadata<
  A extends ContentAttributes = ContentAttributes,
  C extends Content = Content,
>(type: string, slugParser?: (slug: string) => Record<string, unknown>) {
  const contentDirectory = getContentDirectory(type);
  const fileNames = fs.readdirSync(contentDirectory);

  const allPostsData: Content[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const extraAttributes = slugParser ? slugParser(slug) : {};

    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const data = matterResult.data as A;

    return {
      slug,
      data: { ...data, ...extraAttributes },
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.data.date && b.data.date) {
      return a.data.date < b.data.date ? 1 : -1;
    }
    return a.slug < b.slug ? 1 : -1;
  }) as unknown as C[];
}

export const getGroupedLogsMetadata = () => {
  const logs = getSortedContentMetadata<LogAttributes, Log>(
    'logs',
    parseLogSlug,
  );
  return groupSortContent(logs, 'year');
};

export function getAllContentSlugs(
  type: string,
): Array<{ params: { slug: string } }> {
  const contentDirectory = getContentDirectory(type);
  const fileNames = fs.readdirSync(contentDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getSingleContentData<
  A extends ContentAttributes = ContentAttributes,
  C extends Content = Content,
>(slug: string, type?: string) {
  const fullPath = path.join(baseContentDirectory, type || '', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const data = matterResult.data as A;

  const processedContent = await md(matterResult.content);
  const content = processedContent.toString();

  return {
    slug,
    data,
    content,
  } as unknown as C;
}

export const groupBy = <T extends Content>(
  arr: T[],
  key: string,
): { [key: string]: T[] } =>
  arr.reduce((acc, current) => {
    const groupingKey = current.data[key as keyof ContentAttributes] as string;
    acc[groupingKey] = acc[groupingKey] || [];
    acc[groupingKey].push(current);
    return acc;
  }, Object.create(null));

export const sortGroup = <T extends Content>(group: { [key: string]: T[] }) => {
  return Object.entries(group).sort(([keyA], [keyB]) => (keyA < keyB ? 1 : -1));
};

export const groupSortContent = <C extends Content = Content>(
  content: C[],
  by: string,
) => sortGroup(groupBy(content, by));
