export interface PostAttributes {
  title: string;
  date: string;
  tags: string[];
  toc: boolean;
  comments: boolean;
  draft: boolean;
  description: string;
  image: string;
}

export interface Post {
  slug: string;
  data: PostAttributes;
  content?: string;
}
