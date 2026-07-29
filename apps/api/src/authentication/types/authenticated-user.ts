export type AuthenticatedUser = {
  id: string;
  email: string;
  organizationId: string;
  organizationName: string;
};

export type AuthenticatedRequest = {
  user?: AuthenticatedUser;
};
