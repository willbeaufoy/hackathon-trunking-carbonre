import { format } from 'date-fns/fp';

export const dateToYyyyMmDd = format('yyyy-MM-dd');
export const dateToYyyyWw = format(`RRRR-'W'II`);
export const dateToDayMonthDate = format('EEE, MMM dd');
