// https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/typescript/lib/img-to-jsx.ts

import { Parent, Node, Literal } from 'unist';
import { visit } from 'unist-util-visit';
import sizeOf from 'image-size';
import fs from 'fs';

type ImageNode = Parent & {
  url: string;
  alt: string;
  name: string;
  title: string;
  attributes: (Literal & { name: string })[];
};

export default function imgToJsx() {
  return (tree: Node) => {
    visit(
      tree,
      (node: Node<object>): node is Parent =>
        (node.type === 'paragraph' || node.type === 'linkReference') &&
        (node as ImageNode).children?.some((n) => n.type === 'image'),
      (node: Parent, _, parent) => {
        const imageNode = node.children.find(
          (n) => n.type === 'image',
        ) as ImageNode;

        // only local files
        const fileUrl = `${process.cwd()}/public${imageNode.url}`;
        if (!fs.existsSync(fileUrl)) return;

        const dimensions = sizeOf(fileUrl);

        const title = imageNode.title || imageNode.alt;

        // Convert original node to next/image
        imageNode.type = 'mdxJsxFlowElement';
        imageNode.name = 'Image';
        imageNode.attributes = [
          { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
          { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
          { type: 'mdxJsxAttribute', name: 'title', value: title },
          {
            type: 'mdxJsxAttribute',
            name: 'width',
            value: dimensions.width,
          },
          {
            type: 'mdxJsxAttribute',
            name: 'height',
            value: dimensions.height,
          },
        ];

        const isParagraph = node.type === 'paragraph';
        const targetNode = isParagraph ? node : (parent as Parent);

        // Add className for easier styling
        if (!targetNode.data) targetNode.data = {};
        targetNode.data.hProperties = {
          className: 'mdx-image',
        };
        targetNode.type = 'div';

        // Change node type from p to div to avoid nesting error
        if (isParagraph) {
          node.children = [imageNode];
        }
      },
    );
  };
}
