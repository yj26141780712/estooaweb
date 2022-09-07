// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const ip = 'localhost:4000';

export const environment = {
  production: false,
  domain: `http://${ip}/estooawebBack/api/`,
  timLevel: 0,
};

// export const environment = {
//   production: true,
//   domain: 'http://ilive.esto.cn/eliga/api/',
//   downloadDomain: 'http://ilive.esto.cn/eliga/download/',
//   wsDomain: 'ws://ilive.esto.cn/ws/eliga/'
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
