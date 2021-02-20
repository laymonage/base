import PropTypes from 'prop-types';

interface CardProps {
  children: React.ReactNode;
  header: React.ReactNode;
  subtitle: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, header, subtitle }) => {
  return (
    <div className="flex-col w-full p-6 transition-colors duration-500 bg-white rounded shadow-md sm:p-8 dark:bg-gray-800 ease">
      <div className="flex flex-col items-baseline text-4xl text-blue-800 mb-14 dark:text-blue-200 md:text-5xl sm:flex-row">
        {header}
        <div className="text-2xl md:text-3xl">{subtitle}</div>
      </div>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  subtitle: PropTypes.node,
};

export default Card;
