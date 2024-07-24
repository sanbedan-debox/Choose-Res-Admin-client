import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type AccessHistory = {
  __typename?: 'AccessHistory';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  device: DeviceInfo;
};

export type AccountPreference = {
  __typename?: 'AccountPreference';
  email: Scalars['Boolean']['output'];
  whatsApp: Scalars['Boolean']['output'];
};

export type AccountPreferenceInput = {
  email: Scalars['Boolean']['input'];
  whatsApp: Scalars['Boolean']['input'];
};

export type AddAdminInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: AdminRole;
};

export type AddCategoryInput = {
  availability?: InputMaybe<Array<AvailabilityInput>>;
  desc: MasterCommonInput;
  items?: InputMaybe<Array<Scalars['String']['input']>>;
  name: MasterCommonInput;
};

export type AddCuisineInput = {
  description: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type AddEmailCampaignInput = {
  campaignName: Scalars['String']['input'];
  csvDataUrl?: InputMaybe<Scalars['String']['input']>;
  customLink?: InputMaybe<Scalars['String']['input']>;
  emailSubject: Scalars['String']['input'];
  emailTemplate: Scalars['String']['input'];
  scheduleTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
  scheduleType: EmailCampaignScheduleTypes;
  target: EmailCampaignTargetTypes;
};

export type AddEmailTemplateInput = {
  content: Scalars['String']['input'];
  designJson: Scalars['String']['input'];
  html: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type AddItemInput = {
  applySalesTax: Scalars['Boolean']['input'];
  availability?: InputMaybe<Array<AvailabilityInput>>;
  desc?: InputMaybe<MasterCommonInput>;
  hasNuts: Scalars['Boolean']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  isGlutenFree: Scalars['Boolean']['input'];
  isHalal: Scalars['Boolean']['input'];
  isSpicy: Scalars['Boolean']['input'];
  isVegan: Scalars['Boolean']['input'];
  name: MasterCommonInput;
  popularItem: Scalars['Boolean']['input'];
  price: MasterCommonInputNumber;
  status: StatusEnum;
  upSellItem: Scalars['Boolean']['input'];
};

export type AddMenuInput = {
  availability?: InputMaybe<Array<AvailabilityInput>>;
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  name: MasterCommonInput;
  taxRateId?: InputMaybe<Scalars['String']['input']>;
  type: MenuTypeEnum;
};

export type AddModifierGroupInput = {
  maxSelections: MasterCommonInputNumber;
  minSelections: MasterCommonInputNumber;
  name: MasterCommonInput;
  optional: Scalars['Boolean']['input'];
  pricingType: PriceTypeEnum;
};

export type AddModifierInput = {
  name: MasterCommonInput;
  preSelect: Scalars['Boolean']['input'];
  price: MasterCommonInputNumber;
};

export type AddRestaurantInput = {
  address: AddressInfoInput;
  availability: Array<AvailabilityInput>;
  brandingLogo?: InputMaybe<Scalars['String']['input']>;
  locationName: MasterCommonInput;
  name: MasterCommonInput;
  socialInfo?: InputMaybe<SocialInfoInput>;
  timezone: Scalars['String']['input'];
};

export type AddStateInput = {
  abbreviation: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type AddTeamMemberInput = {
  accountPreferences: AccountPreferenceInput;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  role: UserRole;
};

export type AddTimezoneInput = {
  gmtOffset: Scalars['Float']['input'];
  value: Scalars['String']['input'];
};

export type AddUserInput = {
  accountPreferences: AccountPreferenceInput;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type AddWaitListUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  number: Scalars['String']['input'];
  restaurantName: Scalars['String']['input'];
  software: SoftWareEnum;
  website: Scalars['String']['input'];
};

export type AddressInfo = {
  __typename?: 'AddressInfo';
  _id: Scalars['ID']['output'];
  addressLine1: MasterCommon;
  addressLine2?: Maybe<MasterCommon>;
  city: MasterCommon;
  coordinate?: Maybe<LocationCommon>;
  place?: Maybe<Places>;
  postcode: MasterCommon;
  state: MasterCommon;
};

export type AddressInfoInput = {
  addressLine1: MasterCommonInput;
  addressLine2?: InputMaybe<MasterCommonInput>;
  city: MasterCommonInput;
  coordinate: LocationCommonInput;
  place: PlaceInput;
  postcode: MasterCommonInput;
  state: MasterCommonInput;
};

export type Admin = {
  __typename?: 'Admin';
  _id: Scalars['ID']['output'];
  accessHistory?: Maybe<Array<AccessHistory>>;
  blockedBy: Admin;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  email: Scalars['String']['output'];
  lastLoggedIn?: Maybe<Scalars['DateTimeISO']['output']>;
  lastLoggedOut?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  numberOfResetPassword: Scalars['Float']['output'];
  role: AdminRole;
  status: PlatformStatus;
  unBlockedBy: Admin;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
};

/** Types of Admin Roles */
export enum AdminRole {
  Admin = 'admin',
  Master = 'master',
  Normal = 'normal'
}

export type Availability = {
  __typename?: 'Availability';
  _id: Scalars['ID']['output'];
  active: Scalars['Boolean']['output'];
  day: Scalars['String']['output'];
  hours: Array<Hours>;
};

export type AvailabilityInput = {
  active: Scalars['Boolean']['input'];
  day: Day;
  hours: Array<HoursInput>;
};

/** Restaurant beverage category type enum. */
export enum BeverageCategory {
  Alcohol = 'Alcohol',
  NonAlcohol = 'NonAlcohol'
}

export type Business = {
  __typename?: 'Business';
  _id: Scalars['ID']['output'];
  address?: Maybe<AddressInfo>;
  businessName?: Maybe<Scalars['String']['output']>;
  businessType?: Maybe<BusinessTypeEnum>;
  createdAt: Scalars['DateTimeISO']['output'];
  dob?: Maybe<Scalars['DateTimeISO']['output']>;
  ein?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  employeeSize?: Maybe<StaffCountEnum>;
  establishedAt?: Maybe<Scalars['String']['output']>;
  estimatedRevenue?: Maybe<EstimatedRevenueEnum>;
  phone: Scalars['String']['output'];
  restaurants?: Maybe<Array<RestaurantInfo>>;
  status: StatusEnum;
  teams: Array<Teams>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

/** Business type enum */
export enum BusinessTypeEnum {
  Corporation = 'Corporation',
  Llc = 'LLC',
  Llp = 'LLP',
  Lp = 'LP',
  SoleProprietor = 'SoleProprietor'
}

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ID']['output'];
  availability?: Maybe<Array<Availability>>;
  createdAt: Scalars['DateTimeISO']['output'];
  desc: MasterCommon;
  items: Array<ItemInfo>;
  menu: Menu;
  name: MasterCommon;
  restaurantId: Restaurant;
  status: StatusEnum;
  upSellCategories?: Maybe<Array<Category>>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

export type CategoryGroupInput = {
  categoryId: Scalars['String']['input'];
  itemIds: Array<Scalars['String']['input']>;
};

export type CategoryInfo = {
  __typename?: 'CategoryInfo';
  _id: Category;
  id: Scalars['String']['output'];
  name?: Maybe<MasterCommon>;
  status: StatusEnum;
};

/** ConnectionStatusEnum enum type  */
export enum ConnectionStatusEnum {
  Connected = 'Connected',
  Error = 'Error',
  Expired = 'Expired',
  NotConnected = 'NotConnected'
}

export type CreateMenuFullInput = {
  category: Array<CategoryGroupInput>;
  menu: CreateMenuInput;
};

export type CreateMenuInput = {
  availability?: InputMaybe<Array<AvailabilityInput>>;
  name: MasterCommonInput;
  taxRateId?: InputMaybe<Scalars['String']['input']>;
  type: MenuTypeEnum;
};

export type Cuisine = {
  __typename?: 'Cuisine';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  description?: Maybe<Scalars['String']['output']>;
  status: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
  value: Scalars['String']['output'];
};

/** The day */
export enum Day {
  Friday = 'Friday',
  Monday = 'Monday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
  Thursday = 'Thursday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday'
}

export type DeviceInfo = {
  __typename?: 'DeviceInfo';
  _id: Scalars['ID']['output'];
  deviceName: Scalars['String']['output'];
  deviceOS: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type EmailBuilderTemplate = {
  __typename?: 'EmailBuilderTemplate';
  _id: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  designJson?: Maybe<Scalars['String']['output']>;
  templateFileName: Scalars['String']['output'];
  templateUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
};

export type EmailCampaignEventHistory = {
  __typename?: 'EmailCampaignEventHistory';
  date: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
};

/** This enum stores the types of schedule for email campaigns */
export enum EmailCampaignScheduleTypes {
  Later = 'later',
  Now = 'now'
}

export type EmailCampaignStats = {
  __typename?: 'EmailCampaignStats';
  mailsClicked: Array<EmailCampaignEventHistory>;
  mailsDelivered: Scalars['Float']['output'];
  mailsOpened: Array<EmailCampaignEventHistory>;
  mailsSent: Scalars['Float']['output'];
};

/** This enum stores the status of email campaign */
export enum EmailCampaignStatusEnum {
  Failed = 'failed',
  Processing = 'processing',
  Success = 'success'
}

/** This enum stores the types of target for email campaigns */
export enum EmailCampaignTargetTypes {
  Admins = 'Admins',
  Csv = 'CSV',
  Users = 'Users',
  Waitlist = 'Waitlist'
}

export type EmailCampaignsObject = {
  __typename?: 'EmailCampaignsObject';
  _id: Scalars['ID']['output'];
  campaignName: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  csvDataUrl?: Maybe<Scalars['String']['output']>;
  emailSubject: Scalars['String']['output'];
  emailTemplate: EmailBuilderTemplate;
  logUrl?: Maybe<Scalars['String']['output']>;
  scheduleTime?: Maybe<Scalars['DateTimeISO']['output']>;
  scheduleType: EmailCampaignScheduleTypes;
  stats: EmailCampaignStats;
  status: EmailCampaignStatusEnum;
  target: EmailCampaignTargetTypes;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
  usersCount: Scalars['Float']['output'];
};

export type EmailTemplatesObject = {
  __typename?: 'EmailTemplatesObject';
  _id: Scalars['ID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  designJson: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
};

/** Enum used for storing static values of Estimated Revenue */
export enum EstimatedRevenueEnum {
  Above1M = 'Above1M',
  From0to50K = 'From0to50K',
  From50Kto200K = 'From50Kto200K',
  From200Kto500K = 'From200Kto500K',
  From500Kto1M = 'From500Kto1M'
}

/** Apply filter operators while fetching the data  */
export enum FilterOperatorsEnum {
  Any = 'any',
  EqualTo = 'equalTo',
  GreaterThan = 'greaterThan',
  GreaterThanOrEqualTo = 'greaterThanOrEqualTo',
  LessThan = 'lessThan',
  LessThanOrEqualTo = 'lessThanOrEqualTo',
  NotEqualTo = 'notEqualTo'
}

/** Restaurant food type enum. */
export enum FoodType {
  NonVegetarian = 'NonVegetarian',
  Vegan = 'Vegan',
  Vegetarian = 'Vegetarian'
}

export type Hours = {
  __typename?: 'Hours';
  end: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
};

export type HoursInput = {
  end: Scalars['DateTimeISO']['input'];
  start: Scalars['DateTimeISO']['input'];
};

export type Integration = {
  __typename?: 'Integration';
  _id: Scalars['ID']['output'];
  connectionStatus: ConnectionStatusEnum;
  createdAt: Scalars['DateTimeISO']['output'];
  credentials: IntegrationCredentials;
  platform: IntegrationPlatformEnum;
  status: StatusEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type IntegrationCredentials = {
  __typename?: 'IntegrationCredentials';
  _id: Scalars['ID']['output'];
  accessToke: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  storeId: Scalars['String']['output'];
};

/** Integration enum type  */
export enum IntegrationPlatformEnum {
  Clover = 'Clover',
  DoorDash = 'DoorDash',
  GrubHub = 'GrubHub',
  UberEats = 'UberEats'
}

export type Item = {
  __typename?: 'Item';
  _id: Scalars['ID']['output'];
  applySalesTax: Scalars['Boolean']['output'];
  availability?: Maybe<Array<Availability>>;
  category: Category;
  createdAt: Scalars['DateTimeISO']['output'];
  desc: MasterCommon;
  hasNuts: Scalars['Boolean']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isGlutenFree: Scalars['Boolean']['output'];
  isHalal: Scalars['Boolean']['output'];
  isSpicy: Scalars['Boolean']['output'];
  isVegan: Scalars['Boolean']['output'];
  modifierGroup: Array<ModifierGroupInfo>;
  name: MasterCommon;
  popularItem: Scalars['Boolean']['output'];
  price: MasterCommonNumber;
  restaurantId: Restaurant;
  status: StatusEnum;
  upSellItem: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

export type ItemInfo = {
  __typename?: 'ItemInfo';
  _id: Item;
  id: Scalars['String']['output'];
  name?: Maybe<MasterCommon>;
  price: MasterCommonNumber;
  status: StatusEnum;
};

export type LocationCommon = {
  __typename?: 'LocationCommon';
  coordinates: Array<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type LocationCommonInput = {
  coordinates: Array<Scalars['Float']['input']>;
};

export type MasterCommon = {
  __typename?: 'MasterCommon';
  _id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type MasterCommonInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  value: Scalars['String']['input'];
};

export type MasterCommonInputNumber = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  value: Scalars['Float']['input'];
};

export type MasterCommonNumber = {
  __typename?: 'MasterCommonNumber';
  _id: Scalars['ID']['output'];
  value: Scalars['Float']['output'];
};

/** Restaurant Meat type enum. */
export enum MeatType {
  Halal = 'Halal',
  NonHalal = 'NonHalal'
}

export type Menu = {
  __typename?: 'Menu';
  _id: Scalars['ID']['output'];
  availability?: Maybe<Array<Availability>>;
  categories: Array<CategoryInfo>;
  createdAt: Scalars['DateTimeISO']['output'];
  name: MasterCommon;
  restaurantId: Restaurant;
  status: StatusEnum;
  taxes: TaxRateInfo;
  type: MenuTypeEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

export type MenuInfo = {
  __typename?: 'MenuInfo';
  _id: Menu;
  id: Scalars['String']['output'];
  name?: Maybe<MasterCommon>;
  type: MenuTypeEnum;
};

/** Menu status enum */
export enum MenuTypeEnum {
  Catering = 'Catering',
  DineIn = 'DineIn',
  OnlineOrdering = 'OnlineOrdering'
}

export type Modifier = {
  __typename?: 'Modifier';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  name: MasterCommon;
  preSelect: Scalars['Boolean']['output'];
  price: MasterCommonNumber;
  restaurantId: Restaurant;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

export type ModifierGroup = {
  __typename?: 'ModifierGroup';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  maxSelections: MasterCommonNumber;
  minSelections: MasterCommonNumber;
  modifiers: Array<ModifierInfo>;
  name: MasterCommon;
  optional: Scalars['Boolean']['output'];
  pricingType: PriceTypeEnum;
  restaurantId: Restaurant;
  status: StatusEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

export type ModifierGroupInfo = {
  __typename?: 'ModifierGroupInfo';
  _id: ModifierGroup;
  id: Scalars['String']['output'];
  name: MasterCommon;
  pricingType: PriceTypeEnum;
};

export type ModifierInfo = {
  __typename?: 'ModifierInfo';
  _id: Modifier;
  id: Scalars['String']['output'];
  name: MasterCommon;
  price: MasterCommonNumber;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAdmin: Scalars['Boolean']['output'];
  addCategoriesToMenu: Scalars['Boolean']['output'];
  addCategory: Scalars['Boolean']['output'];
  addCuisine: Scalars['Boolean']['output'];
  addItem: Scalars['Boolean']['output'];
  addItemsToCategory: Scalars['Boolean']['output'];
  addMenu: Scalars['Boolean']['output'];
  addModifier: Scalars['Boolean']['output'];
  addModifierGroup: Scalars['Boolean']['output'];
  addModifierGroupToItem: Scalars['Boolean']['output'];
  addModifierToModifierGroup: Scalars['Boolean']['output'];
  addRestaurant: Scalars['Boolean']['output'];
  addState: Scalars['Boolean']['output'];
  addTaxRate: Scalars['String']['output'];
  addTaxRateInRestaurant: Scalars['Boolean']['output'];
  addTeamMember: Scalars['Boolean']['output'];
  addTimezone: Scalars['Boolean']['output'];
  addUser: Scalars['String']['output'];
  addWaitListUser: Scalars['Boolean']['output'];
  adminUserDetailsRejection: Scalars['Boolean']['output'];
  adminUserDetailsVerification: Scalars['Boolean']['output'];
  blockAdmin: Scalars['Boolean']['output'];
  businessOnboarding: Scalars['Boolean']['output'];
  changeCategoryStatus: Scalars['Boolean']['output'];
  changeItemStatus: Scalars['Boolean']['output'];
  changeMenuStatus: Scalars['Boolean']['output'];
  changeModifierGroupStatus: Scalars['Boolean']['output'];
  changeRestaurantStatus: Scalars['Boolean']['output'];
  changeRole: Scalars['Boolean']['output'];
  changeUserStatus: Scalars['Boolean']['output'];
  completeBusinessOnboarding: Scalars['Boolean']['output'];
  createEmailCampaign: Scalars['Boolean']['output'];
  createEmailTemplate: Scalars['Boolean']['output'];
  createMenuFull: Scalars['Boolean']['output'];
  deleteAdmin: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteEmailTemplate: Scalars['Boolean']['output'];
  deleteItem: Scalars['Boolean']['output'];
  deleteMenu: Scalars['Boolean']['output'];
  deleteModifier: Scalars['Boolean']['output'];
  deleteTaxRate: Scalars['Boolean']['output'];
  deleteTaxRateFromRestaurant: Scalars['Boolean']['output'];
  getItemByCategory: Item;
  removeCategoryFromMenu: Scalars['Boolean']['output'];
  removeItemFromCategory: Scalars['Boolean']['output'];
  removeModifierFromModifierGroup: Scalars['Boolean']['output'];
  removeModifierGroup: Scalars['Boolean']['output'];
  removeModifierGroupFromItem: Scalars['Boolean']['output'];
  removeRestaurant: Scalars['Boolean']['output'];
  removeTeamMember: Scalars['Boolean']['output'];
  restaurantOnboarding: Scalars['Boolean']['output'];
  sendTestEmails: Scalars['Boolean']['output'];
  updateCategory: Scalars['Boolean']['output'];
  updateCuisineStatus: Scalars['Boolean']['output'];
  updateItem: Scalars['Boolean']['output'];
  updateMenu: Scalars['Boolean']['output'];
  updateModifier: Scalars['Boolean']['output'];
  updateModifierGroup: Scalars['Boolean']['output'];
  updateRestaurant: Scalars['Boolean']['output'];
  updateStateStatus: Scalars['Boolean']['output'];
  updateTaxRate: Scalars['Boolean']['output'];
  updateTimezoneStatus: Scalars['Boolean']['output'];
  updateUserProfile: Scalars['Boolean']['output'];
  verifyTeamEmail: Scalars['Boolean']['output'];
  verifyUserDetails: Scalars['Boolean']['output'];
};


export type MutationAddAdminArgs = {
  input: AddAdminInput;
};


export type MutationAddCategoriesToMenuArgs = {
  categoryIds: Array<Scalars['String']['input']>;
  menuId: Scalars['String']['input'];
};


export type MutationAddCategoryArgs = {
  input: AddCategoryInput;
};


export type MutationAddCuisineArgs = {
  input: AddCuisineInput;
};


export type MutationAddItemArgs = {
  input: AddItemInput;
  modifierGroups: Array<Scalars['String']['input']>;
};


export type MutationAddItemsToCategoryArgs = {
  categoryId: Scalars['String']['input'];
  itemIds: Array<Scalars['String']['input']>;
};


export type MutationAddMenuArgs = {
  input: AddMenuInput;
};


export type MutationAddModifierArgs = {
  input: AddModifierInput;
};


export type MutationAddModifierGroupArgs = {
  input: AddModifierGroupInput;
  modifiers: Array<Scalars['String']['input']>;
};


export type MutationAddModifierGroupToItemArgs = {
  itemId: Scalars['String']['input'];
  modifierGroupIds: Array<Scalars['String']['input']>;
};


export type MutationAddModifierToModifierGroupArgs = {
  modifierGroupId: Scalars['String']['input'];
  modifierIds: Array<Scalars['String']['input']>;
};


export type MutationAddRestaurantArgs = {
  input: AddRestaurantInput;
};


export type MutationAddStateArgs = {
  input: AddStateInput;
};


export type MutationAddTaxRateArgs = {
  input: TaxRateInput;
};


export type MutationAddTaxRateInRestaurantArgs = {
  taxRateId: Scalars['String']['input'];
};


export type MutationAddTeamMemberArgs = {
  input: AddTeamMemberInput;
};


export type MutationAddTimezoneArgs = {
  input: AddTimezoneInput;
};


export type MutationAddUserArgs = {
  input: AddUserInput;
};


export type MutationAddWaitListUserArgs = {
  input: AddWaitListUserInput;
};


export type MutationAdminUserDetailsRejectionArgs = {
  content: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationAdminUserDetailsVerificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationBlockAdminArgs = {
  id: Scalars['String']['input'];
  updateStatus: PlatformStatus;
};


export type MutationBusinessOnboardingArgs = {
  input: RegisterBusinessInput;
};


export type MutationChangeCategoryStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangeItemStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangeMenuStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangeModifierGroupStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangeRestaurantStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationChangeRoleArgs = {
  id: Scalars['String']['input'];
  role: AdminRole;
};


export type MutationChangeUserStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateEmailCampaignArgs = {
  input: AddEmailCampaignInput;
};


export type MutationCreateEmailTemplateArgs = {
  input: AddEmailTemplateInput;
};


export type MutationCreateMenuFullArgs = {
  input: CreateMenuFullInput;
};


export type MutationDeleteAdminArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteEmailTemplateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteItemArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMenuArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteModifierArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTaxRateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTaxRateFromRestaurantArgs = {
  taxId: Scalars['String']['input'];
};


export type MutationGetItemByCategoryArgs = {
  categoryId: Scalars['String']['input'];
};


export type MutationRemoveCategoryFromMenuArgs = {
  categoryId: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
};


export type MutationRemoveItemFromCategoryArgs = {
  categoryId: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
};


export type MutationRemoveModifierFromModifierGroupArgs = {
  modifierGroupId: Scalars['String']['input'];
  modifierId: Scalars['String']['input'];
};


export type MutationRemoveModifierGroupArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveModifierGroupFromItemArgs = {
  itemId: Scalars['String']['input'];
  modifierGroupId: Scalars['String']['input'];
};


export type MutationRemoveTeamMemberArgs = {
  teamId: Scalars['String']['input'];
};


export type MutationRestaurantOnboardingArgs = {
  input: UpdateRestaurantDetailsInput;
};


export type MutationSendTestEmailsArgs = {
  input: TestEmailInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateCuisineStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateItemArgs = {
  input: UpdateItemInput;
};


export type MutationUpdateMenuArgs = {
  input: UpdateMenuInput;
};


export type MutationUpdateModifierArgs = {
  input: UpdateModifierInput;
};


export type MutationUpdateModifierGroupArgs = {
  input: UpdateModifierGroupInput;
};


export type MutationUpdateRestaurantArgs = {
  input: UpdateRestaurantInput;
};


export type MutationUpdateStateStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateTaxRateArgs = {
  input: UpdateTaxRateInput;
};


export type MutationUpdateTimezoneStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
};


export type MutationVerifyTeamEmailArgs = {
  token: Scalars['String']['input'];
};


export type MutationVerifyUserDetailsArgs = {
  input: VerifyUserDetails;
};

export type PaginatedFilter = {
  field: Scalars['String']['input'];
  operator: FilterOperatorsEnum;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type PlaceDetail = {
  __typename?: 'PlaceDetail';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type PlaceInput = {
  displayName: Scalars['String']['input'];
  placeId: Scalars['String']['input'];
};

export type Places = {
  __typename?: 'Places';
  displayName: Scalars['String']['output'];
  placeId: Scalars['String']['output'];
};

/** Restaurant user status */
export enum PlatformStatus {
  Active = 'active',
  Blocked = 'blocked',
  InternalVerificationPending = 'internalVerificationPending',
  OnboardingPending = 'onboardingPending',
  PaymentPending = 'paymentPending'
}

/** Price type enum  */
export enum PriceTypeEnum {
  FreeOfCharge = 'FreeOfCharge',
  IndividualPrice = 'IndividualPrice',
  SamePrice = 'SamePrice'
}

export type Query = {
  __typename?: 'Query';
  adminLogin: Scalars['String']['output'];
  adminLogout: Scalars['Boolean']['output'];
  changeRestaurantStatusFromUser: Scalars['Boolean']['output'];
  completeRestaurantOnboarding: Scalars['Boolean']['output'];
  emailOtpVerification: Scalars['Boolean']['output'];
  generateOtpForEmailVerification: Scalars['String']['output'];
  generateOtpForLogin: Scalars['String']['output'];
  generateOtpForNumberVerification: Scalars['String']['output'];
  getActiveCuisines: Array<Cuisine>;
  getActiveStates: Array<State>;
  getActiveTimezones: Array<Timezone>;
  getAdmins: Array<Admin>;
  getAllCuisines: Array<Cuisine>;
  getAllEmailCampaigns: Array<EmailCampaignsObject>;
  getAllEmailTemplates: Array<EmailTemplatesObject>;
  getAllMenus: Array<Menu>;
  getAllRestaurantUsers: Array<User>;
  getAllRestaurants: Array<Restaurant>;
  getAllStates: Array<State>;
  getAllTimezones: Array<Timezone>;
  getBusinessDetails: Business;
  getBusinessOnboardingDetails: Business;
  getCategories: Array<Category>;
  getCategory: Category;
  getCategoryByMenu: Category;
  getItem: Item;
  getItems: Array<Item>;
  getMenu: Menu;
  getMenuByRestaurant: Array<Menu>;
  getMenusByType: Array<Menu>;
  getModifier: Modifier;
  getModifierGroup: ModifierGroup;
  getModifierGroups: Array<ModifierGroup>;
  getModifiers: Array<Modifier>;
  getPlaceDetails?: Maybe<PlaceDetail>;
  getPlacesList: Array<Places>;
  getRestaurantDetails: Restaurant;
  getRestaurantOnboardingData: Restaurant;
  getTaxRate: TaxRate;
  getTaxRates: Array<TaxRate>;
  getTeamMembers: Array<Teams>;
  getUserRestaurants: Array<Restaurant>;
  getUsersForTarget: Scalars['Float']['output'];
  getWaitListUsers: Array<WaitListUser>;
  logout: Scalars['Boolean']['output'];
  me: Admin;
  meUser: User;
  mobileNumberOtpVerification: Scalars['Boolean']['output'];
  resetPasswordAdmin: Scalars['Boolean']['output'];
  setRestaurantIdAsCookie: Scalars['Boolean']['output'];
  verifyOtpForLogin: Scalars['Boolean']['output'];
};


export type QueryAdminLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type QueryEmailOtpVerificationArgs = {
  email: Scalars['String']['input'];
  key: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};


export type QueryGenerateOtpForEmailVerificationArgs = {
  email: Scalars['String']['input'];
};


export type QueryGenerateOtpForLoginArgs = {
  input: Scalars['String']['input'];
};


export type QueryGenerateOtpForNumberVerificationArgs = {
  number: Scalars['String']['input'];
};


export type QueryGetAllEmailTemplatesArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetAllRestaurantUsersArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetAllRestaurantsArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetCategoriesArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetCategoryByMenuArgs = {
  menuId: Scalars['String']['input'];
};


export type QueryGetItemArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetItemsArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetMenuArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<MenuTypeEnum>;
};


export type QueryGetMenusByTypeArgs = {
  id: Scalars['String']['input'];
  type?: InputMaybe<MenuTypeEnum>;
};


export type QueryGetModifierArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetModifierGroupArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetModifierGroupsArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetModifiersArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetPlaceDetailsArgs = {
  placeId: Scalars['String']['input'];
};


export type QueryGetPlacesListArgs = {
  input: Scalars['String']['input'];
};


export type QueryGetTaxRateArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUsersForTargetArgs = {
  target: EmailCampaignTargetTypes;
};


export type QueryMobileNumberOtpVerificationArgs = {
  key: Scalars['String']['input'];
  number: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};


export type QueryResetPasswordAdminArgs = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type QuerySetRestaurantIdAsCookieArgs = {
  id: Scalars['String']['input'];
};


export type QueryVerifyOtpForLoginArgs = {
  input: Scalars['String']['input'];
  key: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type RegisterBusinessInput = {
  address?: InputMaybe<AddressInfoInput>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  businessType?: InputMaybe<BusinessTypeEnum>;
  dob?: InputMaybe<Scalars['DateTimeISO']['input']>;
  ein?: InputMaybe<Scalars['String']['input']>;
  employeeSize?: InputMaybe<StaffCountEnum>;
  establishedAt?: InputMaybe<Scalars['String']['input']>;
  estimatedRevenue?: InputMaybe<EstimatedRevenueEnum>;
};

export type RejectRecord = {
  __typename?: 'RejectRecord';
  admin: Admin;
  createdAt: Scalars['DateTimeISO']['output'];
  name: Scalars['String']['output'];
  reason: Scalars['String']['output'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  _id: Scalars['ID']['output'];
  address?: Maybe<AddressInfo>;
  availability?: Maybe<Array<Availability>>;
  beverageCategory?: Maybe<Array<BeverageCategory>>;
  brandingLogo?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Array<RestaurantCategory>>;
  createdAt: Scalars['DateTimeISO']['output'];
  dineInCapacity?: Maybe<MasterCommonNumber>;
  foodType?: Maybe<Array<FoodType>>;
  integrations?: Maybe<Array<Integration>>;
  meatType?: Maybe<MeatType>;
  menus?: Maybe<Array<MenuInfo>>;
  name: MasterCommon;
  onboardingCompleted: Scalars['Boolean']['output'];
  socialInfo?: Maybe<SocialInfo>;
  status: RestaurantStatus;
  taxRates?: Maybe<Array<TaxRateInfo>>;
  timezone?: Maybe<MasterCommon>;
  type?: Maybe<RestaurantType>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
  website?: Maybe<Scalars['String']['output']>;
};

/** Restaurant category type enum. */
export enum RestaurantCategory {
  CloudKitchen = 'CloudKitchen',
  DineIn = 'DineIn',
  PremiumDineIn = 'PremiumDineIn',
  Qsr = 'QSR',
  Takeout = 'Takeout'
}

export type RestaurantInfo = {
  __typename?: 'RestaurantInfo';
  _id: Restaurant;
  city?: Maybe<MasterCommon>;
  id: Scalars['String']['output'];
  name: MasterCommon;
  status: RestaurantStatus;
};

/** Restaurant status enum. */
export enum RestaurantStatus {
  Active = 'active',
  Blocked = 'blocked',
  BlockedBySystem = 'blockedBySystem',
  Inactive = 'inactive'
}

/** Restaurant type enum. */
export enum RestaurantType {
  Independent = 'Independent',
  PartOfChain = 'PartOfChain'
}

export type SocialInfo = {
  __typename?: 'SocialInfo';
  _id: Scalars['ID']['output'];
  facebook?: Maybe<Scalars['String']['output']>;
  instagram?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
};

export type SocialInfoInput = {
  facebook?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** Types of SoftWare Enum */
export enum SoftWareEnum {
  Clover = 'Clover',
  None = 'None',
  Square = 'Square',
  Toast = 'Toast'
}

/** Enum used for storing static values of Staff Size */
export enum StaffCountEnum {
  Above40 = 'Above40',
  From0To10 = 'From0To10',
  From11to25 = 'From11to25',
  From26to40 = 'From26to40'
}

export type State = {
  __typename?: 'State';
  _id: Scalars['ID']['output'];
  abbreviation?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  status: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
  value: Scalars['String']['output'];
};

/** Status enum  */
export enum StatusEnum {
  Active = 'active',
  Inactive = 'inactive'
}

export type TaxRate = {
  __typename?: 'TaxRate';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  default: Scalars['Boolean']['output'];
  name: MasterCommon;
  restaurantId: Restaurant;
  salesTax: MasterCommonNumber;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

export type TaxRateInfo = {
  __typename?: 'TaxRateInfo';
  _id: Scalars['ID']['output'];
  default: Scalars['Boolean']['output'];
  name: MasterCommon;
  salesTax: MasterCommonNumber;
};

export type TaxRateInput = {
  default: Scalars['Boolean']['input'];
  name: MasterCommonInput;
  salesTax: MasterCommonInputNumber;
};

export type Teams = {
  __typename?: 'Teams';
  _id: Scalars['ID']['output'];
  accountPreferences?: Maybe<AccountPreference>;
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  onboardingStatus: TeamsOnboardingEnum;
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user?: Maybe<User>;
};

/** Team member onboarding status enum. */
export enum TeamsOnboardingEnum {
  Completed = 'completed',
  EmailPending = 'emailPending'
}

export type TestEmailInput = {
  emails: Scalars['String']['input'];
  html: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type Timezone = {
  __typename?: 'Timezone';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  gmtOffset: Scalars['Float']['output'];
  status: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
  value: Scalars['String']['output'];
};

export type UpdateCategoryInput = {
  _id: Scalars['String']['input'];
  availability?: InputMaybe<Array<AvailabilityInput>>;
  desc?: InputMaybe<MasterCommonInput>;
  name?: InputMaybe<MasterCommonInput>;
};

export type UpdateItemInput = {
  _id: Scalars['String']['input'];
  applySalesTax?: InputMaybe<Scalars['Boolean']['input']>;
  availability?: InputMaybe<Array<AvailabilityInput>>;
  desc?: InputMaybe<MasterCommonInput>;
  hasNuts?: InputMaybe<Scalars['Boolean']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isGlutenFree?: InputMaybe<Scalars['Boolean']['input']>;
  isHalal?: InputMaybe<Scalars['Boolean']['input']>;
  isSpicy?: InputMaybe<Scalars['Boolean']['input']>;
  isVegan?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<MasterCommonInput>;
  popularItem?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<MasterCommonInputNumber>;
  status?: InputMaybe<StatusEnum>;
  upSellItem?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateMenuInput = {
  _id: Scalars['String']['input'];
  availability?: InputMaybe<Array<AvailabilityInput>>;
  name?: InputMaybe<MasterCommonInput>;
  taxRateId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<MenuTypeEnum>;
};

export type UpdateModifierGroupInput = {
  _id: Scalars['String']['input'];
  maxSelections?: InputMaybe<MasterCommonInputNumber>;
  minSelections?: InputMaybe<MasterCommonInputNumber>;
  name?: InputMaybe<MasterCommonInput>;
  optional?: InputMaybe<Scalars['Boolean']['input']>;
  pricingType?: InputMaybe<PriceTypeEnum>;
};

export type UpdateModifierInput = {
  _id: Scalars['String']['input'];
  name?: InputMaybe<MasterCommonInput>;
  preSelect?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<MasterCommonInputNumber>;
};

export type UpdateRestaurantDetailsInput = {
  address?: InputMaybe<AddressInfoInput>;
  availability?: InputMaybe<Array<AvailabilityInput>>;
  beverageCategory?: InputMaybe<Array<BeverageCategory>>;
  brandingLogo?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Array<RestaurantCategory>>;
  dineInCapacity?: InputMaybe<MasterCommonInputNumber>;
  foodType?: InputMaybe<Array<FoodType>>;
  meatType?: InputMaybe<MeatType>;
  name?: InputMaybe<MasterCommonInput>;
  socialInfo?: InputMaybe<SocialInfoInput>;
  timezone?: InputMaybe<MasterCommonInput>;
  type?: InputMaybe<RestaurantType>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRestaurantInput = {
  address?: InputMaybe<AddressInfoInput>;
  availability?: InputMaybe<Array<AvailabilityInput>>;
  brandingLogo?: InputMaybe<Scalars['String']['input']>;
  locationName?: InputMaybe<MasterCommonInput>;
  socialInfo?: InputMaybe<SocialInfoInput>;
  status: RestaurantStatus;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaxRateInput = {
  _id: Scalars['String']['input'];
  default?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<MasterCommonInput>;
  salesTax?: InputMaybe<MasterCommonInputNumber>;
};

export type UpdateUserProfileInput = {
  address?: InputMaybe<AddressInfoInput>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  businessType?: InputMaybe<BusinessTypeEnum>;
  dob?: InputMaybe<Scalars['DateTimeISO']['input']>;
  ein?: InputMaybe<Scalars['String']['input']>;
  employeeSize?: InputMaybe<StaffCountEnum>;
  establishedAt?: InputMaybe<Scalars['String']['input']>;
  estimatedRevenue?: InputMaybe<EstimatedRevenueEnum>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  accessHistory?: Maybe<Array<AccessHistory>>;
  accountPreferences?: Maybe<AccountPreference>;
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastLoggedIn: Scalars['DateTimeISO']['output'];
  lastLoggedOut: Scalars['DateTimeISO']['output'];
  lastName: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  role: UserRole;
  status: UserStatus;
  statusUpdatedBy?: Maybe<Admin>;
  updatedAt: Scalars['DateTimeISO']['output'];
  verificationRejections?: Maybe<Array<RejectRecord>>;
};

/** User roles  */
export enum UserRole {
  Accountant = 'Accountant',
  Manager = 'Manager',
  MarketingPartner = 'MarketingPartner',
  Owner = 'Owner'
}

/** UserStatus type enum  */
export enum UserStatus {
  Active = 'active',
  Blocked = 'blocked',
  InternalVerificationPending = 'internalVerificationPending',
  OnboardingPending = 'onboardingPending',
  PaymentPending = 'paymentPending',
  RestaurantOnboardingPending = 'restaurantOnboardingPending'
}

export type VerifyUserDetails = {
  accountPreferences: AccountPreferenceInput;
  email: Scalars['String']['input'];
  emailOtp: Scalars['String']['input'];
  emailOtpVerifyKey: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type WaitListUser = {
  __typename?: 'WaitListUser';
  _id?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  number: Scalars['String']['output'];
  restaurantName: Scalars['String']['output'];
  software: SoftWareEnum;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  website: Scalars['String']['output'];
};

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: boolean };

export type GenerateOtpForLoginQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type GenerateOtpForLoginQuery = { __typename?: 'Query', generateOtpForLogin: string };

export type MeUserQueryVariables = Exact<{ [key: string]: never; }>;


export type MeUserQuery = { __typename?: 'Query', meUser: { __typename?: 'User', _id: string, firstName: string, lastName: string, status: UserStatus, email: string, phone: string, accountPreferences?: { __typename?: 'AccountPreference', whatsApp: boolean, email: boolean } | null } };

export type VerifyOtpForLoginQueryVariables = Exact<{
  key: Scalars['String']['input'];
  input: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type VerifyOtpForLoginQuery = { __typename?: 'Query', verifyOtpForLogin: boolean };

export type AddUserMutationVariables = Exact<{
  input: AddUserInput;
}>;


export type AddUserMutation = { __typename?: 'Mutation', addUser: string };

export type VerifyUserDetailsMutationVariables = Exact<{
  input: VerifyUserDetails;
}>;


export type VerifyUserDetailsMutation = { __typename?: 'Mutation', verifyUserDetails: boolean };

export type GetBusinessDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBusinessDetailsQuery = { __typename?: 'Query', getBusinessDetails: { __typename?: 'Business', businessName?: string | null, estimatedRevenue?: EstimatedRevenueEnum | null, employeeSize?: StaffCountEnum | null, businessType?: BusinessTypeEnum | null, restaurants?: Array<{ __typename?: 'RestaurantInfo', id: string, name: { __typename?: 'MasterCommon', value: string } }> | null } };

export type ChangeCategoryStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ChangeCategoryStatusMutation = { __typename?: 'Mutation', changeCategoryStatus: boolean };

export type AddItemToCategoryMutationVariables = Exact<{
  categoryId: Scalars['String']['input'];
  itemId: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddItemToCategoryMutation = { __typename?: 'Mutation', addItemsToCategory: boolean };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: boolean };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', getCategories: Array<{ __typename?: 'Category', _id: string, status: StatusEnum, name: { __typename?: 'MasterCommon', value: string }, desc: { __typename?: 'MasterCommon', value: string }, items: Array<{ __typename?: 'ItemInfo', _id: { __typename?: 'Item', _id: string }, name?: { __typename?: 'MasterCommon', value: string } | null }> }> };

export type GetItemsForCategoryDropdownQueryVariables = Exact<{
  field: Scalars['String']['input'];
  operator: FilterOperatorsEnum;
  value?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetItemsForCategoryDropdownQuery = { __typename?: 'Query', getItems: Array<{ __typename?: 'Item', _id: string, image?: string | null, name: { __typename?: 'MasterCommon', value: string }, price: { __typename?: 'MasterCommonNumber', value: number } }> };

export type AddCategoryMutationVariables = Exact<{
  input: AddCategoryInput;
}>;


export type AddCategoryMutation = { __typename?: 'Mutation', addCategory: boolean };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', getCategory: { __typename?: 'Category', _id: string, status: StatusEnum, createdAt: any, updatedAt: any, name: { __typename?: 'MasterCommon', value: string }, desc: { __typename?: 'MasterCommon', value: string }, items: Array<{ __typename?: 'ItemInfo', id: string, status: StatusEnum, name?: { __typename?: 'MasterCommon', value: string } | null, _id: { __typename?: 'Item', _id: string }, price: { __typename?: 'MasterCommonNumber', value: number } }> } };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: boolean };

export type RemoveItemFromCategoryMutationVariables = Exact<{
  itemId: Scalars['String']['input'];
  categoryId: Scalars['String']['input'];
}>;


export type RemoveItemFromCategoryMutation = { __typename?: 'Mutation', removeItemFromCategory: boolean };

export type ChangeItemStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ChangeItemStatusMutation = { __typename?: 'Mutation', changeItemStatus: boolean };

export type DeleteItemMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteItemMutation = { __typename?: 'Mutation', deleteItem: boolean };

export type GetItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetItemsQuery = { __typename?: 'Query', getItems: Array<{ __typename?: 'Item', _id: string, status: StatusEnum, name: { __typename?: 'MasterCommon', value: string }, desc: { __typename?: 'MasterCommon', value: string }, modifierGroup: Array<{ __typename?: 'ModifierGroupInfo', id: string, name: { __typename?: 'MasterCommon', _id: string, value: string } }>, price: { __typename?: 'MasterCommonNumber', _id: string, value: number } }> };

export type GetItemQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetItemQuery = { __typename?: 'Query', getItem: { __typename?: 'Item', _id: string, status: StatusEnum, image?: string | null, applySalesTax: boolean, popularItem: boolean, upSellItem: boolean, isSpicy: boolean, isVegan: boolean, isHalal: boolean, isGlutenFree: boolean, hasNuts: boolean, createdAt: any, updatedAt: any, name: { __typename?: 'MasterCommon', value: string }, desc: { __typename?: 'MasterCommon', value: string }, modifierGroup: Array<{ __typename?: 'ModifierGroupInfo', pricingType: PriceTypeEnum, id: string, name: { __typename?: 'MasterCommon', value: string } }>, price: { __typename?: 'MasterCommonNumber', value: number }, availability?: Array<{ __typename?: 'Availability', day: string, active: boolean, hours: Array<{ __typename?: 'Hours', start: any, end: any }> }> | null } };

export type AddItemMutationVariables = Exact<{
  input: AddItemInput;
  modifierGroups: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddItemMutation = { __typename?: 'Mutation', addItem: boolean };

export type UpdateItemMutationVariables = Exact<{
  input: UpdateItemInput;
}>;


export type UpdateItemMutation = { __typename?: 'Mutation', updateItem: boolean };

export type GetModifierGroupsforItemsDropDownQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModifierGroupsforItemsDropDownQuery = { __typename?: 'Query', getModifierGroups: Array<{ __typename?: 'ModifierGroup', _id: string, name: { __typename?: 'MasterCommon', value: string }, modifiers: Array<{ __typename?: 'ModifierInfo', name: { __typename?: 'MasterCommon', value: string } }> }> };

export type RemoveModifierGroupFromItemMutationVariables = Exact<{
  itemId: Scalars['String']['input'];
  modifierGroupId: Scalars['String']['input'];
}>;


export type RemoveModifierGroupFromItemMutation = { __typename?: 'Mutation', removeModifierGroupFromItem: boolean };

export type AddModifierGroupToItemMutationVariables = Exact<{
  modifierGroupId: Array<Scalars['String']['input']> | Scalars['String']['input'];
  itemId: Scalars['String']['input'];
}>;


export type AddModifierGroupToItemMutation = { __typename?: 'Mutation', addModifierGroupToItem: boolean };

export type GetActiveStatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveStatesQuery = { __typename?: 'Query', getActiveStates: Array<{ __typename?: 'State', value: string, abbreviation?: string | null, _id: string }> };

export type GetActiveTimezonesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveTimezonesQuery = { __typename?: 'Query', getActiveTimezones: Array<{ __typename?: 'Timezone', value: string, gmtOffset: number, _id: string }> };

export type GetMenuByRestaurantQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMenuByRestaurantQuery = { __typename?: 'Query', getMenuByRestaurant: Array<{ __typename?: 'Menu', _id: string, status: StatusEnum, createdAt: any, updatedAt: any, type: MenuTypeEnum, name: { __typename?: 'MasterCommon', value: string }, categories: Array<{ __typename?: 'CategoryInfo', name?: { __typename?: 'MasterCommon', value: string } | null }> }> };

export type AddMenuMutationVariables = Exact<{
  input: AddMenuInput;
}>;


export type AddMenuMutation = { __typename?: 'Mutation', addMenu: boolean };

export type GetCategoriesForMenuDropdownQueryVariables = Exact<{
  field: Scalars['String']['input'];
  operator: FilterOperatorsEnum;
  value?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCategoriesForMenuDropdownQuery = { __typename?: 'Query', getCategories: Array<{ __typename?: 'Category', _id: string, status: StatusEnum, name: { __typename?: 'MasterCommon', value: string }, desc: { __typename?: 'MasterCommon', value: string }, items: Array<{ __typename?: 'ItemInfo', name?: { __typename?: 'MasterCommon', value: string } | null }> }> };

export type ChangeMenuStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ChangeMenuStatusMutation = { __typename?: 'Mutation', changeMenuStatus: boolean };

export type DeleteMenuMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteMenuMutation = { __typename?: 'Mutation', deleteMenu: boolean };

export type AddCategoryToMenuMutationVariables = Exact<{
  categoryId: Array<Scalars['String']['input']> | Scalars['String']['input'];
  menuId: Scalars['String']['input'];
}>;


export type AddCategoryToMenuMutation = { __typename?: 'Mutation', addCategoriesToMenu: boolean };

export type GetMenusByTypeQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetMenusByTypeQuery = { __typename?: 'Query', getMenusByType: Array<{ __typename?: 'Menu', _id: string, status: StatusEnum, createdAt: any, updatedAt: any, type: MenuTypeEnum, name: { __typename?: 'MasterCommon', value: string }, categories: Array<{ __typename?: 'CategoryInfo', status: StatusEnum, name?: { __typename?: 'MasterCommon', value: string, _id: string } | null, _id: { __typename?: 'Category', _id: string } }> }> };

export type UpdateMenuMutationVariables = Exact<{
  input: UpdateMenuInput;
}>;


export type UpdateMenuMutation = { __typename?: 'Mutation', updateMenu: boolean };

export type RemoveCategoryFromMenuMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  categoryId: Scalars['String']['input'];
}>;


export type RemoveCategoryFromMenuMutation = { __typename?: 'Mutation', removeCategoryFromMenu: boolean };

export type GetAllMenusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMenusQuery = { __typename?: 'Query', getAllMenus: Array<{ __typename?: 'Menu', _id: string, type: MenuTypeEnum, createdAt: any, updatedAt: any, status: StatusEnum, name: { __typename?: 'MasterCommon', value: string }, categories: Array<{ __typename?: 'CategoryInfo', name?: { __typename?: 'MasterCommon', value: string } | null }> }> };

export type GetModifierGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModifierGroupsQuery = { __typename?: 'Query', getModifierGroups: Array<{ __typename?: 'ModifierGroup', _id: string, status: StatusEnum, name: { __typename?: 'MasterCommon', value: string } }> };

export type UpdateModifierGroupMutationVariables = Exact<{
  input: UpdateModifierGroupInput;
}>;


export type UpdateModifierGroupMutation = { __typename?: 'Mutation', updateModifierGroup: boolean };

export type AddModifierGroupMutationVariables = Exact<{
  input: AddModifierGroupInput;
  modifiers: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddModifierGroupMutation = { __typename?: 'Mutation', addModifierGroup: boolean };

export type GetModifiersforGroupDropDownQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModifiersforGroupDropDownQuery = { __typename?: 'Query', getModifiers: Array<{ __typename?: 'Modifier', _id: string, name: { __typename?: 'MasterCommon', value: string }, price: { __typename?: 'MasterCommonNumber', value: number } }> };

export type RemoveModifierGroupMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveModifierGroupMutation = { __typename?: 'Mutation', removeModifierGroup: boolean };

export type GetModifierGroupQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetModifierGroupQuery = { __typename?: 'Query', getModifierGroup: { __typename?: 'ModifierGroup', _id: string, pricingType: PriceTypeEnum, optional: boolean, name: { __typename?: 'MasterCommon', value: string }, modifiers: Array<{ __typename?: 'ModifierInfo', id: string, name: { __typename?: 'MasterCommon', value: string }, price: { __typename?: 'MasterCommonNumber', value: number } }>, maxSelections: { __typename?: 'MasterCommonNumber', value: number } } };

export type RemoveModifierFromModifierGroupMutationVariables = Exact<{
  modifierGroupId: Scalars['String']['input'];
  modifierId: Scalars['String']['input'];
}>;


export type RemoveModifierFromModifierGroupMutation = { __typename?: 'Mutation', removeModifierFromModifierGroup: boolean };

export type AddModifierToModifierGroupMutationVariables = Exact<{
  modifierIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  modifierGroupId: Scalars['String']['input'];
}>;


export type AddModifierToModifierGroupMutation = { __typename?: 'Mutation', addModifierToModifierGroup: boolean };

export type ChangeModifierGroupStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ChangeModifierGroupStatusMutation = { __typename?: 'Mutation', changeModifierGroupStatus: boolean };

export type GetModifiersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModifiersQuery = { __typename?: 'Query', getModifiers: Array<{ __typename?: 'Modifier', _id: string, name: { __typename?: 'MasterCommon', value: string }, price: { __typename?: 'MasterCommonNumber', value: number } }> };

export type AddModifierMutationVariables = Exact<{
  input: AddModifierInput;
}>;


export type AddModifierMutation = { __typename?: 'Mutation', addModifier: boolean };

export type DeleteModifierMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteModifierMutation = { __typename?: 'Mutation', deleteModifier: boolean };

export type GetModifierQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetModifierQuery = { __typename?: 'Query', getModifier: { __typename?: 'Modifier', _id: string, name: { __typename?: 'MasterCommon', value: string }, price: { __typename?: 'MasterCommonNumber', value: number } } };

export type UpdateModifierMutationVariables = Exact<{
  input: UpdateModifierInput;
}>;


export type UpdateModifierMutation = { __typename?: 'Mutation', updateModifier: boolean };

export type AllPlacesQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type AllPlacesQuery = { __typename?: 'Query', getPlacesList: Array<{ __typename?: 'Places', placeId: string, displayName: string }> };

export type PlaceDetailsQueryVariables = Exact<{
  placeId: Scalars['String']['input'];
}>;


export type PlaceDetailsQuery = { __typename?: 'Query', getPlaceDetails?: { __typename?: 'PlaceDetail', latitude: number, longitude: number } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile: boolean };

export type BusinessOnboardingMutationVariables = Exact<{
  input: RegisterBusinessInput;
}>;


export type BusinessOnboardingMutation = { __typename?: 'Mutation', businessOnboarding: boolean };

export type CompleteBusinessOnboardingMutationVariables = Exact<{ [key: string]: never; }>;


export type CompleteBusinessOnboardingMutation = { __typename?: 'Mutation', completeBusinessOnboarding: boolean };

export type GetBusinessOnboardingDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBusinessOnboardingDetailsQuery = { __typename?: 'Query', getBusinessOnboardingDetails: { __typename?: 'Business', ein?: string | null, businessName?: string | null, employeeSize?: StaffCountEnum | null, dob?: any | null, establishedAt?: string | null, businessType?: BusinessTypeEnum | null, estimatedRevenue?: EstimatedRevenueEnum | null, address?: { __typename?: 'AddressInfo', addressLine1: { __typename?: 'MasterCommon', value: string }, addressLine2?: { __typename?: 'MasterCommon', value: string } | null, state: { __typename?: 'MasterCommon', _id: string, value: string }, city: { __typename?: 'MasterCommon', value: string }, postcode: { __typename?: 'MasterCommon', value: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null, place?: { __typename?: 'Places', displayName: string, placeId: string } | null } | null } };

export type RestaurantOnboardingMutationVariables = Exact<{
  input: UpdateRestaurantDetailsInput;
}>;


export type RestaurantOnboardingMutation = { __typename?: 'Mutation', restaurantOnboarding: boolean };

export type CompleteRestaurantOnboardingQueryVariables = Exact<{ [key: string]: never; }>;


export type CompleteRestaurantOnboardingQuery = { __typename?: 'Query', completeRestaurantOnboarding: boolean };

export type GetRestaurantOnboardingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRestaurantOnboardingDataQuery = { __typename?: 'Query', getRestaurantOnboardingData: { __typename?: 'Restaurant', brandingLogo?: string | null, website?: string | null, category?: Array<RestaurantCategory> | null, beverageCategory?: Array<BeverageCategory> | null, foodType?: Array<FoodType> | null, meatType?: MeatType | null, type?: RestaurantType | null, name: { __typename?: 'MasterCommon', value: string }, address?: { __typename?: 'AddressInfo', addressLine1: { __typename?: 'MasterCommon', value: string }, addressLine2?: { __typename?: 'MasterCommon', value: string } | null, state: { __typename?: 'MasterCommon', _id: string, value: string }, city: { __typename?: 'MasterCommon', value: string }, postcode: { __typename?: 'MasterCommon', value: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null, place?: { __typename?: 'Places', displayName: string, placeId: string } | null } | null, socialInfo?: { __typename?: 'SocialInfo', facebook?: string | null, instagram?: string | null, twitter?: string | null } | null, availability?: Array<{ __typename?: 'Availability', day: string, active: boolean, hours: Array<{ __typename?: 'Hours', start: any, end: any }> }> | null, timezone?: { __typename?: 'MasterCommon', _id: string, value: string } | null, dineInCapacity?: { __typename?: 'MasterCommonNumber', value: number } | null } };

export type GetUserRestaurantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserRestaurantsQuery = { __typename?: 'Query', getUserRestaurants: Array<{ __typename?: 'Restaurant', _id: string, status: RestaurantStatus, name: { __typename?: 'MasterCommon', value: string } }> };

export type SetRestaurantIdAsCookieQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SetRestaurantIdAsCookieQuery = { __typename?: 'Query', setRestaurantIdAsCookie: boolean };

export type GetRestaurantDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRestaurantDetailsQuery = { __typename?: 'Query', getRestaurantDetails: { __typename?: 'Restaurant', _id: string, brandingLogo?: string | null, website?: string | null, name: { __typename?: 'MasterCommon', value: string }, taxRates?: Array<{ __typename?: 'TaxRateInfo', default: boolean, name: { __typename?: 'MasterCommon', value: string }, salesTax: { __typename?: 'MasterCommonNumber', value: number } }> | null } };

export type AddTaxRateMutationVariables = Exact<{
  input: TaxRateInput;
}>;


export type AddTaxRateMutation = { __typename?: 'Mutation', addTaxRate: string };

export type AddTaxRateInRestaurantMutationVariables = Exact<{
  taxRateId: Scalars['String']['input'];
}>;


export type AddTaxRateInRestaurantMutation = { __typename?: 'Mutation', addTaxRateInRestaurant: boolean };

export type AddTeamMemberMutationVariables = Exact<{
  AddTeamMemberInput: AddTeamMemberInput;
}>;


export type AddTeamMemberMutation = { __typename?: 'Mutation', addTeamMember: boolean };

export type GetTeamMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamMembersQuery = { __typename?: 'Query', getTeamMembers: Array<{ __typename?: 'Teams', _id: string, firstName: string, lastName: string, email: string, phone: string, role: string, onboardingStatus: TeamsOnboardingEnum, createdAt: any, updatedAt: any }> };

export type RemoveTeamMemberMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
}>;


export type RemoveTeamMemberMutation = { __typename?: 'Mutation', removeTeamMember: boolean };


export const LogoutDocument = gql`
    query Logout {
  logout
}
    `;
export const GenerateOtpForLoginDocument = gql`
    query GenerateOtpForLogin($input: String!) {
  generateOtpForLogin(input: $input)
}
    `;
export const MeUserDocument = gql`
    query MeUser {
  meUser {
    _id
    firstName
    lastName
    status
    email
    phone
    accountPreferences {
      whatsApp
      email
    }
  }
}
    `;
export const VerifyOtpForLoginDocument = gql`
    query VerifyOtpForLogin($key: String!, $input: String!, $otp: String!) {
  verifyOtpForLogin(key: $key, input: $input, otp: $otp)
}
    `;
export const AddUserDocument = gql`
    mutation addUser($input: AddUserInput!) {
  addUser(input: $input)
}
    `;
export const VerifyUserDetailsDocument = gql`
    mutation verifyUserDetails($input: VerifyUserDetails!) {
  verifyUserDetails(input: $input)
}
    `;
export const GetBusinessDetailsDocument = gql`
    query getBusinessDetails {
  getBusinessDetails {
    businessName
    estimatedRevenue
    employeeSize
    employeeSize
    businessType
    restaurants {
      name {
        value
      }
      id
    }
  }
}
    `;
export const ChangeCategoryStatusDocument = gql`
    mutation changeCategoryStatus($id: String!) {
  changeCategoryStatus(id: $id)
}
    `;
export const AddItemToCategoryDocument = gql`
    mutation addItemToCategory($categoryId: String!, $itemId: [String!]!) {
  addItemsToCategory(categoryId: $categoryId, itemIds: $itemId)
}
    `;
export const DeleteCategoryDocument = gql`
    mutation deleteCategory($id: String!) {
  deleteCategory(id: $id)
}
    `;
export const GetCategoriesDocument = gql`
    query getCategories {
  getCategories {
    _id
    name {
      value
    }
    desc {
      value
    }
    status
    items {
      _id {
        _id
      }
      name {
        value
      }
    }
  }
}
    `;
export const GetItemsForCategoryDropdownDocument = gql`
    query getItemsForCategoryDropdown($field: String!, $operator: FilterOperatorsEnum!, $value: String) {
  getItems(filter: {field: $field, operator: $operator, value: $value}) {
    _id
    name {
      value
    }
    price {
      value
    }
    image
  }
}
    `;
export const AddCategoryDocument = gql`
    mutation addCategory($input: AddCategoryInput!) {
  addCategory(input: $input)
}
    `;
export const GetCategoryDocument = gql`
    query getCategory($id: String!) {
  getCategory(id: $id) {
    _id
    name {
      value
    }
    desc {
      value
    }
    status
    items {
      id
      name {
        value
      }
      _id {
        _id
      }
      price {
        value
      }
      status
    }
    createdAt
    updatedAt
  }
}
    `;
export const UpdateCategoryDocument = gql`
    mutation updateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input)
}
    `;
export const RemoveItemFromCategoryDocument = gql`
    mutation removeItemFromCategory($itemId: String!, $categoryId: String!) {
  removeItemFromCategory(categoryId: $categoryId, itemId: $itemId)
}
    `;
export const ChangeItemStatusDocument = gql`
    mutation changeItemStatus($id: String!) {
  changeItemStatus(id: $id)
}
    `;
export const DeleteItemDocument = gql`
    mutation deleteItem($id: String!) {
  deleteItem(id: $id)
}
    `;
export const GetItemsDocument = gql`
    query getItems {
  getItems {
    _id
    name {
      value
    }
    desc {
      value
    }
    status
    modifierGroup {
      id
      name {
        _id
        value
      }
    }
    price {
      _id
      value
    }
  }
}
    `;
export const GetItemDocument = gql`
    query getItem($id: String!) {
  getItem(id: $id) {
    _id
    name {
      value
    }
    desc {
      value
    }
    status
    modifierGroup {
      name {
        value
      }
      pricingType
      id
    }
    image
    price {
      value
    }
    applySalesTax
    popularItem
    upSellItem
    isSpicy
    isVegan
    isHalal
    isGlutenFree
    hasNuts
    availability {
      day
      hours {
        start
        end
      }
      active
    }
    createdAt
    updatedAt
  }
}
    `;
export const AddItemDocument = gql`
    mutation addItem($input: AddItemInput!, $modifierGroups: [String!]!) {
  addItem(input: $input, modifierGroups: $modifierGroups)
}
    `;
export const UpdateItemDocument = gql`
    mutation updateItem($input: UpdateItemInput!) {
  updateItem(input: $input)
}
    `;
export const GetModifierGroupsforItemsDropDownDocument = gql`
    query getModifierGroupsforItemsDropDown {
  getModifierGroups {
    _id
    name {
      value
    }
    modifiers {
      name {
        value
      }
    }
  }
}
    `;
export const RemoveModifierGroupFromItemDocument = gql`
    mutation removeModifierGroupFromItem($itemId: String!, $modifierGroupId: String!) {
  removeModifierGroupFromItem(itemId: $itemId, modifierGroupId: $modifierGroupId)
}
    `;
export const AddModifierGroupToItemDocument = gql`
    mutation addModifierGroupToItem($modifierGroupId: [String!]!, $itemId: String!) {
  addModifierGroupToItem(modifierGroupIds: $modifierGroupId, itemId: $itemId)
}
    `;
export const GetActiveStatesDocument = gql`
    query getActiveStates {
  getActiveStates {
    value
    abbreviation
    _id
  }
}
    `;
export const GetActiveTimezonesDocument = gql`
    query getActiveTimezones {
  getActiveTimezones {
    value
    gmtOffset
    _id
  }
}
    `;
export const GetMenuByRestaurantDocument = gql`
    query getMenuByRestaurant {
  getMenuByRestaurant {
    _id
    name {
      value
    }
    status
    createdAt
    updatedAt
    type
    categories {
      name {
        value
      }
    }
  }
}
    `;
export const AddMenuDocument = gql`
    mutation addMenu($input: AddMenuInput!) {
  addMenu(input: $input)
}
    `;
export const GetCategoriesForMenuDropdownDocument = gql`
    query getCategoriesForMenuDropdown($field: String!, $operator: FilterOperatorsEnum!, $value: String) {
  getCategories(filter: {field: $field, operator: $operator, value: $value}) {
    _id
    name {
      value
    }
    desc {
      value
    }
    status
    items {
      name {
        value
      }
    }
  }
}
    `;
export const ChangeMenuStatusDocument = gql`
    mutation changeMenuStatus($id: String!) {
  changeMenuStatus(id: $id)
}
    `;
export const DeleteMenuDocument = gql`
    mutation deleteMenu($id: String!) {
  deleteMenu(id: $id)
}
    `;
export const AddCategoryToMenuDocument = gql`
    mutation addCategoryToMenu($categoryId: [String!]!, $menuId: String!) {
  addCategoriesToMenu(categoryIds: $categoryId, menuId: $menuId)
}
    `;
export const GetMenusByTypeDocument = gql`
    query getMenusByType($id: String!) {
  getMenusByType(id: $id) {
    _id
    name {
      value
    }
    status
    createdAt
    updatedAt
    type
    categories {
      name {
        value
        _id
      }
      status
      _id {
        _id
      }
    }
  }
}
    `;
export const UpdateMenuDocument = gql`
    mutation updateMenu($input: UpdateMenuInput!) {
  updateMenu(input: $input)
}
    `;
export const RemoveCategoryFromMenuDocument = gql`
    mutation removeCategoryFromMenu($menuId: String!, $categoryId: String!) {
  removeCategoryFromMenu(categoryId: $categoryId, menuId: $menuId)
}
    `;
export const GetAllMenusDocument = gql`
    query getAllMenus {
  getAllMenus {
    _id
    type
    name {
      value
    }
    categories {
      name {
        value
      }
    }
    createdAt
    updatedAt
    status
  }
}
    `;
export const GetModifierGroupsDocument = gql`
    query getModifierGroups {
  getModifierGroups {
    _id
    status
    name {
      value
    }
  }
}
    `;
export const UpdateModifierGroupDocument = gql`
    mutation updateModifierGroup($input: UpdateModifierGroupInput!) {
  updateModifierGroup(input: $input)
}
    `;
export const AddModifierGroupDocument = gql`
    mutation addModifierGroup($input: AddModifierGroupInput!, $modifiers: [String!]!) {
  addModifierGroup(input: $input, modifiers: $modifiers)
}
    `;
export const GetModifiersforGroupDropDownDocument = gql`
    query getModifiersforGroupDropDown {
  getModifiers {
    _id
    name {
      value
    }
    price {
      value
    }
  }
}
    `;
export const RemoveModifierGroupDocument = gql`
    mutation removeModifierGroup($id: String!) {
  removeModifierGroup(id: $id)
}
    `;
export const GetModifierGroupDocument = gql`
    query getModifierGroup($id: String!) {
  getModifierGroup(id: $id) {
    _id
    name {
      value
    }
    pricingType
    optional
    modifiers {
      name {
        value
      }
      price {
        value
      }
      id
    }
    maxSelections {
      value
    }
  }
}
    `;
export const RemoveModifierFromModifierGroupDocument = gql`
    mutation removeModifierFromModifierGroup($modifierGroupId: String!, $modifierId: String!) {
  removeModifierFromModifierGroup(
    modifierGroupId: $modifierGroupId
    modifierId: $modifierId
  )
}
    `;
export const AddModifierToModifierGroupDocument = gql`
    mutation addModifierToModifierGroup($modifierIds: [String!]!, $modifierGroupId: String!) {
  addModifierToModifierGroup(
    modifierGroupId: $modifierGroupId
    modifierIds: $modifierIds
  )
}
    `;
export const ChangeModifierGroupStatusDocument = gql`
    mutation changeModifierGroupStatus($id: String!) {
  changeModifierGroupStatus(id: $id)
}
    `;
export const GetModifiersDocument = gql`
    query getModifiers {
  getModifiers {
    _id
    name {
      value
    }
    price {
      value
    }
  }
}
    `;
export const AddModifierDocument = gql`
    mutation addModifier($input: AddModifierInput!) {
  addModifier(input: $input)
}
    `;
export const DeleteModifierDocument = gql`
    mutation deleteModifier($id: String!) {
  deleteModifier(id: $id)
}
    `;
export const GetModifierDocument = gql`
    query getModifier($id: String!) {
  getModifier(id: $id) {
    _id
    name {
      value
    }
    price {
      value
    }
  }
}
    `;
export const UpdateModifierDocument = gql`
    mutation updateModifier($input: UpdateModifierInput!) {
  updateModifier(input: $input)
}
    `;
export const AllPlacesDocument = gql`
    query AllPlaces($input: String!) {
  getPlacesList(input: $input) {
    placeId
    displayName
  }
}
    `;
export const PlaceDetailsDocument = gql`
    query PlaceDetails($placeId: String!) {
  getPlaceDetails(placeId: $placeId) {
    latitude
    longitude
  }
}
    `;
export const UpdateUserProfileDocument = gql`
    mutation updateUserProfile($input: UpdateUserProfileInput!) {
  updateUserProfile(input: $input)
}
    `;
export const BusinessOnboardingDocument = gql`
    mutation businessOnboarding($input: RegisterBusinessInput!) {
  businessOnboarding(input: $input)
}
    `;
export const CompleteBusinessOnboardingDocument = gql`
    mutation completeBusinessOnboarding {
  completeBusinessOnboarding
}
    `;
export const GetBusinessOnboardingDetailsDocument = gql`
    query getBusinessOnboardingDetails {
  getBusinessOnboardingDetails {
    ein
    businessName
    address {
      addressLine1 {
        value
      }
      addressLine2 {
        value
      }
      state {
        _id
        value
      }
      city {
        value
      }
      postcode {
        value
      }
      coordinate {
        coordinates
      }
      place {
        displayName
        placeId
      }
    }
    employeeSize
    dob
    establishedAt
    businessType
    estimatedRevenue
  }
}
    `;
export const RestaurantOnboardingDocument = gql`
    mutation restaurantOnboarding($input: UpdateRestaurantDetailsInput!) {
  restaurantOnboarding(input: $input)
}
    `;
export const CompleteRestaurantOnboardingDocument = gql`
    query completeRestaurantOnboarding {
  completeRestaurantOnboarding
}
    `;
export const GetRestaurantOnboardingDataDocument = gql`
    query getRestaurantOnboardingData {
  getRestaurantOnboardingData {
    name {
      value
    }
    address {
      addressLine1 {
        value
      }
      addressLine2 {
        value
      }
      state {
        _id
        value
      }
      city {
        value
      }
      postcode {
        value
      }
      coordinate {
        coordinates
      }
      place {
        displayName
        placeId
      }
    }
    brandingLogo
    socialInfo {
      facebook
      instagram
      twitter
    }
    website
    availability {
      day
      hours {
        start
        end
      }
      active
    }
    timezone {
      _id
      value
    }
    category
    beverageCategory
    foodType
    meatType
    type
    dineInCapacity {
      value
    }
  }
}
    `;
export const GetUserRestaurantsDocument = gql`
    query getUserRestaurants {
  getUserRestaurants {
    name {
      value
    }
    _id
    status
  }
}
    `;
export const SetRestaurantIdAsCookieDocument = gql`
    query setRestaurantIdAsCookie($id: String!) {
  setRestaurantIdAsCookie(id: $id)
}
    `;
export const GetRestaurantDetailsDocument = gql`
    query getRestaurantDetails {
  getRestaurantDetails {
    _id
    name {
      value
    }
    brandingLogo
    website
    taxRates {
      name {
        value
      }
      salesTax {
        value
      }
      default
    }
  }
}
    `;
export const AddTaxRateDocument = gql`
    mutation addTaxRate($input: TaxRateInput!) {
  addTaxRate(input: $input)
}
    `;
export const AddTaxRateInRestaurantDocument = gql`
    mutation addTaxRateInRestaurant($taxRateId: String!) {
  addTaxRateInRestaurant(taxRateId: $taxRateId)
}
    `;
export const AddTeamMemberDocument = gql`
    mutation addTeamMember($AddTeamMemberInput: AddTeamMemberInput!) {
  addTeamMember(input: $AddTeamMemberInput)
}
    `;
export const GetTeamMembersDocument = gql`
    query getTeamMembers {
  getTeamMembers {
    _id
    firstName
    lastName
    email
    phone
    role
    onboardingStatus
    createdAt
    updatedAt
  }
}
    `;
export const RemoveTeamMemberDocument = gql`
    mutation removeTeamMember($teamId: String!) {
  removeTeamMember(teamId: $teamId)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Logout(variables?: LogoutQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LogoutQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LogoutQuery>(LogoutDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Logout', 'query', variables);
    },
    GenerateOtpForLogin(variables: GenerateOtpForLoginQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GenerateOtpForLoginQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenerateOtpForLoginQuery>(GenerateOtpForLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GenerateOtpForLogin', 'query', variables);
    },
    MeUser(variables?: MeUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MeUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeUserQuery>(MeUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MeUser', 'query', variables);
    },
    VerifyOtpForLogin(variables: VerifyOtpForLoginQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<VerifyOtpForLoginQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VerifyOtpForLoginQuery>(VerifyOtpForLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'VerifyOtpForLogin', 'query', variables);
    },
    addUser(variables: AddUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddUserMutation>(AddUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addUser', 'mutation', variables);
    },
    verifyUserDetails(variables: VerifyUserDetailsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<VerifyUserDetailsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<VerifyUserDetailsMutation>(VerifyUserDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'verifyUserDetails', 'mutation', variables);
    },
    getBusinessDetails(variables?: GetBusinessDetailsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetBusinessDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBusinessDetailsQuery>(GetBusinessDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBusinessDetails', 'query', variables);
    },
    changeCategoryStatus(variables: ChangeCategoryStatusMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ChangeCategoryStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChangeCategoryStatusMutation>(ChangeCategoryStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'changeCategoryStatus', 'mutation', variables);
    },
    addItemToCategory(variables: AddItemToCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddItemToCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddItemToCategoryMutation>(AddItemToCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addItemToCategory', 'mutation', variables);
    },
    deleteCategory(variables: DeleteCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCategoryMutation>(DeleteCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteCategory', 'mutation', variables);
    },
    getCategories(variables?: GetCategoriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetCategoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCategoriesQuery>(GetCategoriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getCategories', 'query', variables);
    },
    getItemsForCategoryDropdown(variables: GetItemsForCategoryDropdownQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetItemsForCategoryDropdownQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetItemsForCategoryDropdownQuery>(GetItemsForCategoryDropdownDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getItemsForCategoryDropdown', 'query', variables);
    },
    addCategory(variables: AddCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddCategoryMutation>(AddCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addCategory', 'mutation', variables);
    },
    getCategory(variables: GetCategoryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetCategoryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCategoryQuery>(GetCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getCategory', 'query', variables);
    },
    updateCategory(variables: UpdateCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCategoryMutation>(UpdateCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateCategory', 'mutation', variables);
    },
    removeItemFromCategory(variables: RemoveItemFromCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveItemFromCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveItemFromCategoryMutation>(RemoveItemFromCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeItemFromCategory', 'mutation', variables);
    },
    changeItemStatus(variables: ChangeItemStatusMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ChangeItemStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChangeItemStatusMutation>(ChangeItemStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'changeItemStatus', 'mutation', variables);
    },
    deleteItem(variables: DeleteItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteItemMutation>(DeleteItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteItem', 'mutation', variables);
    },
    getItems(variables?: GetItemsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetItemsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetItemsQuery>(GetItemsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getItems', 'query', variables);
    },
    getItem(variables: GetItemQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetItemQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetItemQuery>(GetItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getItem', 'query', variables);
    },
    addItem(variables: AddItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddItemMutation>(AddItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addItem', 'mutation', variables);
    },
    updateItem(variables: UpdateItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateItemMutation>(UpdateItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateItem', 'mutation', variables);
    },
    getModifierGroupsforItemsDropDown(variables?: GetModifierGroupsforItemsDropDownQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetModifierGroupsforItemsDropDownQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetModifierGroupsforItemsDropDownQuery>(GetModifierGroupsforItemsDropDownDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getModifierGroupsforItemsDropDown', 'query', variables);
    },
    removeModifierGroupFromItem(variables: RemoveModifierGroupFromItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveModifierGroupFromItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveModifierGroupFromItemMutation>(RemoveModifierGroupFromItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeModifierGroupFromItem', 'mutation', variables);
    },
    addModifierGroupToItem(variables: AddModifierGroupToItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddModifierGroupToItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddModifierGroupToItemMutation>(AddModifierGroupToItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addModifierGroupToItem', 'mutation', variables);
    },
    getActiveStates(variables?: GetActiveStatesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetActiveStatesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetActiveStatesQuery>(GetActiveStatesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getActiveStates', 'query', variables);
    },
    getActiveTimezones(variables?: GetActiveTimezonesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetActiveTimezonesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetActiveTimezonesQuery>(GetActiveTimezonesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getActiveTimezones', 'query', variables);
    },
    getMenuByRestaurant(variables?: GetMenuByRestaurantQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetMenuByRestaurantQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMenuByRestaurantQuery>(GetMenuByRestaurantDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getMenuByRestaurant', 'query', variables);
    },
    addMenu(variables: AddMenuMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddMenuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddMenuMutation>(AddMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addMenu', 'mutation', variables);
    },
    getCategoriesForMenuDropdown(variables: GetCategoriesForMenuDropdownQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetCategoriesForMenuDropdownQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCategoriesForMenuDropdownQuery>(GetCategoriesForMenuDropdownDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getCategoriesForMenuDropdown', 'query', variables);
    },
    changeMenuStatus(variables: ChangeMenuStatusMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ChangeMenuStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChangeMenuStatusMutation>(ChangeMenuStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'changeMenuStatus', 'mutation', variables);
    },
    deleteMenu(variables: DeleteMenuMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteMenuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteMenuMutation>(DeleteMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteMenu', 'mutation', variables);
    },
    addCategoryToMenu(variables: AddCategoryToMenuMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddCategoryToMenuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddCategoryToMenuMutation>(AddCategoryToMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addCategoryToMenu', 'mutation', variables);
    },
    getMenusByType(variables: GetMenusByTypeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetMenusByTypeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMenusByTypeQuery>(GetMenusByTypeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getMenusByType', 'query', variables);
    },
    updateMenu(variables: UpdateMenuMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateMenuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMenuMutation>(UpdateMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateMenu', 'mutation', variables);
    },
    removeCategoryFromMenu(variables: RemoveCategoryFromMenuMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveCategoryFromMenuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveCategoryFromMenuMutation>(RemoveCategoryFromMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeCategoryFromMenu', 'mutation', variables);
    },
    getAllMenus(variables?: GetAllMenusQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAllMenusQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllMenusQuery>(GetAllMenusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllMenus', 'query', variables);
    },
    getModifierGroups(variables?: GetModifierGroupsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetModifierGroupsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetModifierGroupsQuery>(GetModifierGroupsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getModifierGroups', 'query', variables);
    },
    updateModifierGroup(variables: UpdateModifierGroupMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateModifierGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateModifierGroupMutation>(UpdateModifierGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateModifierGroup', 'mutation', variables);
    },
    addModifierGroup(variables: AddModifierGroupMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddModifierGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddModifierGroupMutation>(AddModifierGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addModifierGroup', 'mutation', variables);
    },
    getModifiersforGroupDropDown(variables?: GetModifiersforGroupDropDownQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetModifiersforGroupDropDownQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetModifiersforGroupDropDownQuery>(GetModifiersforGroupDropDownDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getModifiersforGroupDropDown', 'query', variables);
    },
    removeModifierGroup(variables: RemoveModifierGroupMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveModifierGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveModifierGroupMutation>(RemoveModifierGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeModifierGroup', 'mutation', variables);
    },
    getModifierGroup(variables: GetModifierGroupQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetModifierGroupQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetModifierGroupQuery>(GetModifierGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getModifierGroup', 'query', variables);
    },
    removeModifierFromModifierGroup(variables: RemoveModifierFromModifierGroupMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveModifierFromModifierGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveModifierFromModifierGroupMutation>(RemoveModifierFromModifierGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeModifierFromModifierGroup', 'mutation', variables);
    },
    addModifierToModifierGroup(variables: AddModifierToModifierGroupMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddModifierToModifierGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddModifierToModifierGroupMutation>(AddModifierToModifierGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addModifierToModifierGroup', 'mutation', variables);
    },
    changeModifierGroupStatus(variables: ChangeModifierGroupStatusMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ChangeModifierGroupStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChangeModifierGroupStatusMutation>(ChangeModifierGroupStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'changeModifierGroupStatus', 'mutation', variables);
    },
    getModifiers(variables?: GetModifiersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetModifiersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetModifiersQuery>(GetModifiersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getModifiers', 'query', variables);
    },
    addModifier(variables: AddModifierMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddModifierMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddModifierMutation>(AddModifierDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addModifier', 'mutation', variables);
    },
    deleteModifier(variables: DeleteModifierMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteModifierMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteModifierMutation>(DeleteModifierDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteModifier', 'mutation', variables);
    },
    getModifier(variables: GetModifierQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetModifierQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetModifierQuery>(GetModifierDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getModifier', 'query', variables);
    },
    updateModifier(variables: UpdateModifierMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateModifierMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateModifierMutation>(UpdateModifierDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateModifier', 'mutation', variables);
    },
    AllPlaces(variables: AllPlacesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AllPlacesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllPlacesQuery>(AllPlacesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AllPlaces', 'query', variables);
    },
    PlaceDetails(variables: PlaceDetailsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PlaceDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlaceDetailsQuery>(PlaceDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PlaceDetails', 'query', variables);
    },
    updateUserProfile(variables: UpdateUserProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateUserProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserProfileMutation>(UpdateUserProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateUserProfile', 'mutation', variables);
    },
    businessOnboarding(variables: BusinessOnboardingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<BusinessOnboardingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<BusinessOnboardingMutation>(BusinessOnboardingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'businessOnboarding', 'mutation', variables);
    },
    completeBusinessOnboarding(variables?: CompleteBusinessOnboardingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CompleteBusinessOnboardingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CompleteBusinessOnboardingMutation>(CompleteBusinessOnboardingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'completeBusinessOnboarding', 'mutation', variables);
    },
    getBusinessOnboardingDetails(variables?: GetBusinessOnboardingDetailsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetBusinessOnboardingDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBusinessOnboardingDetailsQuery>(GetBusinessOnboardingDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBusinessOnboardingDetails', 'query', variables);
    },
    restaurantOnboarding(variables: RestaurantOnboardingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RestaurantOnboardingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RestaurantOnboardingMutation>(RestaurantOnboardingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'restaurantOnboarding', 'mutation', variables);
    },
    completeRestaurantOnboarding(variables?: CompleteRestaurantOnboardingQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CompleteRestaurantOnboardingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CompleteRestaurantOnboardingQuery>(CompleteRestaurantOnboardingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'completeRestaurantOnboarding', 'query', variables);
    },
    getRestaurantOnboardingData(variables?: GetRestaurantOnboardingDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetRestaurantOnboardingDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRestaurantOnboardingDataQuery>(GetRestaurantOnboardingDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getRestaurantOnboardingData', 'query', variables);
    },
    getUserRestaurants(variables?: GetUserRestaurantsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserRestaurantsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserRestaurantsQuery>(GetUserRestaurantsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserRestaurants', 'query', variables);
    },
    setRestaurantIdAsCookie(variables: SetRestaurantIdAsCookieQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SetRestaurantIdAsCookieQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetRestaurantIdAsCookieQuery>(SetRestaurantIdAsCookieDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setRestaurantIdAsCookie', 'query', variables);
    },
    getRestaurantDetails(variables?: GetRestaurantDetailsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetRestaurantDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRestaurantDetailsQuery>(GetRestaurantDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getRestaurantDetails', 'query', variables);
    },
    addTaxRate(variables: AddTaxRateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddTaxRateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddTaxRateMutation>(AddTaxRateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addTaxRate', 'mutation', variables);
    },
    addTaxRateInRestaurant(variables: AddTaxRateInRestaurantMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddTaxRateInRestaurantMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddTaxRateInRestaurantMutation>(AddTaxRateInRestaurantDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addTaxRateInRestaurant', 'mutation', variables);
    },
    addTeamMember(variables: AddTeamMemberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddTeamMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddTeamMemberMutation>(AddTeamMemberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addTeamMember', 'mutation', variables);
    },
    getTeamMembers(variables?: GetTeamMembersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetTeamMembersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTeamMembersQuery>(GetTeamMembersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTeamMembers', 'query', variables);
    },
    removeTeamMember(variables: RemoveTeamMemberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveTeamMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveTeamMemberMutation>(RemoveTeamMemberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeTeamMember', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;