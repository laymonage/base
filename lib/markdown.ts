import remark from 'remark';
import html from 'remark-html';

export const md = async (markup: string): Promise<string> =>
  (await remark().use(html).process(markup)).toString();
