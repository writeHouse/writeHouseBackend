import { ethers } from 'ethers';

export const isValidAddress = (address: string): boolean => /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);

function toFixed(num, fixed) {
  const re = new RegExp(`^-?\\d+(?:.\\d{0,${fixed || -1}})?`);
  return Number(num.toString().match(re)[0]);
}

export function toUnits(balance: any) {
  return toFixed(ethers.utils.formatEther(balance), 4);
}

export function orderObjectProps(obj: any): any {
  return Object.entries(obj)
    .sort()
    .reduce((o: any, [k, v]) => ((o[k] = v), o), {});
}
export function removeEmpty(obj: any): any {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined || obj[k] === '' || obj[k] === null) {
      delete obj[k];
    }
  });
  return obj;
}

export function orderAndRemoveEmpty(obj: unknown): unknown {
  return orderObjectProps(removeEmpty(obj));
}
