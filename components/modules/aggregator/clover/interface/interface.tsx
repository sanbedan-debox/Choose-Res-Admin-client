interface Category {
  id: string;
  name: string;
  status: boolean;
  items: Array<string>;
}

interface Item {
  id: string;
  name: string;
  image: string;
  price: number;
  modifierGroups: string[];
  status: boolean;
  "Item Limit": number;
  "Popular Item": boolean;
  "UpSell Item": boolean;
  IsVegan: boolean;
  HasNuts: boolean;
  IsGlutenFree: boolean;
  IsHalal: boolean;
  IsSpicy: boolean;
}

interface ModifierGroup {
  id: string;
  name: string;
  minRequired?: number | null;
  maxRequired?: number | null;
  modifiers: Array<string>;
}

interface Modifier {
  id: string;
  name: string;
  price: number;
}
