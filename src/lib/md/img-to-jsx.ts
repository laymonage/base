// https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/typescript/lib/img-to-jsx.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parent, Node, Literal } from 'unist';
import visit from 'unist-util-visit';
import sizeOf from 'image-size';
import fs from 'fs';

export default function imgToJsx() {
  return (tree: Node) => {
    visit<Node>(
      tree,
      // only visit p tags that contain an img element
      (node: any): node is Parent =>
        node.type === 'paragraph' &&
        node.children.some((n: Node) => n.type === 'image'),
      (node: any) => {
        type ImageNode = Parent & {
          url: string;
          alt: string;
          name: string;
          attributes: (Literal & { name: string })[];
        };
        const imageNode = node.children.find(
          (n: Node) => n.type === 'image',
        ) as ImageNode;

        // only local files
        if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
          const dimensions = sizeOf(`${process.cwd()}/public${imageNode.url}`);

          // Convert original node to next/image
          imageNode.type = 'mdxJsxFlowElement';
          imageNode.name = 'Image';
          imageNode.attributes = [
            { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
            { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
            { type: 'mdxJsxAttribute', name: 'title', value: imageNode.title },
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

          // Add className for easier styling
          if (!node.data) node.data = {};
          node.data.hProperties = {
            className: 'mdx-image',
          };

          // Change node type from p to div to avoid nesting error
          node.type = 'div';
          node.children = [imageNode];
        }
      },
    );
  };
}
