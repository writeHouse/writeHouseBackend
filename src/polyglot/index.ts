import Polyglot from 'node-polyglot';

import en from './en.json';
import fr from './fr.json';

export const startPolyglot = (req: any, res: any, next: any): void => {
  const language = ((req.headers['accept-language'] || 'en') as string).replace(/,\S+/g, '').replace(/-\S+/g, '');

  req.polyglot = new Polyglot();

  switch (language) {
    case 'fr':
      req.polyglot.extend(fr);
      break;
    case 'en':
      req.polyglot.extend(en);
      break;
    default:
      req.polyglot.extend(en);
      break;
  }

  next();
};
