import { Cookies } from 'quasar'

if (window.hasOwnProperty("cordova")) {

  var notificationOpenedCallback = function (jsonData) {
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
  });

  window.plugins.OneSignal.addSubscriptionObserver(function (state) {
    if (state.to.userId !== null) {
      Cookies.set("oneSignalId", state.to.userId);
    }
  })
}
