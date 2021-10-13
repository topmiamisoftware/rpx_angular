// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  google_maps_apiKey: 'AIzaSyBg9GGAv2rRn8WQbylRbpF4j6u-9TFxBG8',
  google_places_apiAkey: 'AIzaSyChSn9IE6Dp0Jv8TS013np1b4X1rCsQt_E',
  qrCodeScanBaseUrl : 'https://localhost:4200/loyalty-points/scan',
  /**
   * Enter the IP and PORT you are serving your Laravel App on. 
   * format: https://192.168.1.65:443/api/
   * Laravel App will not work if it's not served on port 443 or SSL.
   * */
  apiEndpoint: 'https://7831-2600-1700-4804-d5f0-8a70-6839-2b7f-6cee.ngrok.io/api/' 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
