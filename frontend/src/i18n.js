import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import mk from "./locales/mk.json";
import en from "./locales/en.json";
import sq from "./locales/sq.json";
import tr from "./locales/tr.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      mk: { translation: mk },
      en: { translation: en },
      sq: { translation: sq },
      tr: { translation: tr }
    },
    lng: "mk",
    fallbackLng: "mk",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
