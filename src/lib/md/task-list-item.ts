import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

type ListItem = Parent & {
  tagName?: string;
  properties?: {
    className?: string;
  };
  children: Array<{
    properties?: {
      title: string;
    };
    value: string;
  }>;
};

export default function processTaskListItem() {
  return (tree: Parent) => {
    visit(
      tree,
      (node: Node): node is ListItem =>
        ((node as ListItem)?.tagName === 'li' &&
          (node as ListItem)?.properties?.className?.includes(
            'task-list-item',
          )) ||
        false,
      (node: ListItem) => {
        const { children } = node;
        const [input, , text] = children;
        // Add title tag to prevent accessibility issue.
        if (input && text && input.properties) {
          input.properties.title = text.value as string;
        }
      },
    );
  };
}
