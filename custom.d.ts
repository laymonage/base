import { DOMAttributes } from 'react';

/// <reference types="next-react-svg" />

type BooleanString = '0' | '1';

interface GiscusWidget {
  repo: `${string}/${string}`;
  repoid: string;
  category?: string;
  categoryid: string;
  theme: string;
  mapping: string;
  reactionsenabled: BooleanString;
  emitmetadata: BooleanString;
  inputposition: 'top' | 'bottom';
  lang: string;
}

type CustomElement<T> = T & DOMAttributes<T> & { children?: unknown };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['giscus-widget']: CustomElement<GiscusWidget>;
    }
  }
}
