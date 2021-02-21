import { parseISO, format } from 'date-fns';
import PropTypes from 'prop-types';

export const propTypes = { dateString: PropTypes.string.isRequired };
export type DateString = PropTypes.InferProps<typeof propTypes>;

const Date: React.FC<DateString> = ({ dateString }) => {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
};
Date.propTypes = propTypes;
export default Date;
