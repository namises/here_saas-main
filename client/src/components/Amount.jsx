import React, { useEffect, useState } from "react";
import { getipInfo } from "src/API/apiService";

const localeToCurrency = {
  "hi-IN": "INR",
  "en-IN": "INR",
  "en-US": "USD",
  "en-GB": "GBP",
  "ja-JP": "JPY",
  "de-DE": "EUR",
  "fr-FR": "EUR",
  "zh-CN": "CNY",
  "ar-SA": "SAR",
};

function getCurrencySymbol(locale, currency) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(1);
  return formatted.replace(/[\d\s,.]+/g, "").trim();
}

const Amount = ({ amount }) => {
  const [locale, setLocale] = useState("en-IN");

  const getLocale = async () => {
    let ipdata = await getipInfo();
    console.log({ ipdata });
    setLocale(ipdata?.languages && ipdata?.languages.length ? ipdata.languages.split(",")[0] : "en-IN");
  };

  useEffect(() => {
    getLocale();
  }, []);

  const getCurrencyIconByLocale = (locale) => {
    const currency = localeToCurrency[locale];
    return currency ? getCurrencySymbol(locale, currency) : "?";
  };
  return <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{`${getCurrencyIconByLocale(locale)} ${amount.toLocaleString(locale)}`}</p>;
};

export default Amount;
