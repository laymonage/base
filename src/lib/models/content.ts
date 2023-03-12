export interface ReadingTime {
  minutes: number;
  time: number;
  words: number;
  text: string;
}

export interface ContentAttributes {
  title: string;
  readingTime: ReadingTime;
  date?: string;
  tags?: string[];
  toc?: boolean;
  comments?: true | false | 'eager';
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
