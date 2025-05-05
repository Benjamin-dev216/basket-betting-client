import { useTranslation } from "react-i18next";

export const useTranslatedLocations = () => {
  const { t } = useTranslation();

  const translateLocations = (text: string): string => {
    const locationKeys = Object.keys(
      t("locations", { returnObjects: true })
    ) as string[];
    let result = text;

    locationKeys.forEach((loc) => {
      const regex = new RegExp(`\\b${loc}\\b`, "gi"); // word-boundary match, case-insensitive
      result = result.replace(regex, t(`locations.${loc}`));
    });

    return result;
  };

  return { translateLocations };
};
