import { MenuTypeEnum, PriceTypeEnum } from "@/generated/graphql";

export const formatMenuType = (type: MenuTypeEnum) => {
  switch (type) {
    case MenuTypeEnum.OnlineOrdering:
      return "Online Ordering";
    case MenuTypeEnum.DineIn:
      return "Dine In";
    case MenuTypeEnum.Catering:
      return "Catering";
    default:
      return "";
  }
};

export const menuTypeOptions: any[] = [
  {
    value: MenuTypeEnum.OnlineOrdering,
    label: formatMenuType(MenuTypeEnum.OnlineOrdering),
  },
  { value: MenuTypeEnum.DineIn, label: formatMenuType(MenuTypeEnum.DineIn) },
  {
    value: MenuTypeEnum.Catering,
    label: formatMenuType(MenuTypeEnum.Catering),
  },
];

export const PricingTypeOptions: any[] = [
  { value: PriceTypeEnum.FreeOfCharge, label: "Free of Charge" },
  { value: PriceTypeEnum.IndividualPrice, label: "Individual Price" },
  { value: PriceTypeEnum.SamePrice, label: "Same Price" },
];
