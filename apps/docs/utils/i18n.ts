import cn from "@/locales/cn.json";

interface Translation {
  [key: string]: string;
}

const flatten = (obj: any, prefix = ""): Translation => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      !Array.isArray(obj[k])
    ) {
      Object.assign(acc, flatten(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as Translation);
};

const cnTranslations = flatten(cn);

export const getTranslation = (lang: string, key: string): string => {
  switch (lang) {
    case "cn":
      return cnTranslations[key]!!;
    default:
      return cnTranslations[key]!!;
  }
};

export const t = getTranslation;

export const defaultLanguage = "cn";
export const languages = ["cn"];
