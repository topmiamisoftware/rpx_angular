const apiEndpoint = "https://10a8-2601-586-cd00-7900-e0d9-d96-1e22-b9a6.ngrok-free.app/";
// const apiEndpoint = 'http://localhost:8002/';
// const apiEndpoint = 'https://api-demo.spotbie.com/';
// const apiEndpoint = 'https://api.spotbie.com/';

const url = window.location.toString();
const {hostname, protocol, port} = new URL(url);
const baseUrl = `${protocol}//${hostname}:${port}/`;
const businessClientApp = 'https://demo-business.spotbie.com/';
const personalClientApp = 'https://personal-demo.spotbie.com/';

export const environment = {
  production: true,
  staging: false,
  baseUrl,
  businessClientApp,
  personalClientApp,
  google_maps_apiKey: 'AIzaSyBg9GGAv2rRn8WQbylRbpF4j6u-9TFxBG8',
  google_places_apiAkey: 'AIzaSyChSn9IE6Dp0Jv8TS013np1b4X1rCsQt_E',
  qrCodeLoyaltyPointsScanBaseUrl: baseUrl + 'loyalty-points',
  qrCodeRewardScanBaseUrl: baseUrl + 'reward',
  publishableStripeKey:
    'pk_test_51JrUwnGFcsifY4UhCCJp023Q1dWwv5AabBTsMDwiJ7RycEVLyP1EBpwbXRsfn07qpw5lovv9CGfvfhQ82Zt3Be8U00aH3hD9pj',
  apiEndpoint: `${apiEndpoint}api/`,
  fakeLocation: true,
  dsn: null,
  myLocX: 25.786286,
  myLocY: -80.186562,
  versionCheckURL: null,
};
