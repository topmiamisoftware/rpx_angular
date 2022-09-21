const baseUrl = `https://demo.spotbie.com/`

export const environment = {
  production: null,
  staging: null,
  baseUrl,
  versionCheckURL: baseUrl+'version.json',
  google_maps_apiKey: 'AIzaSyC4Su0B2cBzsSpAF-Kphq_78uR8b5eA4_Q',
  google_places_apiAkey: 'AIzaSyChSn9IE6Dp0Jv8TS013np1b4X1rCsQt_E',
  apiEndpoint: null,
  qrCodeLoyaltyPointsScanBaseUrl: baseUrl+'loyalty-points',
  qrCodeRewardScanBaseUrl: baseUrl+'reward',
  ngrok: null,
  fakeLocation: null,
  myLocX: 25.786286,
  myLocY: -80.186562,
  publishableStripeKey: 'pk_live_51JrUwnGFcsifY4UhqQVtkwnats9SfiUseYMsCBpoa7361hvxq4uWNZcxL2nZnhhrqtX5vLs9EUFACK3VR60svKyc00BSbooqh8'
}

setEnvironmentVariables(baseUrl);

function setEnvironmentVariables(frontEndUrl: string){
  if(frontEndUrl.indexOf('https://demo.spotbie.com/') > -1){
    environment.production = false;
    environment.staging = true;
    environment.fakeLocation = true;
    environment.apiEndpoint = 'https://api-demo.spotbie.com/api/';
  }

  if(frontEndUrl.indexOf('https://spotbie.com/') > -1){
    environment.production = true;
    environment.staging = false;
    environment.fakeLocation = false;
    environment.apiEndpoint = 'https://api.spotbie.com/api/';
  }
}
