import VueI18n from "vue-i18n";
import messages from "src/i18n";
import { Cookies } from "quasar";

export default ({ app, Vue }) => {
  Vue.use(VueI18n);
  var userLang = navigator.language;
  if (Cookies.has("language")) {
    app.i18n = new VueI18n({
      locale: Cookies.get("language"),
      fallbackLocale: Cookies.get("language"),
      messages
    });
  } else {
    if (userLang.includes("es")) {
      app.i18n = new VueI18n({
        locale: "es",
        fallbackLocale: "es",
        messages
      });
    } else {
      app.i18n = new VueI18n({
        locale: "en",
        fallbackLocale: "en",
        messages
      });
    }
  }
};
