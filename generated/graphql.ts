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

export type AddMenuInput = {
  name: MasterCommonInput;
  status: StatusEnum;
  taxes?: InputMaybe<TaxRateInput>;
  type: MenuStatusEnum;
};

export type AddRestaurantInput = {
  address: AddressInfoInput;
  availability: Array<AvailabilityInput>;
  brandingLogo?: InputMaybe<Scalars['String']['input']>;
  locationName: MasterCommonInput;
  name: MasterCommonInput;
  socialInfo?: InputMaybe<SocialInfoInput>;
  status: RestaurantStatus;
  timezone: Scalars['String']['input'];
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
  postcode: MasterCommon;
  state: MasterCommon;
};

export type AddressInfoInput = {
  addressLine1: MasterCommonInput;
  addressLine2?: InputMaybe<MasterCommonInput>;
  city: MasterCommonInput;
  coordinate?: InputMaybe<LocationCommonInput>;
  postcode: MasterCommonInput;
  state: MasterCommonInput;
};

export type Admin = {
  __typename?: 'Admin';
  _id: Scalars['ID']['output'];
  accessHistory: Array<AccessHistory>;
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
  end: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
};

export type AvailabilityInput = {
  active: Scalars['Boolean']['input'];
  day: Day;
  end: Scalars['DateTimeISO']['input'];
  start: Scalars['DateTimeISO']['input'];
};

/** Business type enum  */
export enum BusinessTypeEnum {
  Llc = 'LLC',
  PrivateLimited = 'PrivateLimited'
}

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ID']['output'];
  availability?: Maybe<Array<Availability>>;
  createdAt: Scalars['DateTimeISO']['output'];
  desc: MasterCommon;
  items?: Maybe<Array<Item>>;
  name: MasterCommon;
  restaurantId: Restaurant;
  status: StatusEnum;
  upSellCategories?: Maybe<Array<Category>>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
  visibility?: Maybe<Array<Visibility>>;
};

export type CategoryInfo = {
  __typename?: 'CategoryInfo';
  _id: Category;
  name?: Maybe<MasterCommon>;
};

/** ConnectionStatusEnum enum type  */
export enum ConnectionStatusEnum {
  Connected = 'Connected',
  Error = 'Error',
  Expired = 'Expired',
  NotConnected = 'NotConnected'
}

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
  Csv = 'csv'
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
  createdAt: Scalars['DateTimeISO']['output'];
  desc: MasterCommon;
  image: MasterCommon;
  modifierGroup?: Maybe<Array<ModifierGroup>>;
  name: MasterCommon;
  popularItem: Scalars['Boolean']['output'];
  price: MasterCommonNumber;
  upSellItem: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  visibility?: Maybe<Array<Visibility>>;
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

export type Menu = {
  __typename?: 'Menu';
  _id: Scalars['ID']['output'];
  availability?: Maybe<Array<Availability>>;
  categories: Array<CategoryInfo>;
  createdAt: Scalars['DateTimeISO']['output'];
  name: MasterCommon;
  status: StatusEnum;
  taxes: TaxRateInfo;
  type: MenuStatusEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
  visibility?: Maybe<Array<Visibility>>;
};

export type MenuInfo = {
  __typename?: 'MenuInfo';
  _id: Menu;
  name?: Maybe<MasterCommon>;
};

/** Menu status enum */
export enum MenuStatusEnum {
  Catering = 'Catering',
  DineIn = 'DineIn',
  OnlineOrdering = 'OnlineOrdering'
}

export type Modifier = {
  __typename?: 'Modifier';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  name: MasterCommon;
  price: MasterCommonNumber;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type ModifierGroup = {
  __typename?: 'ModifierGroup';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  maxSelections: MasterCommonNumber;
  modifiers?: Maybe<Array<Modifier>>;
  name: MasterCommon;
  optional: Scalars['Boolean']['output'];
  pricingType: PriceTypeEnum;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAdmin: Scalars['Boolean']['output'];
  addCategory: Scalars['Boolean']['output'];
  addMenu: Scalars['Boolean']['output'];
  addRestaurant: Scalars['Boolean']['output'];
  addUser: Scalars['String']['output'];
  addWaitListUser: Scalars['Boolean']['output'];
  blockAdmin: Scalars['Boolean']['output'];
  changeRestaurantStatus: Scalars['Boolean']['output'];
  changeRole: Scalars['Boolean']['output'];
  changeUserStatus: Scalars['Boolean']['output'];
  completeUserOnboarding: Scalars['Boolean']['output'];
  createEmailCampaign: Scalars['Boolean']['output'];
  createEmailTemplate: Scalars['Boolean']['output'];
  deleteAdmin: Scalars['Boolean']['output'];
  deleteEmailTemplate: Scalars['Boolean']['output'];
  deleteMenu: Scalars['Boolean']['output'];
  removeRestaurant: Scalars['Boolean']['output'];
  sendTestEmails: Scalars['Boolean']['output'];
  updateCategory: Scalars['Boolean']['output'];
  updateMenu: Scalars['Boolean']['output'];
  updateRestaurant: Scalars['Boolean']['output'];
  updateUserOnboarding: Scalars['Boolean']['output'];
  updateUserProfile: Scalars['Boolean']['output'];
  verifyUserDetails: Scalars['Boolean']['output'];
};


export type MutationAddAdminArgs = {
  input: AddAdminInput;
};


export type MutationAddCategoryArgs = {
  input: AddCategoryInput;
  menuId: Scalars['String']['input'];
  restaurantId: Scalars['String']['input'];
};


export type MutationAddMenuArgs = {
  input: AddMenuInput;
  restaurantId: Scalars['String']['input'];
};


export type MutationAddRestaurantArgs = {
  input: AddRestaurantInput;
};


export type MutationAddUserArgs = {
  input: AddUserInput;
};


export type MutationAddWaitListUserArgs = {
  input: AddWaitListUserInput;
};


export type MutationBlockAdminArgs = {
  id: Scalars['String']['input'];
  updateStatus: PlatformStatus;
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


export type MutationDeleteAdminArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteEmailTemplateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMenuArgs = {
  menuId: Scalars['String']['input'];
};


export type MutationRemoveRestaurantArgs = {
  id: Scalars['String']['input'];
};


export type MutationSendTestEmailsArgs = {
  input: TestEmailInput;
};


export type MutationUpdateCategoryArgs = {
  categoryId: Scalars['String']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateMenuArgs = {
  input: UpdateMenuInput;
  menuId: Scalars['String']['input'];
};


export type MutationUpdateRestaurantArgs = {
  input: UpdateRestaurantInput;
};


export type MutationUpdateUserOnboardingArgs = {
  input: UpdateUserOnboardingInput;
};


export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
};


export type MutationVerifyUserDetailsArgs = {
  input: VerifyUserDetails;
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
  emailOtpVerification: Scalars['Boolean']['output'];
  generateOtpForEmailVerification: Scalars['String']['output'];
  generateOtpForLogin: Scalars['String']['output'];
  generateOtpForNumberVerification: Scalars['String']['output'];
  getAdmins: Array<Admin>;
  getAllEmailCampaigns: Array<EmailCampaignsObject>;
  getAllEmailTemplates: Array<EmailTemplatesObject>;
  getAllRestaurantUsers: Array<User>;
  getAllRestaurants: Array<Restaurant>;
  getRestaurantDetails: Restaurant;
  getUserOnboardingDetails: User;
  getUserRestaurants: Array<Restaurant>;
  getWaitListUsers: Array<WaitListUser>;
  logout: Scalars['Boolean']['output'];
  me: Admin;
  meUser: User;
  mobileNumberOtpVerification: Scalars['Boolean']['output'];
  resetPasswordAdmin: Scalars['Boolean']['output'];
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


export type QueryGetRestaurantDetailsArgs = {
  id: Scalars['String']['input'];
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


export type QueryVerifyOtpForLoginArgs = {
  input: Scalars['String']['input'];
  key: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  _id: Scalars['ID']['output'];
  address: AddressInfo;
  availability: Array<Availability>;
  brandingLogo: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  integrations?: Maybe<Array<Integration>>;
  locationName?: Maybe<MasterCommon>;
  menus: Array<MenuInfo>;
  name: MasterCommon;
  socialInfo?: Maybe<SocialInfo>;
  status: RestaurantStatus;
  taxRates: Array<TaxRateInfo>;
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
};

export type RestaurantInfo = {
  __typename?: 'RestaurantInfo';
  _id: Scalars['ID']['output'];
  city?: Maybe<MasterCommon>;
  name: MasterCommon;
  status: RestaurantStatus;
};

/** Restaurant status enum. */
export enum RestaurantStatus {
  Active = 'active',
  Blocked = 'blocked',
  BlockedBySystem = 'blockedBySystem'
}

export type SocialInfo = {
  __typename?: 'SocialInfo';
  _id: Scalars['ID']['output'];
  facebook?: Maybe<Scalars['String']['output']>;
  instagram?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type SocialInfoInput = {
  facebook?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** Types of SoftWare Enum */
export enum SoftWareEnum {
  None = 'None',
  Software1 = 'Software1',
  Software2 = 'Software2',
  Software3 = 'Software3'
}

/** Status enum  */
export enum StatusEnum {
  Active = 'active',
  Inactive = 'inactive'
}

export type TaxRateInfo = {
  __typename?: 'TaxRateInfo';
  _id: Scalars['ID']['output'];
  default: Scalars['Boolean']['output'];
  name: MasterCommon;
  salesTax: MasterCommonNumber;
};

export type TaxRateInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  default: Scalars['Boolean']['input'];
  name: MasterCommonInput;
  salesTax: MasterCommonInputNumber;
};

export type TestEmailInput = {
  emails: Scalars['String']['input'];
  html: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type UpdateCategoryInput = {
  availability?: InputMaybe<Array<AvailabilityInput>>;
  visibility?: InputMaybe<Array<VisibilityInput>>;
};

export type UpdateMenuInput = {
  availability?: InputMaybe<Array<AvailabilityInput>>;
  visibility?: InputMaybe<Array<VisibilityInput>>;
};

export type UpdateRestaurantInput = {
  address?: InputMaybe<AddressInfoInput>;
  availability?: InputMaybe<Array<AvailabilityInput>>;
  brandingLogo?: InputMaybe<Scalars['String']['input']>;
  locationName?: InputMaybe<MasterCommonInput>;
  restaurantId: Scalars['String']['input'];
  socialInfo?: InputMaybe<SocialInfoInput>;
  status: RestaurantStatus;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserOnboardingInput = {
  address?: InputMaybe<AddressInfoInput>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  businessType?: InputMaybe<BusinessTypeEnum>;
  dob?: InputMaybe<Scalars['String']['input']>;
  ein?: InputMaybe<Scalars['String']['input']>;
  employeeSize?: InputMaybe<MasterCommonInput>;
  establishedAt?: InputMaybe<Scalars['String']['input']>;
  estimatedRevenue?: InputMaybe<MasterCommonInput>;
  ssn?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserProfileInput = {
  address?: InputMaybe<AddressInfoInput>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  businessType?: InputMaybe<BusinessTypeEnum>;
  dob?: InputMaybe<Scalars['DateTimeISO']['input']>;
  ein?: InputMaybe<Scalars['String']['input']>;
  employeeSize?: InputMaybe<MasterCommonInput>;
  establishedAt?: InputMaybe<Scalars['String']['input']>;
  estimatedRevenue?: InputMaybe<MasterCommonInput>;
  ssn?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  accessHistory?: Maybe<Array<AccessHistory>>;
  accountPreferences?: Maybe<AccountPreference>;
  address?: Maybe<AddressInfo>;
  businessName?: Maybe<Scalars['String']['output']>;
  businessType?: Maybe<BusinessTypeEnum>;
  createdAt: Scalars['DateTimeISO']['output'];
  dob?: Maybe<Scalars['DateTimeISO']['output']>;
  ein?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  employeeSize?: Maybe<MasterCommon>;
  establishedAt?: Maybe<Scalars['String']['output']>;
  estimatedRevenue?: Maybe<MasterCommon>;
  firstName: Scalars['String']['output'];
  lastLoggedIn: Scalars['DateTimeISO']['output'];
  lastLoggedOut: Scalars['DateTimeISO']['output'];
  lastName: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  restaurants?: Maybe<Array<RestaurantInfo>>;
  ssn?: Maybe<Scalars['String']['output']>;
  status: UserStatus;
  statusUpdatedBy?: Maybe<Admin>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

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

export type Visibility = {
  __typename?: 'Visibility';
  name: MasterCommon;
  status: Scalars['Boolean']['output'];
};

export type VisibilityInput = {
  name: MasterCommonInput;
  status: Scalars['Boolean']['input'];
};

export type WaitListUser = {
  __typename?: 'WaitListUser';
  _id?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  number: Scalars['String']['output'];
  software: SoftWareEnum;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  website: Scalars['String']['output'];
};

export type AddCategoryInput = {
  desc: MasterCommonInput;
  name: MasterCommonInput;
  status: StatusEnum;
};

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: boolean };

export type GenerateOtpForLoginQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type GenerateOtpForLoginQuery = { __typename?: 'Query', generateOtpForLogin: string };

export type MeUserQueryVariables = Exact<{ [key: string]: never; }>;


export type MeUserQuery = { __typename?: 'Query', meUser: { __typename?: 'User', _id: string, firstName: string, lastName: string, status: UserStatus, email: string, phone: string, businessName?: string | null, establishedAt?: string | null, accountPreferences?: { __typename?: 'AccountPreference', whatsApp: boolean, email: boolean } | null } };

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

export type UpdateRestaurantUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateRestaurantUserProfileMutation = { __typename?: 'Mutation', updateUserProfile: boolean };

export type UpdateUserOnboardingMutationVariables = Exact<{
  input: UpdateUserOnboardingInput;
}>;


export type UpdateUserOnboardingMutation = { __typename?: 'Mutation', updateUserOnboarding: boolean };

export type CompleteUserOnboardingMutationVariables = Exact<{ [key: string]: never; }>;


export type CompleteUserOnboardingMutation = { __typename?: 'Mutation', completeUserOnboarding: boolean };

export type GetUserOnboardingDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserOnboardingDetailsQuery = { __typename?: 'Query', getUserOnboardingDetails: { __typename?: 'User', ein?: string | null, ssn?: string | null, businessName?: string | null, dob?: any | null, establishedAt?: string | null, businessType?: BusinessTypeEnum | null, address?: { __typename?: 'AddressInfo', addressLine1: { __typename?: 'MasterCommon', value: string }, addressLine2?: { __typename?: 'MasterCommon', value: string } | null, state: { __typename?: 'MasterCommon', value: string }, city: { __typename?: 'MasterCommon', value: string }, postcode: { __typename?: 'MasterCommon', value: string }, coordinate?: { __typename?: 'LocationCommon', coordinates: Array<number> } | null } | null, employeeSize?: { __typename?: 'MasterCommon', value: string } | null, estimatedRevenue?: { __typename?: 'MasterCommon', value: string } | null } };


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
    businessName
    establishedAt
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
export const UpdateRestaurantUserProfileDocument = gql`
    mutation UpdateRestaurantUserProfile($input: UpdateUserProfileInput!) {
  updateUserProfile(input: $input)
}
    `;
export const UpdateUserOnboardingDocument = gql`
    mutation UpdateUserOnboarding($input: UpdateUserOnboardingInput!) {
  updateUserOnboarding(input: $input)
}
    `;
export const CompleteUserOnboardingDocument = gql`
    mutation completeUserOnboarding {
  completeUserOnboarding
}
    `;
export const GetUserOnboardingDetailsDocument = gql`
    query getUserOnboardingDetails {
  getUserOnboardingDetails {
    ein
    ssn
    businessName
    address {
      addressLine1 {
        value
      }
      addressLine2 {
        value
      }
      state {
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
    }
    employeeSize {
      value
    }
    dob
    establishedAt
    businessType
    estimatedRevenue {
      value
    }
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
    UpdateRestaurantUserProfile(variables: UpdateRestaurantUserProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateRestaurantUserProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateRestaurantUserProfileMutation>(UpdateRestaurantUserProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateRestaurantUserProfile', 'mutation', variables);
    },
    UpdateUserOnboarding(variables: UpdateUserOnboardingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateUserOnboardingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserOnboardingMutation>(UpdateUserOnboardingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateUserOnboarding', 'mutation', variables);
    },
    completeUserOnboarding(variables?: CompleteUserOnboardingMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CompleteUserOnboardingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CompleteUserOnboardingMutation>(CompleteUserOnboardingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'completeUserOnboarding', 'mutation', variables);
    },
    getUserOnboardingDetails(variables?: GetUserOnboardingDetailsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserOnboardingDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserOnboardingDetailsQuery>(GetUserOnboardingDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserOnboardingDetails', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;