export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
  platformRole: string;
  departmentId: string;
  organizationId: string;
  organizationName: string;
};

export type AuthenticatedRequest = {
  user?: AuthenticatedUser;
};
