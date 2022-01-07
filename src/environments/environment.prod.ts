let baseUrl = 'https://spotbie.com/'

export const environment = {
  production: true,
<<<<<<< HEAD
  baseUrl: 'https://spotbie-staging.netlify.app/',
  versionCheckURL : 'https://spotbie.com/version.json',
=======
  staging: false,
  baseUrl: baseUrl,
  versionCheckURL : baseUrl + 'version.json',
>>>>>>> f95da7259713cc001a066fd253098c477ed80536
  google_maps_apiKey: 'AIzaSyC4Su0B2cBzsSpAF-Kphq_78uR8b5eA4_Q',
  google_places_apiAkey: 'AIzaSyChSn9IE6Dp0Jv8TS013np1b4X1rCsQt_E',
  apiEndpoint: 'https://api.spotbie.com/api/',
  qrCodeLoyaltyPointsScanBaseUrl : baseUrl + 'loyalty-points',
  qrCodeRewardScanBaseUrl : baseUrl + 'reward',
  ngrok: null,
  fakeLocation: false,
  myLocX: 25.786286,
  myLocY: -80.186562
}