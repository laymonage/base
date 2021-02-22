import PropTypes from 'prop-types';

export const propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  subtitle: PropTypes.node,
};
export type CardProps = PropTypes.InferProps<typeof propTypes>;

const Card: React.FC<CardProps> = ({ children, header, subtitle }) => {
  return (
    <div className="flex-col w-full p-6 bg-white rounded shadow-md sm:p-8 dark:bg-gray-800">
      {header && (
        <div className="flex flex-col items-baseline mb-8 text-4xl text-blue-800 dark:text-blue-200 md:text-5xl sm:flex-row">
          {header}
          {subtitle && <div className="text-2xl md:text-3xl">{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
Card.propTypes = propTypes;
export default Card;
