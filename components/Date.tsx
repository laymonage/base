import { parseISO, format } from 'date-fns';
import PropTypes from 'prop-types';

export const propTypes = {
  dateString: PropTypes.string.isRequired,
  dateFormat: PropTypes.string,
  className: PropTypes.string,
};
export type DateProps = PropTypes.InferProps<typeof propTypes>;

const Date: React.FC<DateProps> = ({ dateString, dateFormat, className }) => {
  const date = parseISO(dateString);
  return (
    <time dateTime={dateString} className={className}>
      {format(date, dateFormat || 'LLLL d, yyyy')}
    </time>
  );
};
Date.propTypes = propTypes;
export default Date;
