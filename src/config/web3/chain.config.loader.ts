import yaml from 'js-yaml';
import fs from 'fs';

export const chainConfigLoader = () => {
  try {
    const chainConfig: any = yaml.load(fs.readFileSync(`${__dirname}/../../../config.yaml`, 'utf8'));
    return { binance: chainConfig.bsc };
  } catch (e) {
    return null;
  }
};
