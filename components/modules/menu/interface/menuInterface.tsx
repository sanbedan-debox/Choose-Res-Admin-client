// import { Admin, AdminRole, Menu } from "@/generated/graphql";

// // __typename?: 'Admin';
// //   _id: Scalars['ID']['output'];
// //   accessHistory: Array<AccessHistory>;
// //   blockedBy: Admin;
// //   createdAt: Scalars['DateTimeISO']['output'];
// //   createdBy: Admin;
// //   email: Scalars['String']['output'];
// //   lastLoggedIn?: Maybe<Scalars['DateTimeISO']['output']>;
// //   lastLoggedOut?: Maybe<Scalars['DateTimeISO']['output']>;
// //   name: Scalars['String']['output'];
// //   numberOfResetPassword: Scalars['Float']['output'];
// //   role: AdminRole;
// //   status: PlatformStatus;
// //   unBlockedBy: Admin;
// //   updatedAt: Scalars['DateTimeISO']['output'];
// //   updatedBy: Admin;

// type AdminRow = Omit<
//   Menu,
//   | "_id"
//   | "__typename"
//   | "accessHistory"
//   | "createdBy"
//   | "updatedBy"
//   | "blockedBy"
//   | "unBlockedBy"
// >;

// export type MenuRowType = {
//   id: string;
//   // createdByName: string;
//   // updatedByName: string;
//   // blockedByName: string;
//   // unBlockedByName: string;
// } & AdminRow;

// export interface AddAdminFormInputs {
//   name: string;
//   email: string;
//   password: string;
//   role: RoleOption | null;
// }

// export interface RoleOption {
//   value: AdminRole;
//   label: string;
// }

// export const roleOptions: RoleOption[] = [
//   { value: AdminRole.Admin, label: "Admin" },
//   { value: AdminRole.Master, label: "Master" },
//   { value: AdminRole.Normal, label: "Normal" },
// ];

// export interface ChangePasswordInputs {
//   newPassword: string;
// }

// export interface ChangeRoleInputs {
//   role: RoleOption | null;
// }
