import type {
  AssignableMemberRole,
  DepartmentSummary,
  MemberStatus,
  OrganizationMember,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { ApiRequestError } from "../../../shared/api/api-client";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { useSession } from "../../../shared/session/session-provider";
import { listDepartments, createDepartment } from "../../organization/services/organization.service";
import {
  createMember,
  listMembers,
  updateMember,
} from "../../organization/services/members.service";

export type CreateMemberFormValues = {
  email: string;
  password: string;
  role: AssignableMemberRole | "";
  departmentId: string;
};

const emptyCreateValues: CreateMemberFormValues = {
  email: "",
  password: "",
  role: "RECRUITER",
  departmentId: "",
};

export function useMembersSettings() {
  const { t } = useI18n();
  const { push } = useToast();
  const { user } = useSession();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loadStatus, setLoadStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(
    null,
  );
  const [createValues, setCreateValues] =
    useState<CreateMemberFormValues>(emptyCreateValues);
  const [editRole, setEditRole] = useState<AssignableMemberRole | "">("");
  const [editDepartmentId, setEditDepartmentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingDepartment, setIsCreatingDepartment] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadStatus("loading");
    try {
      const [memberItems, departmentItems] = await Promise.all([
        listMembers(),
        listDepartments(),
      ]);
      setMembers(memberItems);
      setDepartments(departmentItems);
      setCreateValues((current) => ({
        ...current,
        departmentId:
          current.departmentId ||
          departmentItems.find((item) => item.isDefault)?.id ||
          departmentItems[0]?.id ||
          "",
      }));
      setLoadStatus("success");
    } catch {
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = useCallback(() => {
    setEditingMember(null);
    setCreateValues({
      ...emptyCreateValues,
      departmentId:
        departments.find((item) => item.isDefault)?.id ||
        departments[0]?.id ||
        "",
    });
    setDialogOpen(true);
  }, [departments]);

  const openEdit = useCallback((member: OrganizationMember) => {
    if (member.isOwner) {
      return;
    }
    setEditingMember(member);
    setEditRole(member.role as AssignableMemberRole);
    setEditDepartmentId(member.departmentId);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    if (isSubmitting) {
      return;
    }
    setDialogOpen(false);
    setEditingMember(null);
  }, [isSubmitting]);

  const submitCreate = useCallback(async () => {
    if (
      !createValues.email.trim() ||
      !createValues.password ||
      !createValues.role ||
      !createValues.departmentId
    ) {
      push(t.settings.members.errors.required, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const member = await createMember({
        email: createValues.email.trim(),
        password: createValues.password,
        role: createValues.role,
        departmentId: createValues.departmentId,
      });
      setMembers((current) => [...current, member]);
      setDialogOpen(false);
      push(t.settings.members.createSuccess, "success");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === "EMAIL_ALREADY_EXISTS") {
          push(t.settings.members.errors.emailExists, "error");
        } else {
          push(error.message || t.settings.errors.unexpected, "error");
        }
      } else {
        push(t.settings.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [createValues, push, t]);

  const submitEdit = useCallback(async () => {
    if (!editingMember || !editRole || !editDepartmentId) {
      push(t.settings.members.errors.required, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const member = await updateMember(editingMember.id, {
        role: editRole,
        departmentId: editDepartmentId,
      });
      setMembers((current) =>
        current.map((item) => (item.id === member.id ? member : item)),
      );
      setDialogOpen(false);
      setEditingMember(null);
      push(t.settings.members.updateSuccess, "success");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        push(error.message || t.settings.errors.unexpected, "error");
      } else {
        push(t.settings.errors.unexpected, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editDepartmentId, editRole, editingMember, push, t]);

  const toggleStatus = useCallback(
    async (member: OrganizationMember) => {
      if (member.isOwner || member.id === user?.id) {
        return;
      }

      const nextStatus: MemberStatus =
        member.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      setStatusUpdatingId(member.id);
      try {
        const updated = await updateMember(member.id, { status: nextStatus });
        setMembers((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        push(
          nextStatus === "SUSPENDED"
            ? t.settings.members.suspendSuccess
            : t.settings.members.activateSuccess,
          "success",
        );
      } catch (error) {
        if (error instanceof ApiRequestError) {
          push(error.message || t.settings.errors.unexpected, "error");
        } else {
          push(t.settings.errors.unexpected, "error");
        }
      } finally {
        setStatusUpdatingId(null);
      }
    },
    [push, t, user?.id],
  );

  const openDepartmentDialog = useCallback(() => {
    setNewDepartmentName("");
    setDepartmentDialogOpen(true);
  }, []);

  const closeDepartmentDialog = useCallback(() => {
    if (isCreatingDepartment) {
      return;
    }
    setDepartmentDialogOpen(false);
  }, [isCreatingDepartment]);

  const submitDepartment = useCallback(async () => {
    const name = newDepartmentName.trim();
    if (!name) {
      push(t.settings.members.errors.required, "error");
      return;
    }

    setIsCreatingDepartment(true);
    try {
      const department = await createDepartment({ name });
      setDepartments((current) =>
        [...current, department].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setCreateValues((current) => ({
        ...current,
        departmentId: department.id,
      }));
      setEditDepartmentId(department.id);
      setDepartmentDialogOpen(false);
      push(t.settings.members.departmentCreateSuccess, "success");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === "DEPARTMENT_NAME_EXISTS") {
          push(t.settings.members.errors.departmentExists, "error");
        } else {
          push(error.message || t.settings.errors.unexpected, "error");
        }
      } else {
        push(t.settings.errors.unexpected, "error");
      }
    } finally {
      setIsCreatingDepartment(false);
    }
  }, [newDepartmentName, push, t]);

  return {
    members,
    departments,
    loadStatus,
    dialogOpen,
    departmentDialogOpen,
    newDepartmentName,
    setNewDepartmentName,
    editingMember,
    createValues,
    setCreateValues,
    editRole,
    setEditRole,
    editDepartmentId,
    setEditDepartmentId,
    isSubmitting,
    isCreatingDepartment,
    statusUpdatingId,
    currentUserId: user?.id,
    openCreate,
    openEdit,
    closeDialog,
    openDepartmentDialog,
    closeDepartmentDialog,
    submitCreate,
    submitEdit,
    submitDepartment,
    toggleStatus,
    retry: load,
  };
}
