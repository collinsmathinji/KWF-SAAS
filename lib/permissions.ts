import { Permission } from "@/types/permissions";

export interface MenuItem {
  icon: any;
  label: string;
  section: string;
  description: string;
  requiredPermission?: {
    module: string;
    method: string;
  };
}

export function filterMenuItemsByPermissions(menuItems: MenuItem[], userPermissions: Permission[]): MenuItem[] {
  return menuItems.filter(item => {
    if (!item.requiredPermission) return true;
    
    return userPermissions.some(permission => 
      permission.module === item.requiredPermission?.module && 
      permission.method === item.requiredPermission?.method
    );
  });
} 