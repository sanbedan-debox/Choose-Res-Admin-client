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

export type AddRestaurantInput = {
  address?: InputMaybe<MasterCommonInput>;
  availability: Array<AvailabilityDateInput>;
  city?: InputMaybe<MasterCommonInput>;
  name: MasterCommonInput;
  state?: InputMaybe<MasterCommonInput>;
  taxRate?: InputMaybe<MasterCommonInputNumber>;
  zipCode?: InputMaybe<MasterCommonInputNumber>;
};

export type AddRestaurantUser = {
  __typename?: 'AddRestaurantUser';
  emailOtpVerifyKey: Scalars['String']['output'];
  numberOtpVerifyKey: Scalars['String']['output'];
};

export type AddRestaurantUserInput = {
  communication: CommunicationPreferenceInput;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type AddWaitListUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  number: Scalars['String']['input'];
  software: SoftWareEnum;
  website: Scalars['String']['input'];
};

export type Admin = {
  __typename?: 'Admin';
  _id: Scalars['ID']['output'];
  blockedBy: Admin;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Admin;
  devices: Array<Device>;
  email: Scalars['String']['output'];
  lastLoggedIn?: Maybe<Scalars['DateTimeISO']['output']>;
  lastLoggedOut?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  numberOfResetPassword: Scalars['Float']['output'];
  role: AdminRole;
  status: PlantFormStatus;
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

export type AvailabilityDate = {
  __typename?: 'AvailabilityDate';
  _id: Scalars['ID']['output'];
  day: Scalars['String']['output'];
  end: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
  status?: Maybe<RestaurantStatus>;
};

export type AvailabilityDateInput = {
  day: Day;
  end: Scalars['DateTimeISO']['input'];
  start: Scalars['DateTimeISO']['input'];
  status?: InputMaybe<RestaurantStatus>;
};

export type CommunicationPreference = {
  __typename?: 'CommunicationPreference';
  email: Scalars['Boolean']['output'];
  whatsApp: Scalars['Boolean']['output'];
};

export type CommunicationPreferenceInput = {
  email: Scalars['Boolean']['input'];
  whatsApp: Scalars['Boolean']['input'];
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

export type Device = {
  __typename?: 'Device';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  lastLoggedIn: Scalars['DateTimeISO']['output'];
  lastLoggedOut: Scalars['DateTimeISO']['output'];
  userAgent: Scalars['String']['output'];
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

export type LocationCommon = {
  __typename?: 'LocationCommon';
  coordinates: Array<Scalars['Float']['output']>;
  type: Scalars['String']['output'];
};

export type LocationCommonInput = {
  coordinates: Array<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
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
  availability: Array<AvailabilityDate>;
  master: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
  visibility: Visibility;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAdmin: Scalars['Boolean']['output'];
  addRestaurant: Scalars['Boolean']['output'];
  addRestaurantUser: AddRestaurantUser;
  addWaitListUser: Scalars['Boolean']['output'];
  blockAdmin: Scalars['Boolean']['output'];
  changeRole: Scalars['Boolean']['output'];
  createEmailCampaign: Scalars['Boolean']['output'];
  createEmailTemplate: Scalars['Boolean']['output'];
  deleteAdmin: Scalars['Boolean']['output'];
  deleteEmailTemplate: Scalars['Boolean']['output'];
  removeRestaurant: Scalars['Boolean']['output'];
  sendTestEmails: Scalars['Boolean']['output'];
  updateRestaurant: Scalars['Boolean']['output'];
  updateRestaurantUserProfile: Scalars['Boolean']['output'];
  verifyRestaurantUserDetails: Scalars['Boolean']['output'];
};


export type MutationAddAdminArgs = {
  input: AddAdminInput;
};


export type MutationAddRestaurantArgs = {
  input: AddRestaurantInput;
};


export type MutationAddRestaurantUserArgs = {
  input: AddRestaurantUserInput;
};


export type MutationAddWaitListUserArgs = {
  input: AddWaitListUserInput;
};


export type MutationBlockAdminArgs = {
  id: Scalars['String']['input'];
  updateStatus: PlantFormStatus;
};


export type MutationChangeRoleArgs = {
  id: Scalars['String']['input'];
  role: AdminRole;
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


export type MutationRemoveRestaurantArgs = {
  id: Scalars['String']['input'];
};


export type MutationSendTestEmailsArgs = {
  input: TestEmailInput;
};


export type MutationUpdateRestaurantArgs = {
  input: UpdateRestaurantInput;
};


export type MutationUpdateRestaurantUserProfileArgs = {
  input: UpdateUserProfileInput;
};


export type MutationVerifyRestaurantUserDetailsArgs = {
  input: VerifyRestaurantUserDetails;
};

/** Restaurant user status */
export enum PlantFormStatus {
  Active = 'active',
  Blocked = 'blocked'
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
  getAllRestaurantUsers: Array<RestaurantUser>;
  getAllRestaurants: Array<Restaurant>;
  getWaitListUsers: Array<WaitListUser>;
  logout: Scalars['Boolean']['output'];
  me: Admin;
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
  address?: Maybe<MasterCommon>;
  availability: Array<AvailabilityDate>;
  city?: Maybe<MasterCommon>;
  location?: Maybe<LocationCommon>;
  menus?: Maybe<Array<Menu>>;
  name: MasterCommon;
  restaurantUser: RestaurantUser;
  state?: Maybe<MasterCommon>;
  status: RestaurantStatus;
  taxRate?: Maybe<MasterCommonNumber>;
  zipCode?: Maybe<MasterCommonNumber>;
};

export type RestaurantInfo = {
  __typename?: 'RestaurantInfo';
  city?: Maybe<MasterCommon>;
  name: MasterCommon;
  status: RestaurantStatus;
};

/** Restaurant status enum. */
export enum RestaurantStatus {
  Closed = 'Closed',
  Open = 'Open'
}

export type RestaurantUser = {
  __typename?: 'RestaurantUser';
  _id: Scalars['ID']['output'];
  communication?: Maybe<CommunicationPreference>;
  createdAt: Scalars['DateTimeISO']['output'];
  deviceDetails: Array<Device>;
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  restaurants?: Maybe<Array<RestaurantInfo>>;
  status: PlantFormStatus;
  updatedAt: Scalars['DateTimeISO']['output'];
};

/** Types of SoftWare Enum */
export enum SoftWareEnum {
  None = 'None',
  Software1 = 'Software1',
  Software2 = 'Software2',
  Software3 = 'Software3'
}

export type TestEmailInput = {
  emails: Scalars['String']['input'];
  html: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type UpdateRestaurantInput = {
  address?: InputMaybe<MasterCommonInput>;
  availability?: InputMaybe<Array<AvailabilityDateInput>>;
  city?: InputMaybe<MasterCommonInput>;
  location?: InputMaybe<LocationCommonInput>;
  restaurantId: Scalars['String']['input'];
  state?: InputMaybe<MasterCommonInput>;
  status?: InputMaybe<RestaurantStatus>;
  taxRate?: InputMaybe<MasterCommonInputNumber>;
  zipCode?: InputMaybe<MasterCommonInputNumber>;
};

export type UpdateUserProfileInput = {
  communication?: InputMaybe<Array<CommunicationPreferenceInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  restaurantIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type VerifyRestaurantUserDetails = {
  communication: CommunicationPreferenceInput;
  email: Scalars['String']['input'];
  emailOtp: Scalars['String']['input'];
  emailOtpVerifyKey: Scalars['String']['input'];
  name: Scalars['String']['input'];
  numberOtp: Scalars['String']['input'];
  numberOtpVerifyKey: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

/** Menu visibility enum. */
export enum Visibility {
  Delivery = 'Delivery',
  Online = 'Online',
  Pos = 'POS'
}

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

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: boolean };

export type GenerateOtpForLoginQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type GenerateOtpForLoginQuery = { __typename?: 'Query', generateOtpForLogin: string };

export type VerifyOtpForLoginQueryVariables = Exact<{
  key: Scalars['String']['input'];
  input: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type VerifyOtpForLoginQuery = { __typename?: 'Query', verifyOtpForLogin: boolean };

export type AddRestaurantUserMutationVariables = Exact<{
  input: AddRestaurantUserInput;
}>;


export type AddRestaurantUserMutation = { __typename?: 'Mutation', addRestaurantUser: { __typename?: 'AddRestaurantUser', emailOtpVerifyKey: string, numberOtpVerifyKey: string } };

export type VerifyRestaurantUserDetailsMutationVariables = Exact<{
  input: VerifyRestaurantUserDetails;
}>;


export type VerifyRestaurantUserDetailsMutation = { __typename?: 'Mutation', verifyRestaurantUserDetails: boolean };

export type UpdateRestaurantUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateRestaurantUserProfileMutation = { __typename?: 'Mutation', updateRestaurantUserProfile: boolean };


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
export const VerifyOtpForLoginDocument = gql`
    query VerifyOtpForLogin($key: String!, $input: String!, $otp: String!) {
  verifyOtpForLogin(key: $key, input: $input, otp: $otp)
}
    `;
export const AddRestaurantUserDocument = gql`
    mutation addRestaurantUser($input: AddRestaurantUserInput!) {
  addRestaurantUser(input: $input) {
    emailOtpVerifyKey
    numberOtpVerifyKey
  }
}
    `;
export const VerifyRestaurantUserDetailsDocument = gql`
    mutation VerifyRestaurantUserDetails($input: VerifyRestaurantUserDetails!) {
  verifyRestaurantUserDetails(input: $input)
}
    `;
export const UpdateRestaurantUserProfileDocument = gql`
    mutation UpdateRestaurantUserProfile($input: UpdateUserProfileInput!) {
  updateRestaurantUserProfile(input: $input)
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
    VerifyOtpForLogin(variables: VerifyOtpForLoginQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<VerifyOtpForLoginQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VerifyOtpForLoginQuery>(VerifyOtpForLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'VerifyOtpForLogin', 'query', variables);
    },
    addRestaurantUser(variables: AddRestaurantUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddRestaurantUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddRestaurantUserMutation>(AddRestaurantUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addRestaurantUser', 'mutation', variables);
    },
    VerifyRestaurantUserDetails(variables: VerifyRestaurantUserDetailsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<VerifyRestaurantUserDetailsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<VerifyRestaurantUserDetailsMutation>(VerifyRestaurantUserDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'VerifyRestaurantUserDetails', 'mutation', variables);
    },
    UpdateRestaurantUserProfile(variables: UpdateRestaurantUserProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateRestaurantUserProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateRestaurantUserProfileMutation>(UpdateRestaurantUserProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateRestaurantUserProfile', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;