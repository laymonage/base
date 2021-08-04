import fs from 'fs';
import path from 'path';
import { matter, md } from './markdown';
import {
  Content,
  ContentAttributes,
  Log,
  LogAttributes,
  Post,
  PostAttributes,
} from './models/content';
import { parseLogSlug } from './string';

const dataDirectory = path.join(process.cwd(), 'data');

const getContentDirectory = (type: string) => path.join(dataDirectory, type);

export function getSortedContentData<A extends ContentAttributes = ContentAttributes>(
  type: string,
  slugParser?: (slug: string) => Record<string, unknown>,
): Content[] {
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
  });
}

export const getSortedPostsData = () => getSortedContentData<PostAttributes>('posts') as Post[];

export const getSortedLogsData = () =>
  getSortedContentData<LogAttributes>('logs', parseLogSlug) as Log[];

export const getGroupedLogsData = () => {
  const sortedLogs = getSortedLogsData();
  const groupedLogs = groupBy(sortedLogs, 'year');
  return sortGroup(groupedLogs);
};

export function getAllContentSlugs(type: string): Array<{ params: { slug: string } }> {
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

export const getAllPostSlugs = () => getAllContentSlugs('posts');

export const getAllLogSlugs = () => getAllContentSlugs('logs');

export async function getContentData<A extends ContentAttributes = ContentAttributes>(
  slug: string,
  type?: string,
) {
  const fullPath = path.join(dataDirectory, type || '', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const data = matterResult.data as A;

  const processedContent = await md(matterResult.content);
  const content = processedContent.toString();

  return {
    slug,
    data,
    content,
  } as Content;
}

export const getPostData = async (slug: string) =>
  (await getContentData<PostAttributes>(slug, 'posts')) as Post;

export const getLogData = async (slug: string) =>
  (await getContentData<LogAttributes>(slug, 'logs')) as Log;

export const groupBy = <T extends Content>(arr: T[], key: string): { [key: string]: T[] } =>
  arr.reduce((acc, current) => {
    const groupingKey = current.data[key as keyof ContentAttributes] as string;
    acc[groupingKey] = acc[groupingKey] || [];
    acc[groupingKey].push(current);
    return acc;
  }, Object.create(null));

export const sortGroup = <T extends Content>(group: { [key: string]: T[] }) => {
  return Object.entries(group).sort(([keyA], [keyB]) => (keyA < keyB ? 1 : -1));
};
