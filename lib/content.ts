import fs from 'fs';
import path from 'path';
import { matter, md } from './markdown';
import { Content, ContentAttributes, Post, PostAttributes } from './models/content';

const dataDirectory = path.join(process.cwd(), 'data');

const getContentDirectory = (type: string) => path.join(dataDirectory, type);

export function getSortedContentData<A extends ContentAttributes = ContentAttributes>(
  type: string,
): Content[] {
  const contentDirectory = getContentDirectory(type);
  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData: Content[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');

    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const data = matterResult.data as A;

    return {
      slug,
      data,
    };
  });

  return allPostsData.sort((a, b) => (a.data.date < b.data.date ? 1 : -1));
}

export const getSortedPostsData = () => getSortedContentData<PostAttributes>('posts') as Post[];

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
