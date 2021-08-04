export interface ContentAttributes {
  title: string;
  date?: string;
  tags?: string[];
  toc?: boolean;
  comments?: boolean;
  draft?: boolean;
  description?: string;
  image?: string;
}

export interface PostAttributes extends ContentAttributes {
  date: string;
  tags: string[];
  description: string;
}

export interface LogAttributes extends ContentAttributes {
  description: string;
  year: string;
  week: string;
}

export interface Content {
  slug: string;
  data: ContentAttributes;
  content?: string;
}

export interface Post extends Content {
  data: PostAttributes;
}

export interface Log extends Content {
  data: LogAttributes;
}
