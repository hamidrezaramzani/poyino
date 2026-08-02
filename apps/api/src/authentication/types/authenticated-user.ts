export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
  departmentId: string;
  organizationId: string;
  organizationName: string;
};

export type AuthenticatedRequest = {
  user?: AuthenticatedUser;
};
