import { parseISO, format } from 'date-fns';
import PropTypes from 'prop-types';

export const propTypes = {
  dateString: PropTypes.string.isRequired,
  className: PropTypes.string,
};
export type DateProps = PropTypes.InferProps<typeof propTypes>;

const Date: React.FC<DateProps> = ({ dateString, className }) => {
  const date = parseISO(dateString);
  return (
    <time dateTime={dateString} className={className}>
      {format(date, 'LLLL d, yyyy')}
    </time>
  );
};
Date.propTypes = propTypes;
export default Date;
