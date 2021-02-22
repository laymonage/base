import PropTypes from 'prop-types';

export const propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  border: PropTypes.bool,
};
export type Items = PropTypes.InferProps<typeof propTypes>;

const Catalog: React.FC<Items> = ({ items, border }) => {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={index}>
          {border && index !== 0 && <div className="w-full mx-auto border" />}
          {item}
        </li>
      ))}
    </ol>
  );
};
Catalog.propTypes = propTypes;
export default Catalog;
