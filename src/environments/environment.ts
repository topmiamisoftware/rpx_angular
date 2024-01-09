// const apiEndpoint = 'https://1446-2601-586-cd80-6e0-8f4e-c712-4713-e036.ngrok-free.app/'
const apiEndpoint = 'https://ec98-2601-586-cd00-7900-fddd-889b-e3df-4951.ngrok-free.app/';

const url = window.location.toString();
const {hostname, protocol} = new URL(url);
const baseUrl = `${protocol}//${hostname}:4200/`;

export const environment = {
  production: false,
  staging: true,
  baseUrl,
  google_maps_apiKey: 'AIzaSyBg9GGAv2rRn8WQbylRbpF4j6u-9TFxBG8',
  google_places_apiAkey: 'AIzaSyChSn9IE6Dp0Jv8TS013np1b4X1rCsQt_E',
  qrCodeLoyaltyPointsScanBaseUrl: baseUrl + 'loyalty-points',
  qrCodeRewardScanBaseUrl: baseUrl + 'reward',
  publishableStripeKey:
    'pk_test_51JrUwnGFcsifY4UhCCJp023Q1dWwv5AabBTsMDwiJ7RycEVLyP1EBpwbXRsfn07qpw5lovv9CGfvfhQ82Zt3Be8U00aH3hD9pj',
  apiEndpoint: `${apiEndpoint}api/`,
  fakeLocation: false,
  dsn: null,
  myLocX: 25.786286,
  myLocY: -80.186562,
  versionCheckURL: null,
};
