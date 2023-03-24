/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const csvLoader = require('csv-load-sync');

const formatOutput = (obj: any): string => `${JSON.stringify(obj, undefined, 2)}\n`;

(async () => {
  try {
    const data = csvLoader.load(path.join(__dirname, 'downloaded/languages.csv'));

    const en: any = {};
    const fr: any = {};

    data.map((value: any) => {
      const key = value?.Keys || value?.Key;
      if (key) {
        en[key] = value.English || '';
        fr[key] = value.French || '';
      }
      return value;
    });

    fs.writeFileSync(path.join(__dirname, 'fr.json'), formatOutput(fr));
    fs.writeFileSync(path.join(__dirname, 'en.json'), formatOutput(en));
  } catch (error) {
    console.log(error);
  }
})();

module.exports = {};
