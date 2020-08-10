var userAgent = window.navigator.userAgent,
  platform = window.navigator.platform,
  macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
  windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
  iosPlatforms = ['iPhone', 'iPad', 'iPod'],
  os = null;
if (macosPlatforms.indexOf(platform) !== -1) {
  os = 'Mac OS';
} else if (iosPlatforms.indexOf(platform) !== -1) {
  os = 'iOS';
} else if (windowsPlatforms.indexOf(platform) !== -1) {
  os = 'Windows';
} else if (/Android/.test(userAgent)) {
  os = 'Android';
} else if (!os && /Linux/.test(platform)) {
  os = 'Linux';
}
var isOpera = false
var isChrome = false
var isSafari = false
var isFirefox = false
var isIE = false

if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1) {
  isOpera = true
} else if (navigator.userAgent.indexOf("Chrome") !== -1) {
  isChrome = true
} else if (navigator.userAgent.indexOf("Safari") !== -1) {
  isSafari = true
} else if (navigator.userAgent.indexOf("Firefox") !== -1) {
  isFirefox = true
} else if ((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true)) //IF IE > 10
{
  isIE = true
}

if ((os === 'Mac OS' || os === 'Android') && !isOpera && !isSafari && !isIE && !isChrome) {
  window.plugins.OneSignal.setLogLevel({ logLevel: 6, visualLevel: 0 });

  var notificationOpenedCallback = function (jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };
  // Set your iOS Settings
  var iosSettings = {};
  iosSettings["kOSSettingsKeyAutoPrompt"] = false;
  iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

  window.plugins.OneSignal
  .startInit("c1cba1e9-164d-43b7-aab2-9b34be225497")
  .handleNotificationOpened(notificationOpenedCallback)
  .iOSSettings(iosSettings)
  .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
  .endInit();

  // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
  window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
    alert("User accepted notifications: " + accepted);
  });

}

