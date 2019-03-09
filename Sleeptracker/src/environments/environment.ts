// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDMJZKCP8jkw8btXtnQcNUmNkXbVsEVmgE",
    authDomain: "inf133a5-65ffb.firebaseapp.com",
    databaseURL: "https://inf133a5-65ffb.firebaseio.com",
    projectId: "inf133a5-65ffb",
    storageBucket: "inf133a5-65ffb.appspot.com",
    messagingSenderId: "72150064183"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
