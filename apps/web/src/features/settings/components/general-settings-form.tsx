import {
  Button,
  Card,
  Form,
  FormField,
  Input,
  LoadingButton,
  Select,
  Skeleton,
  Textarea,
} from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { COUNTRY_OPTIONS, LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from "../constants";
import { useGeneralSettingsForm } from "../hooks/use-general-settings-form";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

export function GeneralSettingsForm() {
  const { t } = useI18n();
  const form = useGeneralSettingsForm();

  if (form.loadStatus === "loading") {
    return (
      <Card title={t.settings.general.title}>
        <Skeleton height={24} />
        <Skeleton height={44} style={{ marginTop: "1rem" }} />
        <Skeleton height={44} style={{ marginTop: "1rem" }} />
        <Skeleton height={96} style={{ marginTop: "1rem" }} />
      </Card>
    );
  }

  if (form.loadStatus === "error") {
    return (
      <Card title={t.settings.general.title}>
        <p>{t.settings.errors.loadFailed}</p>
        <Button type="button" onClick={() => void form.retry()}>
          {t.settings.retry}
        </Button>
      </Card>
    );
  }

  const countryOptions = COUNTRY_OPTIONS.map((option) => ({
    value: option.value,
    label: t.settings.countries[option.labelKey],
  }));

  const languageOptions = LANGUAGE_OPTIONS.map((option) => ({
    value: option.value,
    label: t.settings.languages[option.labelKey],
  }));

  return (
    <>
      <Card
        title={t.settings.general.title}
        description={t.settings.general.description}
      >
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
        >
          <h3 className="settings-section-title">
            {t.settings.general.organizationSection}
          </h3>

          <FormField
            label={t.settings.general.organizationName}
            htmlFor="organizationName"
            error={form.errors.organizationName}
            required
          >
            <Input
              id="organizationName"
              value={form.values.organizationName}
              disabled={form.isSubmitting}
              error={form.errors.organizationName}
              onChange={(event) =>
                form.setFieldValue("organizationName", event.target.value)
              }
            />
          </FormField>

          <FormField
            label={t.settings.general.displayName}
            htmlFor="displayName"
            error={form.errors.displayName}
          >
            <Input
              id="displayName"
              value={form.values.displayName}
              disabled={form.isSubmitting}
              error={form.errors.displayName}
              onChange={(event) =>
                form.setFieldValue("displayName", event.target.value)
              }
            />
          </FormField>

          <FormField
            label={t.settings.general.descriptionLabel}
            htmlFor="description"
            error={form.errors.description}
          >
            <Textarea
              id="description"
              value={form.values.description}
              disabled={form.isSubmitting}
              error={form.errors.description}
              onChange={(event) =>
                form.setFieldValue("description", event.target.value)
              }
            />
          </FormField>

          <h3 className="settings-section-title">
            {t.settings.general.contactSection}
          </h3>

          <FormField
            label={t.settings.general.email}
            htmlFor="email"
            error={form.errors.email}
            required
          >
            <Input
              id="email"
              type="email"
              value={form.values.email}
              disabled={form.isSubmitting}
              error={form.errors.email}
              onChange={(event) => form.setFieldValue("email", event.target.value)}
            />
          </FormField>

          <FormField
            label={t.settings.general.phone}
            htmlFor="phone"
            error={form.errors.phone}
          >
            <Input
              id="phone"
              value={form.values.phone}
              disabled={form.isSubmitting}
              error={form.errors.phone}
              onChange={(event) => form.setFieldValue("phone", event.target.value)}
            />
          </FormField>

          <FormField
            label={t.settings.general.website}
            htmlFor="website"
            error={form.errors.website}
          >
            <Input
              id="website"
              value={form.values.website}
              disabled={form.isSubmitting}
              error={form.errors.website}
              placeholder="https://"
              onChange={(event) =>
                form.setFieldValue("website", event.target.value)
              }
            />
          </FormField>

          <h3 className="settings-section-title">
            {t.settings.general.locationSection}
          </h3>

          <FormField
            label={t.settings.general.country}
            htmlFor="country"
            error={form.errors.country}
          >
            <Select
              id="country"
              value={form.values.country}
              disabled={form.isSubmitting}
              error={form.errors.country}
              options={countryOptions}
              placeholder={t.settings.general.countryPlaceholder}
              onChange={(event) =>
                form.setFieldValue("country", event.target.value)
              }
            />
          </FormField>

          <FormField
            label={t.settings.general.city}
            htmlFor="city"
            error={form.errors.city}
          >
            <Input
              id="city"
              value={form.values.city}
              disabled={form.isSubmitting}
              error={form.errors.city}
              onChange={(event) => form.setFieldValue("city", event.target.value)}
            />
          </FormField>

          <FormField
            label={t.settings.general.timezone}
            htmlFor="timezone"
            error={form.errors.timezone}
            required
          >
            <Select
              id="timezone"
              value={form.values.timezone}
              disabled={form.isSubmitting}
              error={form.errors.timezone}
              options={TIMEZONE_OPTIONS}
              onChange={(event) =>
                form.setFieldValue("timezone", event.target.value)
              }
            />
          </FormField>

          <FormField
            label={t.settings.general.language}
            htmlFor="language"
            error={form.errors.language}
            required
          >
            <Select
              id="language"
              value={form.values.language}
              disabled={form.isSubmitting}
              error={form.errors.language}
              options={languageOptions}
              onChange={(event) =>
                form.setFieldValue("language", event.target.value)
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

      <UnsavedChangesDialog
        open={form.unsaved.dialogOpen}
        onCancel={form.unsaved.cancelLeave}
        onConfirm={form.unsaved.confirmLeave}
      />
    </>
  );
}
