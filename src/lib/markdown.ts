import gm from 'gray-matter';
import yaml from 'js-yaml';
import remark from 'remark';
import gfm from 'remark-gfm';
import html from 'remark-html';

export const md = async (markup: string): Promise<string> =>
  (await remark().use(gfm).use(html).process(markup)).toString();

export const grayMatterEngines = {
  yaml: (s: string) =>
    // Prevent Date parsing
    yaml.safeLoad(s, { schema: yaml.JSON_SCHEMA }) as Record<string, unknown>,
};

export const matter = (fileContent: string): gm.GrayMatterFile<string> =>
  gm(fileContent, { engines: grayMatterEngines });
