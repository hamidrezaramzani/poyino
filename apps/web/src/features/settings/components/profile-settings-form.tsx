import {
  Button,
  Card,
  Form,
  FormField,
  ImageUpload,
  Input,
  LoadingButton,
  PasswordInput,
  Skeleton,
  Textarea,
} from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useChangePasswordForm } from "../hooks/use-change-password-form";
import { useProfileSettingsForm } from "../hooks/use-profile-settings-form";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

export function ProfileSettingsForm() {
  const { t } = useI18n();
  const form = useProfileSettingsForm();
  const passwordForm = useChangePasswordForm();

  if (form.loadStatus === "loading") {
    return (
      <Card title={t.settings.profile.title}>
        <Skeleton height={96} width={96} />
        <Skeleton height={44} style={{ marginTop: "1rem" }} />
        <Skeleton height={44} style={{ marginTop: "1rem" }} />
      </Card>
    );
  }

  if (form.loadStatus === "error") {
    return (
      <Card title={t.settings.profile.title}>
        <p>{t.settings.errors.loadFailed}</p>
        <Button type="button" onClick={() => void form.retry()}>
          {t.settings.retry}
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={t.settings.profile.title}
        description={t.settings.profile.description}
      >
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
        >
          <h3 className="settings-section-title">
            {t.settings.profile.identitySection}
          </h3>

          <ImageUpload
            id="profile-logo"
            label={t.settings.profile.logo}
            previewUrl={form.logoPreviewUrl}
            uploading={form.isUploading}
            disabled={form.isSubmitting}
            error={form.errors.logoId}
            emptyLabel={t.settings.profile.logoEmpty}
            uploadLabel={t.settings.profile.uploadLogo}
            removeLabel={t.settings.profile.removeLogo}
            onSelect={(file) => void form.uploadLogo(file)}
            onRemove={form.removeLogo}
          />

          <FormField
            label={t.settings.profile.organizationName}
            htmlFor="profile-organizationName"
            error={form.errors.organizationName}
            required
          >
            <Input
              id="profile-organizationName"
              value={form.values.organizationName}
              disabled={form.isSubmitting}
              error={form.errors.organizationName}
              onChange={(event) =>
                form.setFieldValue("organizationName", event.target.value)
              }
            />
          </FormField>

          <h3 className="settings-section-title">
            {t.settings.profile.contactSection}
          </h3>

          <FormField
            label={t.settings.profile.email}
            htmlFor="profile-email"
            error={form.errors.email}
            required
          >
            <Input
              id="profile-email"
              type="email"
              value={form.values.email}
              disabled={form.isSubmitting}
              error={form.errors.email}
              onChange={(event) => form.setFieldValue("email", event.target.value)}
            />
          </FormField>

          <FormField
            label={t.settings.profile.phone}
            htmlFor="profile-phone"
            error={form.errors.phone}
          >
            <Input
              id="profile-phone"
              value={form.values.phone}
              disabled={form.isSubmitting}
              error={form.errors.phone}
              onChange={(event) => form.setFieldValue("phone", event.target.value)}
            />
          </FormField>

          <FormField
            label={t.settings.profile.website}
            htmlFor="profile-website"
            error={form.errors.website}
          >
            <Input
              id="profile-website"
              value={form.values.website}
              disabled={form.isSubmitting}
              error={form.errors.website}
              placeholder="https://"
              onChange={(event) =>
                form.setFieldValue("website", event.target.value)
              }
            />
          </FormField>

          <FormField
            label={t.settings.profile.address}
            htmlFor="profile-address"
            error={form.errors.address}
          >
            <Textarea
              id="profile-address"
              value={form.values.address}
              disabled={form.isSubmitting}
              error={form.errors.address}
              onChange={(event) =>
                form.setFieldValue("address", event.target.value)
              }
            />
          </FormField>

          <div className="settings-actions">
            <Button
              type="button"
              variant="secondary"
              disabled={!form.isDirty || form.isSubmitting}
              onClick={form.reset}
            >
              {t.settings.reset}
            </Button>
            <LoadingButton
              type="submit"
              loading={form.isSubmitting}
              loadingLabel={t.settings.saving}
              disabled={!form.isDirty}
            >
              {t.settings.save}
            </LoadingButton>
          </div>
        </Form>
      </Card>

      <div style={{ marginTop: "1.25rem" }}>
        <Card
          title={t.settings.changePassword.title}
          description={t.settings.changePassword.description}
        >
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              void passwordForm.submit();
            }}
          >
            <FormField
              label={t.settings.changePassword.currentPassword}
              htmlFor="currentPassword"
              error={passwordForm.errors.currentPassword}
              required
            >
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                value={passwordForm.values.currentPassword}
                disabled={passwordForm.isSubmitting}
                error={passwordForm.errors.currentPassword}
                showLabel={t.login.showPassword}
                hideLabel={t.login.hidePassword}
                onChange={(event) =>
                  passwordForm.setFieldValue("currentPassword", event.target.value)
                }
              />
            </FormField>

            <FormField
              label={t.settings.changePassword.newPassword}
              htmlFor="newPassword"
              error={passwordForm.errors.newPassword}
              required
            >
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                value={passwordForm.values.newPassword}
                disabled={passwordForm.isSubmitting}
                error={passwordForm.errors.newPassword}
                showLabel={t.login.showPassword}
                hideLabel={t.login.hidePassword}
                onChange={(event) =>
                  passwordForm.setFieldValue("newPassword", event.target.value)
                }
              />
            </FormField>

            <FormField
              label={t.settings.changePassword.confirmPassword}
              htmlFor="confirmPassword"
              error={passwordForm.errors.confirmPassword}
              required
            >
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                value={passwordForm.values.confirmPassword}
                disabled={passwordForm.isSubmitting}
                error={passwordForm.errors.confirmPassword}
                showLabel={t.login.showPassword}
                hideLabel={t.login.hidePassword}
                onChange={(event) =>
                  passwordForm.setFieldValue(
                    "confirmPassword",
                    event.target.value,
                  )
                }
              />
            </FormField>

            <LoadingButton
              type="submit"
              loading={passwordForm.isSubmitting}
              loadingLabel={t.settings.saving}
            >
              {t.settings.changePassword.submit}
            </LoadingButton>
          </Form>
        </Card>
      </div>

      <UnsavedChangesDialog
        open={form.unsaved.dialogOpen}
        onCancel={form.unsaved.cancelLeave}
        onConfirm={form.unsaved.confirmLeave}
      />
    </>
  );
}
