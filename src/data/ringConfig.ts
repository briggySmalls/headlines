import { RingConfig } from '../types/game';

export const ringConfig: RingConfig = {
  decades: [
    '1940s',
    '1950s',
    '1960s',
    '1970s',
    '1980s',
    '1990s',
    '2000s',
    '2010s',
    '2020s',
  ],
  getYearsForDecade: (decade: string): string[] => {
    const startYear = parseInt(decade.slice(0, 4));
    return Array.from({ length: 10 }, (_, i) => (startYear + i).toString());
  },
  months: [
    'Jan-Mar',
    'Apr-Jun',
    'Jul-Sep',
    'Oct-Dec',
  ],
};
