// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let ngrok = 'https://a1c3-2600-1700-4804-d5f0-ba0d-7884-4653-6945.ngrok.io/'
let baseUrl = 'https://192.168.1.65:4200/'

export const environment = {

  production: false,
  staging: true,
  baseUrl: baseUrl,
  google_maps_apiKey: 'AIzaSyBg9GGAv2rRn8WQbylRbpF4j6u-9TFxBG8',
  google_places_apiAkey: 'AIzaSyChSn9IE6Dp0Jv8TS013np1b4X1rCsQt_E',
  qrCodeScanBaseUrl : baseUrl + 'loyalty-points',
  /**
   * Enter the IP and PORT you are serving your Laravel App on. 
   * format: https://192.168.1.65:443/api/
   * Laravel App will not work if it's not served on over SSL.
   * */
  apiEndpoint: `${ngrok}api/`,

  fakeLocation: true,
  myLocX: 25.786286,
  myLocY: -80.186562

}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */

import 'zone.js/dist/zone-error'; // Included with Angular CLI.