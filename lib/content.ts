import fs from 'fs';
import path from 'path';
import { matter, md } from './markdown';
import { Post, PostAttributes } from './models/content';

const postsDirectory = path.join(process.cwd(), 'data', 'posts');

export function getSortedPostsData(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: Post[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const data = matterResult.data as PostAttributes;

    return {
      slug,
      data,
    };
  });

  return allPostsData.sort((a, b) => (a.data.date < b.data.date ? 1 : -1));
}

export function getAllPostSlugs(): Array<{ params: { slug: string } }> {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const data = matterResult.data as PostAttributes;

  const processedContent = await md(matterResult.content);
  const content = processedContent.toString();

  return {
    slug,
    data,
    content,
  };
}
