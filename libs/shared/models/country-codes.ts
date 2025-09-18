export interface Countrycode {
  isoCode: string;
  name: string;
  dialCode: string;
  urlFlag: string;
  mask: string;
}
export const COUNTRY_CODES: Countrycode[] = [
  {
    isoCode: 'MX',
    name: 'México',
    dialCode: '+52',
    urlFlag: './assets/flags/MX.svg',
    mask: '(000) 000-0000',
  },
  {
    isoCode: 'US',
    name: 'United States',
    dialCode: '+1',
    urlFlag: './assets/flags/US.svg',
    mask: '(000) 000-0000',
  },
];
