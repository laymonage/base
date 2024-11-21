import type { Element } from 'hast';
import { h } from 'hastscript';

export function copyButton() {
  return {
    name: 'l-copy-button',
    pre(node: Element) {
      delete node.properties.tabindex;
      node.children.push(h('l-copy-button'));
    },
  };
}
