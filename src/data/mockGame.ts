import { DailyGame } from '../types/game';

export const mockGame: DailyGame = {
  id: '1995-08-15',
  answer: {
    decade: '1990s',
    year: '1995',
    month: 'Jul-Sep',
  },
  headlines: [
    '/assets/headlines/1995-08/1995-08_1.mp3',
    '/assets/headlines/1995-08/1995-08_2.mp3',
    '/assets/headlines/1995-08/1995-08_3.mp3',
  ],
  transcripts: [
    'London and Dublin appear ready to set up an international commission on removing terrorist weapons. John Major and John Bruton will meet next week.',
    'The Bosnian Serbs have been the target of NATO air attacks for a second day. President Clinton has told them they have everything to lose. Five European Union monitors thought to have died in yesterday\'s raids now appear to have survived.',
    'The insurance company SunLife has lost a legal battle over the amount of compensation it has to pay to investors who were given bad financial advice.',
  ],
  radioStation: 'Radio 4',
};
