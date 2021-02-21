import PropTypes from 'prop-types';

export const postAttributesPropTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  toc: PropTypes.bool,
  comments: PropTypes.bool,
  draft: PropTypes.bool,
  description: PropTypes.string,
  image: PropTypes.string,
};

export const postPropTypes = {
  slug: PropTypes.string.isRequired,
  data: PropTypes.shape(postAttributesPropTypes).isRequired,
  content: PropTypes.string,
};

export type PostAttributes = PropTypes.InferProps<typeof postAttributesPropTypes>;
export type Post = PropTypes.InferProps<typeof postPropTypes>;
