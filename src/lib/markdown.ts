import gm from '@gr2m/gray-matter';
import yaml from 'js-yaml';
import { unified } from 'unified';
import parse from 'remark-parse';
import gfm from 'remark-gfm';
import html from 'remark-html';

export const md = async (markup: string): Promise<string> =>
  (await unified().use(parse).use(gfm).use(html).process(markup)).toString();

export const grayMatterEngines = {
  yaml: (s: string) =>
    // Prevent Date parsing
    yaml.load(s, { schema: yaml.JSON_SCHEMA }) as Record<string, unknown>,
};

export const matter = (fileContent: string): gm.GrayMatterFile<string> =>
  gm(fileContent, { engines: grayMatterEngines });
