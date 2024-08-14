import { PermissionTypeEnum } from "@/generated/graphql";

type Permission = {
  status: boolean;
  type: PermissionTypeEnum;
};

export const hasAccess = (
  permissions: Permission[],
  requiredPermission: PermissionTypeEnum
): boolean => {
  if (permissions.length > 0) {
    const permission = permissions.find(
      (perm) => perm.type === requiredPermission
    );
    return permission ? permission.status : false;
  }
  return false;
};
