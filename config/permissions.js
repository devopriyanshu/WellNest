export const PERMISSIONS = {
  // User permissions
  USER_READ_OWN: 'user:read:own',
  USER_UPDATE_OWN: 'user:update:own',
  USER_DELETE_OWN: 'user:delete:own',
  
  // Expert permissions
  EXPERT_READ_OWN: 'expert:read:own',
  EXPERT_UPDATE_OWN: 'expert:update:own',
  EXPERT_READ_ALL: 'expert:read:all',
  
  // Appointment permissions
  APPOINTMENT_CREATE: 'appointment:create',
  APPOINTMENT_READ_OWN: 'appointment:read:own',
  APPOINTMENT_UPDATE_OWN: 'appointment:update:own',
  APPOINTMENT_DELETE_OWN: 'appointment:delete:own',
  APPOINTMENT_MANAGE: 'appointment:manage',
  
  // Health logs
  HEALTH_LOG_CREATE: 'health_log:create',
  HEALTH_LOG_READ_OWN: 'health_log:read:own',
  HEALTH_LOG_UPDATE_OWN: 'health_log:update:own',
  
  // Admin permissions
  ADMIN_USER_MANAGE: 'admin:user:manage',
  ADMIN_EXPERT_APPROVE: 'admin:expert:approve',
  ADMIN_CENTER_APPROVE: 'admin:center:approve',
  ADMIN_REVIEW_MODERATE: 'admin:review:moderate',
  ADMIN_AUDIT_VIEW: 'admin:audit:view',
  
  // Super admin
  SUPER_ADMIN_ALL: 'super_admin:all',
};

export const ROLE_PERMISSIONS = {
  USER: [
    PERMISSIONS.USER_READ_OWN,
    PERMISSIONS.USER_UPDATE_OWN,
    PERMISSIONS.APPOINTMENT_CREATE,
    PERMISSIONS.APPOINTMENT_READ_OWN,
    PERMISSIONS.APPOINTMENT_UPDATE_OWN,
    PERMISSIONS.APPOINTMENT_DELETE_OWN,
    PERMISSIONS.HEALTH_LOG_CREATE,
    PERMISSIONS.HEALTH_LOG_READ_OWN,
    PERMISSIONS.HEALTH_LOG_UPDATE_OWN,
  ],
  
  EXPERT: [
    PERMISSIONS.EXPERT_READ_OWN,
    PERMISSIONS.EXPERT_UPDATE_OWN,
    PERMISSIONS.APPOINTMENT_READ_OWN,
    PERMISSIONS.APPOINTMENT_MANAGE,
  ],
  
  CENTER: [
    PERMISSIONS.EXPERT_READ_ALL,
  ],
  
  ADMIN: [
    PERMISSIONS.ADMIN_USER_MANAGE,
    PERMISSIONS.ADMIN_EXPERT_APPROVE,
    PERMISSIONS.ADMIN_CENTER_APPROVE,
    PERMISSIONS.ADMIN_REVIEW_MODERATE,
    PERMISSIONS.ADMIN_AUDIT_VIEW,
  ],
  
  SUPER_ADMIN: [
    PERMISSIONS.SUPER_ADMIN_ALL,
  ],
};

export const hasPermission = (userRole, requiredPermission) => {
  if (userRole === 'SUPER_ADMIN') return true;
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(requiredPermission);
};
