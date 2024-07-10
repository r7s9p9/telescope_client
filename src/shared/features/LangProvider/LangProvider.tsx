import { ReactNode, createContext, useContext, useState } from "react";
import { localeEN } from "../../../locales/en";
import { localeRU } from "../../../locales/ru";

const defaultData = {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  switchTo: (_type: "en" | "ru") => {},
  lang: localeEN as typeof localeEN | typeof localeRU,
  currentLang: "en",
};

const LangContext = createContext(defaultData);

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext);

export function LangProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(defaultData);

  const switchTo = (type: "en" | "ru") => {
    switch (type) {
      case "en":
        setData((prevData) => ({
          ...prevData,
          currentLang: "en",
          lang: localeEN,
        }));
        break;
      case "ru":
        setData((prevData) => ({
          ...prevData,
          currentLang: "ru",
          lang: localeRU,
        }));
        break;
    }
  };

  return (
    <LangContext.Provider
      value={{ switchTo, lang: data.lang, currentLang: data.currentLang }}
    >
      {children}
    </LangContext.Provider>
  );
}
