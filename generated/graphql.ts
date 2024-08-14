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
  role: AdminRole;
};

export type AddCategoryInput = {
  availability?: InputMaybe<Array<AvailabilityInput>>;
  desc: Scalars['String']['input'];
  items?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  status: StatusEnum;
  visibility?: InputMaybe<Array<VisibilityInput>>;
};

export type AddConfigInput = {
  type: ConfigTypeEnum;
  value: Scalars['Float']['input'];
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
  availability?: InputMaybe<Array<AvailabilityInput>>;
  desc?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  options?: Array<OptionsInput>;
  orderLimit?: InputMaybe<Scalars['Float']['input']>;
  price: Scalars['Float']['input'];
  priceOptions: Array<PriceOptionsInput>;
  status: StatusEnum;
  subCategory?: InputMaybe<ItemSubCategoryInput>;
  visibility?: InputMaybe<Array<VisibilityInput>>;
};

export type AddItemOptionInput = {
  desc: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  type: ItemOptionsEnum;
};

export type AddMenuInput = {
  availability?: InputMaybe<Array<AvailabilityInput>>;
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  taxRateId?: InputMaybe<Scalars['String']['input']>;
  type: MenuTypeEnum;
};

export type AddModifierGroupInput = {
  desc: Scalars['String']['input'];
  maxSelections: Scalars['Float']['input'];
  minSelections: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  optional: Scalars['Boolean']['input'];
  price: Scalars['Float']['input'];
  pricingType: PriceTypeEnum;
};

export type AddModifierInput = {
  desc: Scalars['String']['input'];
  isItem: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  preSelect: Scalars['Boolean']['input'];
  price: Scalars['Float']['input'];
};

export type AddPermissionInput = {
  isFunction?: Scalars['Boolean']['input'];
  preselect: Array<UserRole>;
  type: PermissionTypeEnum;
};

export type AddStateInput = {
  abbreviation: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type AddSubCategoryInput = {
  desc: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type AddTeamMemberInput = {
  accountPreferences: AccountPreferenceInput;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  permissions: Array<UserPermissionInput>;
  phone: Scalars['String']['input'];
  restaurants: Array<Scalars['String']['input']>;
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
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  coordinate?: Maybe<LocationCommon>;
  place?: Maybe<Places>;
  state: StateData;
  zipcode: Scalars['Float']['output'];
};

export type AddressInfoInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  coordinate: LocationCommonInput;
  place: PlaceInput;
  state: StateDataInput;
  zipcode: Scalars['Float']['input'];
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
  role: AdminRole;
  status: AdminStatus;
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

/** Types of status for Admin */
export enum AdminStatus {
  Active = 'active',
  Blocked = 'blocked'
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
  ein?: Maybe<Scalars['String']['output']>;
  employeeSize?: Maybe<StaffCountEnum>;
  establishedAt?: Maybe<Scalars['String']['output']>;
  estimatedRevenue?: Maybe<EstimatedRevenueEnum>;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  user: UserInfo;
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
  desc: Scalars['String']['output'];
  items: Array<ItemInfo>;
  menu?: Maybe<Array<Menu>>;
  name: Scalars['String']['output'];
  restaurantId: Restaurant;
  status: StatusEnum;
  upSellCategories?: Maybe<Array<Category>>;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  user: User;
  visibility: Array<Visibility>;
};

export type CategoryInfo = {
  __typename?: 'CategoryInfo';
  _id: Category;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  status: StatusEnum;
};

export type Config = {
  __typename?: 'Config';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  type: ConfigTypeEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
  value: Scalars['Float']['output'];
};

/** Enum to store the types of master config that can be changed by admins anytime */
export enum ConfigTypeEnum {
  MaxCsvRows = 'MaxCSVRows',
  MonthlySubscription = 'MonthlySubscription',
  ProcessingFee = 'ProcessingFee',
  TrialDays = 'TrialDays'
}

/** ConnectionStatusEnum enum type  */
export enum ConnectionStatusEnum {
  Connected = 'Connected',
  Error = 'Error',
  Expired = 'Expired',
  NotConnected = 'NotConnected'
}

export type CsvUploadError = {
  __typename?: 'CsvUploadError';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  errorFile: Scalars['String']['output'];
  issues: Array<Scalars['String']['output']>;
  restaurantId: Restaurant;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
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
  uniqueId: Scalars['String']['output'];
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
  availability?: Maybe<Array<Availability>>;
  category?: Maybe<Category>;
  createdAt: Scalars['DateTimeISO']['output'];
  desc: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  modifierGroup: Array<ModifierGroupInfo>;
  name: Scalars['String']['output'];
  options: Array<Options>;
  orderLimit?: Maybe<Scalars['Float']['output']>;
  price: Scalars['Float']['output'];
  priceOptions: Array<PriceOptions>;
  restaurantId: Restaurant;
  status: StatusEnum;
  subCategory?: Maybe<ItemSubCategory>;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  user: User;
  visibility: Array<Visibility>;
};

export type ItemInfo = {
  __typename?: 'ItemInfo';
  _id: Item;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  status: StatusEnum;
};

export type ItemOption = {
  __typename?: 'ItemOption';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  desc: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  type: ItemOptionsEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
};

/** Enum to store the options for menu items */
export enum ItemOptionsEnum {
  HasNuts = 'HasNuts',
  IsGlutenFree = 'IsGlutenFree',
  IsHalal = 'IsHalal',
  IsSpicy = 'IsSpicy',
  IsVegan = 'IsVegan',
  PopularItem = 'PopularItem',
  UpSellItem = 'UpSellItem'
}

export type ItemSubCategory = {
  __typename?: 'ItemSubCategory';
  desc: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type ItemSubCategoryInput = {
  desc: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type LocationCommon = {
  __typename?: 'LocationCommon';
  coordinates: Array<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type LocationCommonInput = {
  coordinates: Array<Scalars['Float']['input']>;
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
  name: Scalars['String']['output'];
  restaurantId: Restaurant;
  status: StatusEnum;
  taxes?: Maybe<TaxRateInfo>;
  type: MenuTypeEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  user: User;
};

export type MenuInfo = {
  __typename?: 'MenuInfo';
  _id: Menu;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
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
  desc: Scalars['String']['output'];
  isItem: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  preSelect: Scalars['Boolean']['output'];
  price: Scalars['Float']['output'];
  restaurantId: Restaurant;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  user: User;
};

export type ModifierGroup = {
  __typename?: 'ModifierGroup';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  desc: Scalars['String']['output'];
  maxSelections: Scalars['Float']['output'];
  minSelections: Scalars['Float']['output'];
  modifiers: Array<ModifierInfo>;
  name: Scalars['String']['output'];
  optional: Scalars['Boolean']['output'];
  price: Scalars['Float']['output'];
  pricingType: PriceTypeEnum;
  restaurantId: Restaurant;
  status: StatusEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  user: User;
};

export type ModifierGroupInfo = {
  __typename?: 'ModifierGroupInfo';
  _id: ModifierGroup;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pricingType: PriceTypeEnum;
};

export type ModifierInfo = {
  __typename?: 'ModifierInfo';
  _id: Modifier;
  desc: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isItem: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  preSelect: Scalars['Boolean']['output'];
  price: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAdmin: Scalars['Boolean']['output'];
  addCategoriesToMenu: Scalars['Boolean']['output'];
  addCategory: Scalars['Boolean']['output'];
  addConfig: Scalars['Boolean']['output'];
  addCuisine: Scalars['Boolean']['output'];
  addItem: Scalars['Boolean']['output'];
  addItemOption: Scalars['Boolean']['output'];
  addItemsToCategory: Scalars['Boolean']['output'];
  addMenu: Scalars['Boolean']['output'];
  addModifier: Scalars['Boolean']['output'];
  addModifierGroup: Scalars['Boolean']['output'];
  addModifierGroupToItem: Scalars['Boolean']['output'];
  addModifierToModifierGroup: Scalars['Boolean']['output'];
  addPermission: Scalars['Boolean']['output'];
  addState: Scalars['Boolean']['output'];
  addSubCategory: Scalars['Boolean']['output'];
  addTaxRate: Scalars['String']['output'];
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
  deleteEmailTemplate: Scalars['Boolean']['output'];
  removeCategoryFromMenu: Scalars['Boolean']['output'];
  removeItemFromCategory: Scalars['Boolean']['output'];
  removeModifierFromModifierGroup: Scalars['Boolean']['output'];
  removeModifierGroupFromItem: Scalars['Boolean']['output'];
  removeTeamMember: Scalars['Boolean']['output'];
  restaurantOnboarding: Scalars['Boolean']['output'];
  sendTestEmails: Scalars['Boolean']['output'];
  updateCategory: Scalars['Boolean']['output'];
  updateConfig: Scalars['Boolean']['output'];
  updateCuisineStatus: Scalars['Boolean']['output'];
  updateItem: Scalars['Boolean']['output'];
  updateItemOption: Scalars['Boolean']['output'];
  updateMenu: Scalars['Boolean']['output'];
  updateModifier: Scalars['Boolean']['output'];
  updateModifierGroup: Scalars['Boolean']['output'];
  updatePermissionPreselect: Scalars['Boolean']['output'];
  updateStateStatus: Scalars['Boolean']['output'];
  updateSubCategory: Scalars['Boolean']['output'];
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


export type MutationAddConfigArgs = {
  input: AddConfigInput;
};


export type MutationAddCuisineArgs = {
  input: AddCuisineInput;
};


export type MutationAddItemArgs = {
  input: AddItemInput;
  modifierGroups: Array<Scalars['String']['input']>;
};


export type MutationAddItemOptionArgs = {
  input: AddItemOptionInput;
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


export type MutationAddPermissionArgs = {
  input: AddPermissionInput;
};


export type MutationAddStateArgs = {
  input: AddStateInput;
};


export type MutationAddSubCategoryArgs = {
  input: AddSubCategoryInput;
};


export type MutationAddTaxRateArgs = {
  input: TaxRateInput;
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
  updateStatus: AdminStatus;
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


export type MutationDeleteEmailTemplateArgs = {
  id: Scalars['String']['input'];
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


export type MutationRemoveModifierGroupFromItemArgs = {
  itemId: Scalars['String']['input'];
  modifierGroupId: Scalars['String']['input'];
};


export type MutationRemoveTeamMemberArgs = {
  id: Scalars['String']['input'];
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


export type MutationUpdateConfigArgs = {
  id: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};


export type MutationUpdateCuisineStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateItemArgs = {
  input: UpdateItemInput;
};


export type MutationUpdateItemOptionArgs = {
  input: UpdateItemOptionInput;
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


export type MutationUpdatePermissionPreselectArgs = {
  id: Scalars['String']['input'];
  preselect: Array<UserRole>;
};


export type MutationUpdateStateStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateSubCategoryArgs = {
  input: UpdateSubCategoryInput;
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

export type Options = {
  __typename?: 'Options';
  _id: Scalars['ID']['output'];
  desc: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  status: Scalars['Boolean']['output'];
  type: ItemOptionsEnum;
};

export type OptionsInput = {
  _id: Scalars['String']['input'];
  desc: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  status: Scalars['Boolean']['input'];
  type: ItemOptionsEnum;
};

export type PaginatedFilter = {
  field: Scalars['String']['input'];
  operator: FilterOperatorsEnum;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Permission = {
  __typename?: 'Permission';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  isFunction: Scalars['Boolean']['output'];
  preselect: Array<UserRole>;
  type: PermissionTypeEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy: Admin;
};

/** Enum to store the types of permissions that can be given to sub-users */
export enum PermissionTypeEnum {
  AddRestaurant = 'AddRestaurant',
  Cms = 'CMS',
  Customers = 'Customers',
  Dashboard = 'Dashboard',
  Integrations = 'Integrations',
  Marketing = 'Marketing',
  Menu = 'Menu',
  Offers = 'Offers',
  Orders = 'Orders',
  PaymentManagement = 'PaymentManagement',
  Reports = 'Reports',
  Rewards = 'Rewards',
  UpdateBusiness = 'UpdateBusiness',
  UpdateRestaurant = 'UpdateRestaurant',
  UpdateTax = 'UpdateTax',
  UserManagement = 'UserManagement'
}

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

export type PriceOptions = {
  __typename?: 'PriceOptions';
  menuType: MenuTypeEnum;
  price: Scalars['Float']['output'];
};

export type PriceOptionsInput = {
  menuType: MenuTypeEnum;
  price: Scalars['Float']['input'];
};

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
  deleteData: Scalars['Boolean']['output'];
  deleteMenuData: Scalars['Boolean']['output'];
  emailOtpVerification: Scalars['Boolean']['output'];
  generateOtpForEmailVerification: Scalars['String']['output'];
  generateOtpForLogin: Scalars['String']['output'];
  getActiveCuisines: Array<Cuisine>;
  getActiveStates: Array<State>;
  getActiveTimezones: Array<Timezone>;
  getAdmins: Array<Admin>;
  getAllConfigs: Array<Config>;
  getAllCuisines: Array<Cuisine>;
  getAllEmailCampaigns: Array<EmailCampaignsObject>;
  getAllEmailTemplates: Array<EmailTemplatesObject>;
  getAllItemOptions: Array<ItemOption>;
  getAllMenus: Array<Menu>;
  getAllPermissions: Array<Permission>;
  getAllRestaurantUsers: Array<User>;
  getAllRestaurants: Array<Restaurant>;
  getAllStates: Array<State>;
  getAllTimezones: Array<Timezone>;
  getBusinessDetails: Business;
  getBusinessOnboardingDetails?: Maybe<Business>;
  getCategories: Array<Category>;
  getCategory: Category;
  getConfig: Config;
  getCsvError: CsvUploadError;
  getCsvErrors: Array<CsvUploadError>;
  getCsvHeaders: Array<Scalars['String']['output']>;
  getItem: Item;
  getItems: Array<Item>;
  getMenu: Menu;
  getModifier: Modifier;
  getModifierGroup: ModifierGroup;
  getModifierGroups: Array<ModifierGroup>;
  getModifiers: Array<Modifier>;
  getPlaceDetails?: Maybe<PlaceDetail>;
  getPlacesList: Array<Places>;
  getRestaurantDetails: Restaurant;
  getRestaurantOnboardingData: Restaurant;
  getSubCategories: Array<SubCategory>;
  getSubCategory: SubCategory;
  getTaxRate: TaxRate;
  getTeamMembers: Array<SubUser>;
  getUserRestaurants: Array<RestaurantInfo>;
  getUserRestaurantsPending: Array<RestaurantInfo>;
  getUsersForTarget: Scalars['Float']['output'];
  getWaitListUsers: Array<WaitListUser>;
  logout: Scalars['Boolean']['output'];
  me: Admin;
  meUser: User;
  revokeAdminAccess: Scalars['Boolean']['output'];
  saveCsvError: Scalars['Boolean']['output'];
  setRestaurantIdAsCookie: Scalars['Boolean']['output'];
  uploadCsvData: Scalars['Boolean']['output'];
  verifyAdminLogin: Scalars['String']['output'];
  verifyOtpForLogin: Scalars['Boolean']['output'];
};


export type QueryAdminLoginArgs = {
  email: Scalars['String']['input'];
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


export type QueryGetConfigArgs = {
  type: ConfigTypeEnum;
};


export type QueryGetCsvErrorArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetItemArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetItemsArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetMenuArgs = {
  id: Scalars['String']['input'];
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


export type QueryGetSubCategoriesArgs = {
  filter?: InputMaybe<PaginatedFilter>;
  page?: Scalars['Float']['input'];
};


export type QueryGetSubCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUsersForTargetArgs = {
  target: EmailCampaignTargetTypes;
};


export type QueryRevokeAdminAccessArgs = {
  id: Scalars['String']['input'];
};


export type QuerySaveCsvErrorArgs = {
  input: UploadCsvErrorInput;
};


export type QuerySetRestaurantIdAsCookieArgs = {
  id: Scalars['String']['input'];
};


export type QueryUploadCsvDataArgs = {
  input: UploadCsvInput;
};


export type QueryVerifyAdminLoginArgs = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  otpKey: Scalars['String']['input'];
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
  dineInCapacity?: Maybe<Scalars['Float']['output']>;
  foodType?: Maybe<Array<FoodType>>;
  integrations?: Maybe<Array<Integration>>;
  meatType?: Maybe<MeatType>;
  menus?: Maybe<Array<MenuInfo>>;
  name: Scalars['String']['output'];
  socialInfo?: Maybe<SocialInfo>;
  status: RestaurantStatus;
  taxRates?: Maybe<Array<TaxRateInfo>>;
  timezone?: Maybe<TimezoneData>;
  type?: Maybe<RestaurantType>;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
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
  city?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: RestaurantStatus;
};

/** Restaurant status enum. */
export enum RestaurantStatus {
  Active = 'active',
  Blocked = 'blocked',
  BlockedBySystem = 'blockedBySystem',
  Inactive = 'inactive',
  OnboardingPending = 'onboardingPending'
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

export type StateData = {
  __typename?: 'StateData';
  stateId: Scalars['String']['output'];
  stateName: Scalars['String']['output'];
};

export type StateDataInput = {
  stateId?: InputMaybe<Scalars['String']['input']>;
  stateName: Scalars['String']['input'];
};

/** Status enum  */
export enum StatusEnum {
  Active = 'active',
  Inactive = 'inactive'
}

export type SubCategory = {
  __typename?: 'SubCategory';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  desc: Scalars['String']['output'];
  name: Scalars['String']['output'];
  restaurantId: Restaurant;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  user: User;
};

export type SubUser = {
  __typename?: 'SubUser';
  _id?: Maybe<User>;
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
  status: UserStatus;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type TaxRate = {
  __typename?: 'TaxRate';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  name: Scalars['String']['output'];
  restaurantId: Restaurant;
  salesTax: Scalars['Float']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  user: User;
};

export type TaxRateInfo = {
  __typename?: 'TaxRateInfo';
  _id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  salesTax: Scalars['Float']['output'];
};

export type TaxRateInput = {
  name: Scalars['String']['input'];
  salesTax: Scalars['Float']['input'];
};

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

export type TimezoneData = {
  __typename?: 'TimezoneData';
  timezoneId: Scalars['String']['output'];
  timezoneName: Scalars['String']['output'];
};

export type TimezoneDataInput = {
  timezoneId?: InputMaybe<Scalars['String']['input']>;
  timezoneName: Scalars['String']['input'];
};

export type UpdateCategoryInput = {
  _id: Scalars['String']['input'];
  availability?: InputMaybe<Array<AvailabilityInput>>;
  desc?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<StatusEnum>;
  visibility?: InputMaybe<Array<VisibilityInput>>;
};

export type UpdateItemInput = {
  _id: Scalars['String']['input'];
  availability?: InputMaybe<Array<AvailabilityInput>>;
  desc?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: Array<OptionsInput>;
  orderLimit?: InputMaybe<Scalars['Float']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  priceOptions?: InputMaybe<Array<PriceOptionsInput>>;
  status?: InputMaybe<StatusEnum>;
  subCategory?: InputMaybe<ItemSubCategoryInput>;
  visibility?: InputMaybe<Array<VisibilityInput>>;
};

export type UpdateItemOptionInput = {
  _id: Scalars['String']['input'];
  desc: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  type: ItemOptionsEnum;
};

export type UpdateMenuInput = {
  _id: Scalars['String']['input'];
  availability?: InputMaybe<Array<AvailabilityInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<MenuTypeEnum>;
};

export type UpdateModifierGroupInput = {
  _id: Scalars['String']['input'];
  desc?: InputMaybe<Scalars['String']['input']>;
  maxSelections: Scalars['Float']['input'];
  minSelections: Scalars['Float']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  optional?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  pricingType: PriceTypeEnum;
};

export type UpdateModifierInput = {
  _id: Scalars['String']['input'];
  desc?: InputMaybe<Scalars['String']['input']>;
  isItem?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  preSelect?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateRestaurantDetailsInput = {
  address?: InputMaybe<AddressInfoInput>;
  availability?: InputMaybe<Array<AvailabilityInput>>;
  beverageCategory?: InputMaybe<Array<BeverageCategory>>;
  brandingLogo?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Array<RestaurantCategory>>;
  dineInCapacity?: InputMaybe<Scalars['Float']['input']>;
  foodType?: InputMaybe<Array<FoodType>>;
  meatType?: InputMaybe<MeatType>;
  name?: InputMaybe<Scalars['String']['input']>;
  socialInfo?: InputMaybe<SocialInfoInput>;
  timezone?: InputMaybe<TimezoneDataInput>;
  type?: InputMaybe<RestaurantType>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSubCategoryInput = {
  desc?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaxRateInput = {
  _id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  salesTax?: InputMaybe<Scalars['Float']['input']>;
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

export type UploadCsvErrorInput = {
  errorFile: Scalars['String']['input'];
  issues: Array<Scalars['String']['input']>;
};

export type UploadCsvInput = {
  csvFile: Scalars['String']['input'];
  menu: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  accessHistory?: Maybe<Array<AccessHistory>>;
  accountPreferences?: Maybe<AccountPreference>;
  businessInfo?: Maybe<Business>;
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastLoggedIn: Scalars['DateTimeISO']['output'];
  lastLoggedOut: Scalars['DateTimeISO']['output'];
  lastName: Scalars['String']['output'];
  ownerUserId?: Maybe<Scalars['String']['output']>;
  permissions: Array<UserPermission>;
  phone: Scalars['String']['output'];
  restaurants?: Maybe<Array<RestaurantInfo>>;
  role: UserRole;
  status: UserStatus;
  statusUpdatedBy?: Maybe<Admin>;
  updatedAt: Scalars['DateTimeISO']['output'];
  updatedBy?: Maybe<User>;
  verificationRejections?: Maybe<Array<RejectRecord>>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  _id: User;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  status: UserStatus;
};

export type UserPermission = {
  __typename?: 'UserPermission';
  status: Scalars['Boolean']['output'];
  type: PermissionTypeEnum;
};

export type UserPermissionInput = {
  _id: Scalars['String']['input'];
  status: Scalars['Boolean']['input'];
  type: PermissionTypeEnum;
};

/** User roles  */
export enum UserRole {
  Accountant = 'Accountant',
  Manager = 'Manager',
  MarketingPartner = 'MarketingPartner',
  Owner = 'Owner',
  Staff = 'Staff'
}

/** UserStatus type enum  */
export enum UserStatus {
  Active = 'active',
  Blocked = 'blocked',
  InternalVerificationPending = 'internalVerificationPending',
  OnboardingPending = 'onboardingPending',
  PaymentPending = 'paymentPending',
  RestaurantOnboardingPending = 'restaurantOnboardingPending',
  SubUserEmailVerificationPending = 'subUserEmailVerificationPending'
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

export type Visibility = {
  __typename?: 'Visibility';
  menuType: MenuTypeEnum;
  status: StatusEnum;
};

export type VisibilityInput = {
  menuType: MenuTypeEnum;
  status: StatusEnum;
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


export type MeUserQuery = { __typename?: 'Query', meUser: { __typename?: 'User', _id: string, firstName: string, lastName: string, status: UserStatus, email: string, phone: string, ownerUserId?: string | null, role: UserRole, businessInfo?: { __typename?: 'Business', businessName?: string | null, ein?: string | null, businessType?: BusinessTypeEnum | null, estimatedRevenue?: EstimatedRevenueEnum | null, employeeSize?: StaffCountEnum | null, establishedAt?: string | null, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null, place?: { __typename?: 'Places', displayName: string, placeId: string } | null } | null } | null, restaurants?: Array<{ __typename?: 'RestaurantInfo', id: string, name: string, status: RestaurantStatus }> | null } };

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


export type GetBusinessDetailsQuery = { __typename?: 'Query', getBusinessDetails: { __typename?: 'Business', businessName?: string | null, estimatedRevenue?: EstimatedRevenueEnum | null, employeeSize?: StaffCountEnum | null, businessType?: BusinessTypeEnum | null, ein?: string | null, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null, place?: { __typename?: 'Places', displayName: string, placeId: string } | null } | null } };

export type UpdateTaxRateMutationVariables = Exact<{
  input: UpdateTaxRateInput;
}>;


export type UpdateTaxRateMutation = { __typename?: 'Mutation', updateTaxRate: boolean };

export type ChangeCategoryStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ChangeCategoryStatusMutation = { __typename?: 'Mutation', changeCategoryStatus: boolean };

export type AddItemToCategoryMutationVariables = Exact<{
  categoryId: Scalars['String']['input'];
  itemId: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddItemToCategoryMutation = { __typename?: 'Mutation', addItemsToCategory: boolean };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', getCategories: Array<{ __typename?: 'Category', _id: string, name: string, desc: string, status: StatusEnum, items: Array<{ __typename?: 'ItemInfo', name?: string | null, _id: { __typename?: 'Item', _id: string } }> }> };

export type GetItemsForCategoryDropdownQueryVariables = Exact<{
  field: Scalars['String']['input'];
  operator: FilterOperatorsEnum;
  value?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetItemsForCategoryDropdownQuery = { __typename?: 'Query', getItems: Array<{ __typename?: 'Item', _id: string, name: string, price: number, image?: string | null }> };

export type AddCategoryMutationVariables = Exact<{
  input: AddCategoryInput;
}>;


export type AddCategoryMutation = { __typename?: 'Mutation', addCategory: boolean };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', getCategory: { __typename?: 'Category', _id: string, name: string, desc: string, status: StatusEnum, createdAt: any, updatedAt: any, items: Array<{ __typename?: 'ItemInfo', id: string, name?: string | null, image?: string | null, price: number, status: StatusEnum, _id: { __typename?: 'Item', _id: string } }>, visibility: Array<{ __typename?: 'Visibility', menuType: MenuTypeEnum, status: StatusEnum }>, availability?: Array<{ __typename?: 'Availability', day: string, active: boolean, hours: Array<{ __typename?: 'Hours', start: any, end: any }> }> | null } };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: boolean };

export type RemoveItemFromCategoryMutationVariables = Exact<{
  itemId: Scalars['String']['input'];
  categoryId: Scalars['String']['input'];
}>;


export type RemoveItemFromCategoryMutation = { __typename?: 'Mutation', removeItemFromCategory: boolean };

export type GetCsvHeadersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCsvHeadersQuery = { __typename?: 'Query', getCsvHeaders: Array<string> };

export type UploadCsvMenuDataQueryVariables = Exact<{
  input: UploadCsvInput;
}>;


export type UploadCsvMenuDataQuery = { __typename?: 'Query', uploadCsvData: boolean };

export type SaveCsvErrorQueryVariables = Exact<{
  input: UploadCsvErrorInput;
}>;


export type SaveCsvErrorQuery = { __typename?: 'Query', saveCsvError: boolean };

export type AddressInfoFragment = { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null, place?: { __typename?: 'Places', displayName: string, placeId: string } | null };

export type ChangeItemStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ChangeItemStatusMutation = { __typename?: 'Mutation', changeItemStatus: boolean };

export type GetItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetItemsQuery = { __typename?: 'Query', getItems: Array<{ __typename?: 'Item', _id: string, name: string, desc: string, status: StatusEnum, price: number, modifierGroup: Array<{ __typename?: 'ModifierGroupInfo', id: string, name: string }>, visibility: Array<{ __typename?: 'Visibility', menuType: MenuTypeEnum, status: StatusEnum }>, priceOptions: Array<{ __typename?: 'PriceOptions', price: number, menuType: MenuTypeEnum }> }> };

export type GetItemQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetItemQuery = { __typename?: 'Query', getItem: { __typename?: 'Item', _id: string, name: string, desc: string, status: StatusEnum, image?: string | null, price: number, orderLimit?: number | null, createdAt: any, updatedAt: any, modifierGroup: Array<{ __typename?: 'ModifierGroupInfo', name: string, pricingType: PriceTypeEnum, id: string }>, options: Array<{ __typename?: 'Options', _id: string, type: ItemOptionsEnum, displayName: string, desc: string, status: boolean }>, availability?: Array<{ __typename?: 'Availability', day: string, active: boolean, hours: Array<{ __typename?: 'Hours', start: any, end: any }> }> | null, visibility: Array<{ __typename?: 'Visibility', menuType: MenuTypeEnum, status: StatusEnum }>, priceOptions: Array<{ __typename?: 'PriceOptions', menuType: MenuTypeEnum, price: number }>, subCategory?: { __typename?: 'ItemSubCategory', id?: string | null, name: string, desc: string } | null } };

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


export type GetModifierGroupsforItemsDropDownQuery = { __typename?: 'Query', getModifierGroups: Array<{ __typename?: 'ModifierGroup', _id: string, name: string, modifiers: Array<{ __typename?: 'ModifierInfo', name: string }> }> };

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

export type GetAllItemOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllItemOptionsQuery = { __typename?: 'Query', getAllItemOptions: Array<{ __typename?: 'ItemOption', type: ItemOptionsEnum, displayName: string, desc: string, _id: string }> };

export type GetActiveStatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveStatesQuery = { __typename?: 'Query', getActiveStates: Array<{ __typename?: 'State', value: string, abbreviation?: string | null, _id: string }> };

export type GetActiveTimezonesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveTimezonesQuery = { __typename?: 'Query', getActiveTimezones: Array<{ __typename?: 'Timezone', value: string, gmtOffset: number, _id: string }> };

export type AddMenuMutationVariables = Exact<{
  input: AddMenuInput;
}>;


export type AddMenuMutation = { __typename?: 'Mutation', addMenu: boolean };

export type GetCategoriesForMenuDropdownQueryVariables = Exact<{
  field: Scalars['String']['input'];
  operator: FilterOperatorsEnum;
  value?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCategoriesForMenuDropdownQuery = { __typename?: 'Query', getCategories: Array<{ __typename?: 'Category', _id: string, name: string, desc: string, status: StatusEnum, items: Array<{ __typename?: 'ItemInfo', name?: string | null }> }> };

export type ChangeMenuStatusMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ChangeMenuStatusMutation = { __typename?: 'Mutation', changeMenuStatus: boolean };

export type AddCategoryToMenuMutationVariables = Exact<{
  categoryId: Array<Scalars['String']['input']> | Scalars['String']['input'];
  menuId: Scalars['String']['input'];
}>;


export type AddCategoryToMenuMutation = { __typename?: 'Mutation', addCategoriesToMenu: boolean };

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


export type GetAllMenusQuery = { __typename?: 'Query', getAllMenus: Array<{ __typename?: 'Menu', _id: string, type: MenuTypeEnum, name: string, createdAt: any, updatedAt: any, status: StatusEnum, categories: Array<{ __typename?: 'CategoryInfo', name?: string | null }> }> };

export type GetMenuQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetMenuQuery = { __typename?: 'Query', getMenu: { __typename?: 'Menu', _id: string, name: string, status: StatusEnum, createdAt: any, updatedAt: any, type: MenuTypeEnum, availability?: Array<{ __typename?: 'Availability', day: string, active: boolean, hours: Array<{ __typename?: 'Hours', start: any, end: any }> }> | null, taxes?: { __typename?: 'TaxRateInfo', _id: string, salesTax: number, name: string } | null, categories: Array<{ __typename?: 'CategoryInfo', name?: string | null, status: StatusEnum, _id: { __typename?: 'Category', _id: string } }> } };

export type GetModifierGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModifierGroupsQuery = { __typename?: 'Query', getModifierGroups: Array<{ __typename?: 'ModifierGroup', _id: string, status: StatusEnum, name: string }> };

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


export type GetModifiersforGroupDropDownQuery = { __typename?: 'Query', getModifiers: Array<{ __typename?: 'Modifier', _id: string, name: string, price: number }> };

export type GetModifierGroupQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetModifierGroupQuery = { __typename?: 'Query', getModifierGroup: { __typename?: 'ModifierGroup', _id: string, name: string, price: number, desc: string, pricingType: PriceTypeEnum, optional: boolean, maxSelections: number, minSelections: number, modifiers: Array<{ __typename?: 'ModifierInfo', name: string, price: number, id: string }> } };

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


export type GetModifiersQuery = { __typename?: 'Query', getModifiers: Array<{ __typename?: 'Modifier', _id: string, name: string, price: number }> };

export type AddModifierMutationVariables = Exact<{
  input: AddModifierInput;
}>;


export type AddModifierMutation = { __typename?: 'Mutation', addModifier: boolean };

export type GetModifierQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetModifierQuery = { __typename?: 'Query', getModifier: { __typename?: 'Modifier', _id: string, desc: string, isItem: boolean, preSelect: boolean, name: string, price: number } };

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


export type GetBusinessOnboardingDetailsQuery = { __typename?: 'Query', getBusinessOnboardingDetails?: { __typename?: 'Business', ein?: string | null, businessName?: string | null, employeeSize?: StaffCountEnum | null, establishedAt?: string | null, businessType?: BusinessTypeEnum | null, estimatedRevenue?: EstimatedRevenueEnum | null, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null, place?: { __typename?: 'Places', displayName: string, placeId: string } | null } | null } | null };

export type RestaurantOnboardingMutationVariables = Exact<{
  input: UpdateRestaurantDetailsInput;
}>;


export type RestaurantOnboardingMutation = { __typename?: 'Mutation', restaurantOnboarding: boolean };

export type CompleteRestaurantOnboardingQueryVariables = Exact<{ [key: string]: never; }>;


export type CompleteRestaurantOnboardingQuery = { __typename?: 'Query', completeRestaurantOnboarding: boolean };

export type GetRestaurantOnboardingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRestaurantOnboardingDataQuery = { __typename?: 'Query', getRestaurantOnboardingData: { __typename?: 'Restaurant', name: string, brandingLogo?: string | null, website?: string | null, category?: Array<RestaurantCategory> | null, beverageCategory?: Array<BeverageCategory> | null, foodType?: Array<FoodType> | null, meatType?: MeatType | null, type?: RestaurantType | null, dineInCapacity?: number | null, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null, place?: { __typename?: 'Places', displayName: string, placeId: string } | null } | null, socialInfo?: { __typename?: 'SocialInfo', facebook?: string | null, instagram?: string | null, twitter?: string | null } | null, availability?: Array<{ __typename?: 'Availability', day: string, active: boolean, hours: Array<{ __typename?: 'Hours', start: any, end: any }> }> | null, timezone?: { __typename?: 'TimezoneData', timezoneId: string, timezoneName: string } | null } };

export type MeUserInResOnboardingQueryVariables = Exact<{ [key: string]: never; }>;


export type MeUserInResOnboardingQuery = { __typename?: 'Query', meUser: { __typename?: 'User', status: UserStatus } };

export type GetUserRestaurantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserRestaurantsQuery = { __typename?: 'Query', getUserRestaurants: Array<{ __typename?: 'RestaurantInfo', name: string, id: string, status: RestaurantStatus }> };

export type SetRestaurantIdAsCookieQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SetRestaurantIdAsCookieQuery = { __typename?: 'Query', setRestaurantIdAsCookie: boolean };

export type GetRestaurantDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRestaurantDetailsQuery = { __typename?: 'Query', getRestaurantDetails: { __typename?: 'Restaurant', _id: string, name: string, brandingLogo?: string | null, website?: string | null, availability?: Array<{ __typename?: 'Availability', day: string, active: boolean, hours: Array<{ __typename?: 'Hours', start: any, end: any }> }> | null, address?: { __typename?: 'AddressInfo', addressLine1: string, addressLine2?: string | null, city: string, zipcode: number, state: { __typename?: 'StateData', stateId: string, stateName: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null, place?: { __typename?: 'Places', displayName: string, placeId: string } | null } | null, taxRates?: Array<{ __typename?: 'TaxRateInfo', _id: string, name: string, salesTax: number }> | null } };

export type AddTaxRateMutationVariables = Exact<{
  input: TaxRateInput;
}>;


export type AddTaxRateMutation = { __typename?: 'Mutation', addTaxRate: string };

export type GetUserRestaurantsPendingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserRestaurantsPendingQuery = { __typename?: 'Query', getUserRestaurantsPending: Array<{ __typename?: 'RestaurantInfo', name: string, id: string }> };

export type GetSubCategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetSubCategoryQuery = { __typename?: 'Query', getSubCategory: { __typename?: 'SubCategory', _id: string, name: string, desc: string } };

export type GetSubCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSubCategoriesQuery = { __typename?: 'Query', getSubCategories: Array<{ __typename?: 'SubCategory', _id: string, name: string, desc: string }> };

export type AddSubCategoryMutationVariables = Exact<{
  input: AddSubCategoryInput;
}>;


export type AddSubCategoryMutation = { __typename?: 'Mutation', addSubCategory: boolean };

export type UpdateSubCategoryMutationVariables = Exact<{
  input: UpdateSubCategoryInput;
}>;


export type UpdateSubCategoryMutation = { __typename?: 'Mutation', updateSubCategory: boolean };

export type AddTeamMemberMutationVariables = Exact<{
  AddTeamMemberInput: AddTeamMemberInput;
}>;


export type AddTeamMemberMutation = { __typename?: 'Mutation', addTeamMember: boolean };

export type GetTeamMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamMembersQuery = { __typename?: 'Query', getTeamMembers: Array<{ __typename?: 'SubUser', firstName: string, lastName: string, email: string, phone: string, role: string, status: UserStatus, _id?: { __typename?: 'User', _id: string } | null }> };

export type RemoveTeamMemberMutationVariables = Exact<{
  teamId: Scalars['String']['input'];
}>;


export type RemoveTeamMemberMutation = { __typename?: 'Mutation', removeTeamMember: boolean };

export type VerifyTeamEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyTeamEmailMutation = { __typename?: 'Mutation', verifyTeamEmail: boolean };

export type GetAllPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPermissionsQuery = { __typename?: 'Query', getAllPermissions: Array<{ __typename?: 'Permission', _id: string, type: PermissionTypeEnum, preselect: Array<UserRole>, isFunction: boolean }> };

export const AddressInfoFragmentDoc = gql`
    fragment addressInfo on AddressInfo {
  addressLine1
  addressLine2
  state {
    stateId
    stateName
  }
  city
  zipcode
  coordinate {
    coordinates
  }
  place {
    displayName
    placeId
  }
}
    `;
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
    ownerUserId
    role
    businessInfo {
      businessName
      ein
      businessType
      estimatedRevenue
      employeeSize
      establishedAt
      address {
        ...addressInfo
      }
    }
    restaurants {
      id
      name
      status
    }
  }
}
    ${AddressInfoFragmentDoc}`;
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
    businessType
    ein
    businessType
    address {
      ...addressInfo
    }
  }
}
    ${AddressInfoFragmentDoc}`;
export const UpdateTaxRateDocument = gql`
    mutation updateTaxRate($input: UpdateTaxRateInput!) {
  updateTaxRate(input: $input)
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
export const GetCategoriesDocument = gql`
    query getCategories {
  getCategories {
    _id
    name
    desc
    status
    items {
      _id {
        _id
      }
      name
    }
  }
}
    `;
export const GetItemsForCategoryDropdownDocument = gql`
    query getItemsForCategoryDropdown($field: String!, $operator: FilterOperatorsEnum!, $value: String) {
  getItems(filter: {field: $field, operator: $operator, value: $value}) {
    _id
    name
    price
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
    name
    desc
    status
    items {
      id
      name
      _id {
        _id
      }
      image
      price
      status
    }
    status
    visibility {
      menuType
      status
    }
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
export const GetCsvHeadersDocument = gql`
    query getCSVHeaders {
  getCsvHeaders
}
    `;
export const UploadCsvMenuDataDocument = gql`
    query uploadCSVMenuData($input: UploadCsvInput!) {
  uploadCsvData(input: $input)
}
    `;
export const SaveCsvErrorDocument = gql`
    query saveCsvError($input: UploadCsvErrorInput!) {
  saveCsvError(input: $input)
}
    `;
export const ChangeItemStatusDocument = gql`
    mutation changeItemStatus($id: String!) {
  changeItemStatus(id: $id)
}
    `;
export const GetItemsDocument = gql`
    query getItems {
  getItems {
    _id
    name
    desc
    status
    modifierGroup {
      id
      name
    }
    price
    visibility {
      menuType
      status
    }
    priceOptions {
      price
      menuType
    }
  }
}
    `;
export const GetItemDocument = gql`
    query getItem($id: String!) {
  getItem(id: $id) {
    _id
    name
    desc
    status
    modifierGroup {
      name
      pricingType
      id
    }
    image
    price
    orderLimit
    options {
      _id
      type
      displayName
      desc
      status
    }
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
    visibility {
      menuType
      status
    }
    priceOptions {
      menuType
      price
    }
    subCategory {
      id
      name
      desc
    }
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
    name
    modifiers {
      name
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
export const GetAllItemOptionsDocument = gql`
    query getAllItemOptions {
  getAllItemOptions {
    type
    displayName
    desc
    _id
  }
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
export const AddMenuDocument = gql`
    mutation addMenu($input: AddMenuInput!) {
  addMenu(input: $input)
}
    `;
export const GetCategoriesForMenuDropdownDocument = gql`
    query getCategoriesForMenuDropdown($field: String!, $operator: FilterOperatorsEnum!, $value: String) {
  getCategories(filter: {field: $field, operator: $operator, value: $value}) {
    _id
    name
    desc
    status
    items {
      name
    }
  }
}
    `;
export const ChangeMenuStatusDocument = gql`
    mutation changeMenuStatus($id: String!) {
  changeMenuStatus(id: $id)
}
    `;
export const AddCategoryToMenuDocument = gql`
    mutation addCategoryToMenu($categoryId: [String!]!, $menuId: String!) {
  addCategoriesToMenu(categoryIds: $categoryId, menuId: $menuId)
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
    name
    categories {
      name
    }
    createdAt
    updatedAt
    status
  }
}
    `;
export const GetMenuDocument = gql`
    query getMenu($id: String!) {
  getMenu(id: $id) {
    _id
    name
    status
    createdAt
    updatedAt
    type
    availability {
      day
      hours {
        start
        end
      }
      active
    }
    taxes {
      _id
      salesTax
      name
    }
    categories {
      name
      status
      _id {
        _id
      }
    }
  }
}
    `;
export const GetModifierGroupsDocument = gql`
    query getModifierGroups {
  getModifierGroups {
    _id
    status
    name
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
    name
    price
  }
}
    `;
export const GetModifierGroupDocument = gql`
    query getModifierGroup($id: String!) {
  getModifierGroup(id: $id) {
    _id
    name
    price
    desc
    pricingType
    optional
    modifiers {
      name
      price
      id
    }
    maxSelections
    minSelections
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
    name
    price
  }
}
    `;
export const AddModifierDocument = gql`
    mutation addModifier($input: AddModifierInput!) {
  addModifier(input: $input)
}
    `;
export const GetModifierDocument = gql`
    query getModifier($id: String!) {
  getModifier(id: $id) {
    _id
    desc
    isItem
    preSelect
    name
    price
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
      ...addressInfo
    }
    employeeSize
    establishedAt
    businessType
    estimatedRevenue
  }
}
    ${AddressInfoFragmentDoc}`;
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
    name
    address {
      ...addressInfo
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
      timezoneId
      timezoneName
    }
    category
    beverageCategory
    foodType
    meatType
    type
    dineInCapacity
  }
}
    ${AddressInfoFragmentDoc}`;
export const MeUserInResOnboardingDocument = gql`
    query meUserInResOnboarding {
  meUser {
    status
  }
}
    `;
export const GetUserRestaurantsDocument = gql`
    query getUserRestaurants {
  getUserRestaurants {
    name
    id
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
    name
    availability {
      day
      hours {
        start
        end
      }
      active
    }
    brandingLogo
    website
    address {
      ...addressInfo
    }
    taxRates {
      _id
      name
      salesTax
    }
  }
}
    ${AddressInfoFragmentDoc}`;
export const AddTaxRateDocument = gql`
    mutation addTaxRate($input: TaxRateInput!) {
  addTaxRate(input: $input)
}
    `;
export const GetUserRestaurantsPendingDocument = gql`
    query getUserRestaurantsPending {
  getUserRestaurantsPending {
    name
    id
  }
}
    `;
export const GetSubCategoryDocument = gql`
    query getSubCategory($id: String!) {
  getSubCategory(id: $id) {
    _id
    name
    desc
  }
}
    `;
export const GetSubCategoriesDocument = gql`
    query getSubCategories {
  getSubCategories {
    _id
    name
    desc
  }
}
    `;
export const AddSubCategoryDocument = gql`
    mutation AddSubCategory($input: AddSubCategoryInput!) {
  addSubCategory(input: $input)
}
    `;
export const UpdateSubCategoryDocument = gql`
    mutation UpdateSubCategory($input: UpdateSubCategoryInput!) {
  updateSubCategory(input: $input)
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
    _id {
      _id
    }
    firstName
    lastName
    email
    phone
    role
    status
  }
}
    `;
export const RemoveTeamMemberDocument = gql`
    mutation removeTeamMember($teamId: String!) {
  removeTeamMember(id: $teamId)
}
    `;
export const VerifyTeamEmailDocument = gql`
    mutation verifyTeamEmail($token: String!) {
  verifyTeamEmail(token: $token)
}
    `;
export const GetAllPermissionsDocument = gql`
    query getAllPermissions {
  getAllPermissions {
    _id
    type
    preselect
    isFunction
  }
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
    updateTaxRate(variables: UpdateTaxRateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateTaxRateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTaxRateMutation>(UpdateTaxRateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateTaxRate', 'mutation', variables);
    },
    changeCategoryStatus(variables: ChangeCategoryStatusMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ChangeCategoryStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChangeCategoryStatusMutation>(ChangeCategoryStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'changeCategoryStatus', 'mutation', variables);
    },
    addItemToCategory(variables: AddItemToCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddItemToCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddItemToCategoryMutation>(AddItemToCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addItemToCategory', 'mutation', variables);
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
    getCSVHeaders(variables?: GetCsvHeadersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetCsvHeadersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCsvHeadersQuery>(GetCsvHeadersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getCSVHeaders', 'query', variables);
    },
    uploadCSVMenuData(variables: UploadCsvMenuDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UploadCsvMenuDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadCsvMenuDataQuery>(UploadCsvMenuDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'uploadCSVMenuData', 'query', variables);
    },
    saveCsvError(variables: SaveCsvErrorQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SaveCsvErrorQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SaveCsvErrorQuery>(SaveCsvErrorDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'saveCsvError', 'query', variables);
    },
    changeItemStatus(variables: ChangeItemStatusMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ChangeItemStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChangeItemStatusMutation>(ChangeItemStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'changeItemStatus', 'mutation', variables);
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
    getAllItemOptions(variables?: GetAllItemOptionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAllItemOptionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllItemOptionsQuery>(GetAllItemOptionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllItemOptions', 'query', variables);
    },
    getActiveStates(variables?: GetActiveStatesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetActiveStatesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetActiveStatesQuery>(GetActiveStatesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getActiveStates', 'query', variables);
    },
    getActiveTimezones(variables?: GetActiveTimezonesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetActiveTimezonesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetActiveTimezonesQuery>(GetActiveTimezonesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getActiveTimezones', 'query', variables);
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
    addCategoryToMenu(variables: AddCategoryToMenuMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddCategoryToMenuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddCategoryToMenuMutation>(AddCategoryToMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addCategoryToMenu', 'mutation', variables);
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
    getMenu(variables: GetMenuQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetMenuQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMenuQuery>(GetMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getMenu', 'query', variables);
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
    meUserInResOnboarding(variables?: MeUserInResOnboardingQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MeUserInResOnboardingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeUserInResOnboardingQuery>(MeUserInResOnboardingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'meUserInResOnboarding', 'query', variables);
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
    getUserRestaurantsPending(variables?: GetUserRestaurantsPendingQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserRestaurantsPendingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserRestaurantsPendingQuery>(GetUserRestaurantsPendingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserRestaurantsPending', 'query', variables);
    },
    getSubCategory(variables: GetSubCategoryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetSubCategoryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSubCategoryQuery>(GetSubCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSubCategory', 'query', variables);
    },
    getSubCategories(variables?: GetSubCategoriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetSubCategoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSubCategoriesQuery>(GetSubCategoriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSubCategories', 'query', variables);
    },
    AddSubCategory(variables: AddSubCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddSubCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddSubCategoryMutation>(AddSubCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddSubCategory', 'mutation', variables);
    },
    UpdateSubCategory(variables: UpdateSubCategoryMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateSubCategoryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateSubCategoryMutation>(UpdateSubCategoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateSubCategory', 'mutation', variables);
    },
    addTeamMember(variables: AddTeamMemberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddTeamMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddTeamMemberMutation>(AddTeamMemberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addTeamMember', 'mutation', variables);
    },
    getTeamMembers(variables?: GetTeamMembersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetTeamMembersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTeamMembersQuery>(GetTeamMembersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTeamMembers', 'query', variables);
    },
    removeTeamMember(variables: RemoveTeamMemberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveTeamMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveTeamMemberMutation>(RemoveTeamMemberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeTeamMember', 'mutation', variables);
    },
    verifyTeamEmail(variables: VerifyTeamEmailMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<VerifyTeamEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<VerifyTeamEmailMutation>(VerifyTeamEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'verifyTeamEmail', 'mutation', variables);
    },
    getAllPermissions(variables?: GetAllPermissionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAllPermissionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllPermissionsQuery>(GetAllPermissionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllPermissions', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;