const baseUrl = `https://demo.spotbie.com/`

export const environment = {
  production: null,
  staging: null,
  baseUrl,
  versionCheckURL: baseUrl+'version.json',
  google_maps_apiKey: 'AIzaSyC4Su0B2cBzsSpAF-Kphq_78uR8b5eA4_Q',
  google_places_apiAkey: 'AIzaSyBJ92ICDSvm_MVvwU-8fkPF62rWy-9xrL0',
  apiEndpoint: null,
  qrCodeLoyaltyPointsScanBaseUrl: baseUrl+'loyalty-points',
  qrCodeRewardScanBaseUrl: baseUrl+'reward',
  ngrok: null,
  fakeLocation: null,
  myLocX: 25.786286,
  myLocY: -80.186562,
  publishableStripeKey: null
}

setEnvironmentVariables(baseUrl);

function setEnvironmentVariables(frontEndUrl: string){
  if(frontEndUrl.indexOf('https://demo.spotbie.com/') > -1){
    environment.production = false;
    environment.staging = true;
    environment.fakeLocation = true;
    environment.apiEndpoint = 'https://api-demo.spotbie.com/api/';
    environment.publishableStripeKey = 'pk_test_51JrUwnGFcsifY4UhCCJp023Q1dWwv5AabBTsMDwiJ7RycEVLyP1EBpwbXRsfn07qpw5lovv9CGfvfhQ82Zt3Be8U00aH3hD9pj'
  }

  if(frontEndUrl.indexOf('https://spotbie.com/') > -1){
    environment.production = true;
    environment.staging = false;
    environment.fakeLocation = false;
    environment.apiEndpoint = 'https://api.spotbie.com/api/';
    environment.publishableStripeKey = 'pk_live_51JrUwnGFcsifY4UhqQVtkwnats9SfiUseYMsCBpoa7361hvxq4uWNZcxL2nZnhhrqtX5vLs9EUFACK3VR60svKyc00BSbooqh8';
  }
}
