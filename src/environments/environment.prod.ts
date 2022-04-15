let baseUrl = 'https://demo.spotbie.com/'

export const environment = {
  production: false,
  staging: true,
  baseUrl: baseUrl,
  versionCheckURL: baseUrl+'version.json',
  google_maps_apiKey: 'AIzaSyC4Su0B2cBzsSpAF-Kphq_78uR8b5eA4_Q',
  google_places_apiAkey: 'AIzaSyChSn9IE6Dp0Jv8TS013np1b4X1rCsQt_E',
  apiEndpoint: 'https://api-demo.spotbie.com/api/',
  qrCodeLoyaltyPointsScanBaseUrl: baseUrl+'loyalty-points',
  qrCodeRewardScanBaseUrl: baseUrl+'reward',
  ngrok: null,
  fakeLocation: true,
  myLocX: 25.786286,
  myLocY: -80.186562,
  publishableStripeKey: 'pk_live_51JrUwnGFcsifY4UhqQVtkwnats9SfiUseYMsCBpoa7361hvxq4uWNZcxL2nZnhhrqtX5vLs9EUFACK3VR60svKyc00BSbooqh8'
}
