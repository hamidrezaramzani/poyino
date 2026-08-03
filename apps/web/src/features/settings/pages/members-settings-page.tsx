import type { AssignableMemberRole, OrganizationMember } from "@poyino/contracts";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Form,
  FormField,
  Input,
  LoadingButton,
  Select,
  Skeleton,
  Table,
  TableSection,
  type TableColumn,
} from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { formatDate } from "../../../shared/lib/format-date";
import { useCan } from "../../../shared/permissions/can";
import { useMembersSettings } from "../hooks/use-members-settings";

const ASSIGNABLE_ROLES: AssignableMemberRole[] = [
  "ADMINISTRATOR",
  "RECRUITER",
  "HIRING_MANAGER",
  "INTERVIEWER",
  "VIEWER",
];

export function MembersSettingsPage() {
  const { t, locale } = useI18n();
  const canInvite = useCan("members:invite");
  const canSuspend = useCan("members:suspend");
  const members = useMembersSettings();

  if (members.loadStatus === "loading") {
    return (
      <Card title={t.settings.members.title}>
        <Skeleton height={24} />
        <Skeleton height={44} style={{ marginTop: "1rem" }} />
        <Skeleton height={44} style={{ marginTop: "1rem" }} />
      </Card>
    );
  }

  if (members.loadStatus === "error") {
    return (
      <Card title={t.settings.members.title}>
        <p>{t.settings.errors.loadFailed}</p>
        <Button type="button" onClick={() => void members.retry()}>
          {t.settings.retry}
        </Button>
      </Card>
    );
  }

  const roleOptions = ASSIGNABLE_ROLES.map((role) => ({
    value: role,
    label: t.settings.members.roles[role],
  }));

  const departmentOptions = members.departments.map((department) => ({
    value: department.id,
    label: department.name,
  }));

  const columns: Array<TableColumn<OrganizationMember>> = [
    {
      key: "email",
      header: t.settings.members.columns.email,
      render: (member) => member.email,
    },
    {
      key: "role",
      header: t.settings.members.columns.role,
      render: (member) => t.settings.members.roles[member.role],
    },
    {
      key: "department",
      header: t.settings.members.columns.department,
      render: (member) => member.departmentName,
    },
    {
      key: "status",
      header: t.settings.members.columns.status,
      render: (member) => (
        <Badge variant={member.status === "ACTIVE" ? "success" : "warning"}>
          {t.settings.members.statuses[member.status]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: t.settings.members.columns.joined,
      render: (member) => formatDate(member.createdAt, locale),
    },
    {
      key: "actions",
      header: t.settings.members.columns.actions,
      render: (member) => {
        if (member.isOwner) {
          return (
            <span className="settings-members-owner-label">
              {t.settings.members.ownerLabel}
            </span>
          );
        }

        return (
          <div className="dashboard-row-actions">
            {canInvite ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => members.openEdit(member)}
              >
                {t.settings.members.edit}
              </Button>
            ) : null}
            {canSuspend && member.id !== members.currentUserId ? (
              <Button
                type="button"
                variant={member.status === "ACTIVE" ? "danger" : "secondary"}
                disabled={members.statusUpdatingId === member.id}
                onClick={() => void members.toggleStatus(member)}
              >
                {member.status === "ACTIVE"
                  ? t.settings.members.suspend
                  : t.settings.members.activate}
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <TableSection
        title={t.settings.members.title}
        description={t.settings.members.description}
        actions={
          canInvite ? (
            <div className="settings-members-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={members.openDepartmentDialog}
              >
                {t.settings.members.addDepartment}
              </Button>
              <Button type="button" onClick={members.openCreate}>
                {t.settings.members.add}
              </Button>
            </div>
          ) : undefined
        }
      >
        {members.members.length === 0 ? (
          <EmptyState title={t.settings.members.empty} />
        ) : (
          <Table
            columns={columns}
            rows={members.members}
            getRowKey={(member) => member.id}
            caption={t.settings.members.title}
          />
        )}
      </TableSection>

      {members.dialogOpen ? (
        <div className="dashboard-dialog-backdrop" role="presentation">
          <div
            className="dashboard-dialog settings-members-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="members-dialog-title"
          >
            <h2 id="members-dialog-title">
              {members.editingMember
                ? t.settings.members.editTitle
                : t.settings.members.addTitle}
            </h2>
            <p>
              {members.editingMember
                ? t.settings.members.editDescription
                : t.settings.members.addDescription}
            </p>

            <Form
              onSubmit={(event) => {
                event.preventDefault();
                if (members.editingMember) {
                  void members.submitEdit();
                } else {
                  void members.submitCreate();
                }
              }}
            >
              {members.editingMember ? (
                <>
                  <FormField
                    label={t.settings.members.columns.email}
                    htmlFor="editMemberEmail"
                  >
                    <Input
                      id="editMemberEmail"
                      value={members.editingMember.email}
                      disabled
                    />
                  </FormField>
                  <FormField
                    label={t.settings.members.columns.role}
                    htmlFor="editRole"
                    required
                  >
                    <Select
                      id="editRole"
                      value={members.editRole}
                      options={roleOptions}
                      disabled={members.isSubmitting}
                      onChange={(event) =>
                        members.setEditRole(
                          event.target.value as AssignableMemberRole,
                        )
                      }
                    />
                  </FormField>
                  <FormField
                    label={t.settings.members.columns.department}
                    htmlFor="editDepartmentId"
                    required
                  >
                    <Select
                      id="editDepartmentId"
                      value={members.editDepartmentId}
                      options={departmentOptions}
                      disabled={members.isSubmitting}
                      onChange={(event) =>
                        members.setEditDepartmentId(event.target.value)
                      }
                    />
                  </FormField>
                </>
              ) : (
                <>
                  <FormField
                    label={t.settings.members.columns.email}
                    htmlFor="memberEmail"
                    required
                  >
                    <Input
                      id="memberEmail"
                      type="email"
                      value={members.createValues.email}
                      disabled={members.isSubmitting}
                      onChange={(event) =>
                        members.setCreateValues((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                    />
                  </FormField>
                  <FormField
                    label={t.settings.members.passwordLabel}
                    htmlFor="memberPassword"
                    required
                  >
                    <Input
                      id="memberPassword"
                      type="password"
                      value={members.createValues.password}
                      disabled={members.isSubmitting}
                      onChange={(event) =>
                        members.setCreateValues((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                    />
                  </FormField>
                  <FormField
                    label={t.settings.members.columns.role}
                    htmlFor="memberRole"
                    required
                  >
                    <Select
                      id="memberRole"
                      value={members.createValues.role}
                      options={roleOptions}
                      disabled={members.isSubmitting}
                      onChange={(event) =>
                        members.setCreateValues((current) => ({
                          ...current,
                          role: event.target.value as AssignableMemberRole,
                        }))
                      }
                    />
                  </FormField>
                  <FormField
                    label={t.settings.members.columns.department}
                    htmlFor="memberDepartmentId"
                    required
                  >
                    <Select
                      id="memberDepartmentId"
                      value={members.createValues.departmentId}
                      options={departmentOptions}
                      disabled={members.isSubmitting}
                      onChange={(event) =>
                        members.setCreateValues((current) => ({
                          ...current,
                          departmentId: event.target.value,
                        }))
                      }
                    />
                  </FormField>
                </>
              )}

              <div className="dashboard-dialog-actions">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={members.isSubmitting}
                  onClick={members.closeDialog}
                >
                  {t.settings.members.cancel}
                </Button>
                <LoadingButton
                  type="submit"
                  loading={members.isSubmitting}
                  loadingLabel={t.settings.saving}
                >
                  {members.editingMember
                    ? t.settings.members.save
                    : t.settings.members.add}
                </LoadingButton>
              </div>
            </Form>
          </div>
        </div>
      ) : null}

      {members.departmentDialogOpen ? (
        <div className="dashboard-dialog-backdrop" role="presentation">
          <div
            className="dashboard-dialog settings-members-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="department-dialog-title"
          >
            <h2 id="department-dialog-title">
              {t.settings.members.addDepartmentTitle}
            </h2>
            <p>{t.settings.members.addDepartmentDescription}</p>
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                void members.submitDepartment();
              }}
            >
              <FormField
                label={t.settings.members.departmentNameLabel}
                htmlFor="newDepartmentName"
                required
              >
                <Input
                  id="newDepartmentName"
                  value={members.newDepartmentName}
                  disabled={members.isCreatingDepartment}
                  onChange={(event) =>
                    members.setNewDepartmentName(event.target.value)
                  }
                />
              </FormField>
              <div className="dashboard-dialog-actions">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={members.isCreatingDepartment}
                  onClick={members.closeDepartmentDialog}
                >
                  {t.settings.members.cancel}
                </Button>
                <LoadingButton
                  type="submit"
                  loading={members.isCreatingDepartment}
                  loadingLabel={t.settings.saving}
                >
                  {t.settings.members.addDepartment}
                </LoadingButton>
              </div>
            </Form>
          </div>
        </div>
      ) : null}
    </>
  );
}