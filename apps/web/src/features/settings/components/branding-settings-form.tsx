import {
  Button,
  Card,
  ColorPicker,
  Form,
  FormField,
  ImageUpload,
  LoadingButton,
  Skeleton,
} from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useBrandingSettingsForm } from "../hooks/use-branding-settings-form";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

export function BrandingSettingsForm() {
  const { t } = useI18n();
  const form = useBrandingSettingsForm();

  if (form.loadStatus === "loading") {
    return (
      <Card title={t.settings.branding.title}>
        <Skeleton height={96} width={96} />
        <Skeleton height={44} style={{ marginTop: "1rem" }} />
      </Card>
    );
  }

  if (form.loadStatus === "error") {
    return (
      <Card title={t.settings.branding.title}>
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
        title={t.settings.branding.title}
        description={t.settings.branding.description}
      >
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
        >
          <h3 className="settings-section-title">
            {t.settings.branding.logoSection}
          </h3>

          <ImageUpload
            id="branding-logo"
            label={t.settings.branding.primaryLogo}
            previewUrl={form.logoPreviewUrl}
            uploading={form.uploadingField === "logoId"}
            disabled={form.isSubmitting}
            error={form.errors.logoId}
            emptyLabel={t.settings.branding.logoEmpty}
            uploadLabel={t.settings.branding.uploadLogo}
            removeLabel={t.settings.branding.removeLogo}
            onSelect={(file) => void form.uploadLogo("logoId", file)}
            onRemove={() => form.removeLogo("logoId")}
          />

          <ImageUpload
            id="branding-dark-logo"
            label={t.settings.branding.darkLogo}
            previewUrl={form.darkLogoPreviewUrl}
            uploading={form.uploadingField === "darkLogoId"}
            disabled={form.isSubmitting}
            error={form.errors.darkLogoId}
            emptyLabel={t.settings.branding.logoEmpty}
            uploadLabel={t.settings.branding.uploadLogo}
            removeLabel={t.settings.branding.removeLogo}
            onSelect={(file) => void form.uploadLogo("darkLogoId", file)}
            onRemove={() => form.removeLogo("darkLogoId")}
          />

          <h3 className="settings-section-title">
            {t.settings.branding.colorsSection}
          </h3>

          <FormField
            label={t.settings.branding.primaryColor}
            htmlFor="primaryColor"
            error={form.errors.primaryColor}
            required
          >
            <ColorPicker
              id="primaryColor"
              value={form.values.primaryColor}
              disabled={form.isSubmitting}
              error={form.errors.primaryColor}
              onChange={(value) => form.setColor("primaryColor", value)}
            />
          </FormField>

          <FormField
            label={t.settings.branding.secondaryColor}
            htmlFor="secondaryColor"
            error={form.errors.secondaryColor}
            required
          >
            <ColorPicker
              id="secondaryColor"
              value={form.values.secondaryColor}
              disabled={form.isSubmitting}
              error={form.errors.secondaryColor}
              onChange={(value) => form.setColor("secondaryColor", value)}
            />
          </FormField>

          <h3 className="settings-section-title">
            {t.settings.branding.previewSection}
          </h3>

          <div
            className="settings-branding-preview"
            style={{
              ["--preview-primary" as string]: form.values.primaryColor,
              ["--preview-secondary" as string]: form.values.secondaryColor,
            }}
          >
            <div className="settings-branding-preview-header">
              {form.logoPreviewUrl ? (
                <img src={form.logoPreviewUrl} alt="" />
              ) : (
                <strong>Poyino</strong>
              )}
              <span>{t.settings.branding.previewHeader}</span>
            </div>
            <div className="settings-branding-preview-card">
              <strong>{t.settings.branding.previewJobTitle}</strong>
              <p>{t.settings.branding.previewJobDescription}</p>
              <button type="button" className="settings-branding-preview-button">
                {t.settings.branding.previewCta}
              </button>
            </div>
          </div>

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

      <UnsavedChangesDialog
        open={form.unsaved.dialogOpen}
        onCancel={form.unsaved.cancelLeave}
        onConfirm={form.unsaved.confirmLeave}
      />
    </>
  );
}
