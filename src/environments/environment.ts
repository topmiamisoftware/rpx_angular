const ngrok = 'https://55d4-2600-1700-4804-d5f0-f87f-5d9c-337a-3fb7.ngrok.io/'

const url = window.location.toString();
const { hostname,protocol }  = new URL(url);
const baseUrl = `${protocol}//${hostname}:4200/`

export const environment = {
  production: false,
  staging: true,
  baseUrl,
  google_maps_apiKey: 'AIzaSyBg9GGAv2rRn8WQbylRbpF4j6u-9TFxBG8',
  google_places_apiAkey: 'AIzaSyChSn9IE6Dp0Jv8TS013np1b4X1rCsQt_E',
  qrCodeLoyaltyPointsScanBaseUrl: baseUrl + 'loyalty-points',
  qrCodeRewardScanBaseUrl: baseUrl + 'reward',
  publishableStripeKey: 'pk_test_51JrUwnGFcsifY4UhCCJp023Q1dWwv5AabBTsMDwiJ7RycEVLyP1EBpwbXRsfn07qpw5lovv9CGfvfhQ82Zt3Be8U00aH3hD9pj',
  apiEndpoint: `${ngrok}api/`,
  fakeLocation: true,
  myLocX: 25.786286,
  myLocY: -80.186562
}

import 'zone.js/dist/zone-error'; // Included with Angular CLI.
