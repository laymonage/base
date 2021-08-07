import { Parent } from 'unist';
import visit from 'unist-util-visit';

export default function processTaskListItem() {
  return (tree: Parent) => {
    visit(
      tree,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node: any): node is Parent =>
        node?.tagName === 'li' &&
        node?.properties?.className?.includes('task-list-item'),
      (
        node: Parent & { children: Array<{ properties?: { title: string } }> },
      ) => {
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
