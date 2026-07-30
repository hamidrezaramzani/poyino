import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  FormField,
  Input,
  LoadingButton,
  MultiSelect,
  RichTextEditor,
  Select,
  Textarea,
} from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import {
  CURRENCY_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  WORKPLACE_TYPE_OPTIONS,
} from "../constants";
import { useCreateJobForm } from "../hooks/use-create-job-form";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

export function CreateJobForm() {
  const { t } = useI18n();
  const form = useCreateJobForm();
  const disabled = form.isSubmitting || form.isGenerating;

  const employmentOptions = EMPLOYMENT_TYPE_OPTIONS.map((value) => ({
    value,
    label: t.jobs.create.employmentTypes[value],
  }));

  const workplaceOptions = WORKPLACE_TYPE_OPTIONS.map((value) => ({
    value,
    label: t.jobs.create.workplaceTypes[value],
  }));

  const currencyOptions = CURRENCY_OPTIONS.map((value) => ({
    value,
    label: value,
  }));

  const salaryVisibilityOptions = [
    { value: "visible", label: t.jobs.create.salaryVisibility.visible },
    { value: "hidden", label: t.jobs.create.salaryVisibility.hidden },
  ];

  const templateOptions = form.templates.map((template) => ({
    value: template.id,
    label: template.name,
  }));

  return (
    <>
      <div className="create-job-layout">
        <Card title={t.jobs.create.aiSection}>
          <FormField
            label={t.jobs.create.aiPromptLabel}
            htmlFor="aiPrompt"
            error={form.errors.aiPrompt}
          >
            <Textarea
              id="aiPrompt"
              value={form.values.aiPrompt}
              disabled={disabled}
              error={form.errors.aiPrompt}
              placeholder={t.jobs.create.aiPromptPlaceholder}
              onChange={(event) =>
                form.setFieldValue("aiPrompt", event.target.value)
              }
              onBlur={(event) =>
                form.validateField("aiPrompt", event.target.value)
              }
            />
          </FormField>
          <div className="settings-actions">
            <LoadingButton
              type="button"
              variant="secondary"
              loading={form.isGenerating}
              loadingLabel={t.jobs.create.aiGenerating}
              disabled={form.isSubmitting}
              onClick={() => void form.generate()}
            >
              {t.jobs.create.aiGenerate}
            </LoadingButton>
          </div>
        </Card>

        <Card
          title={t.jobs.create.title}
          description={t.jobs.create.description}
        >
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              void form.submit();
            }}
          >
            <h3 className="settings-section-title">
              {t.jobs.create.templateSection}
            </h3>
            <FormField
              label={t.jobs.create.templateLabel}
              htmlFor="templateId"
            >
              <Select
                id="templateId"
                value={form.values.templateId}
                disabled={disabled || form.templatesStatus === "loading"}
                options={templateOptions}
                placeholder={t.jobs.create.templatePlaceholder}
                onChange={(event) => form.applyTemplate(event.target.value)}
              />
            </FormField>
            {form.templatesStatus === "success" && form.templates.length === 0 ? (
              <p className="create-job-hint">{t.jobs.create.templateEmpty}</p>
            ) : null}

            <Divider />

            <h3 className="settings-section-title">
              {t.jobs.create.basicSection}
            </h3>

            <FormField
              label={t.jobs.create.titleLabel}
              htmlFor="title"
              error={form.errors.title}
              required
            >
              <Input
                id="title"
                value={form.values.title}
                disabled={disabled}
                error={form.errors.title}
                onChange={(event) =>
                  form.setFieldValue("title", event.target.value)
                }
                onBlur={(event) =>
                  form.validateField("title", event.target.value)
                }
              />
            </FormField>

            <div className="create-job-grid">
              <FormField
                label={t.jobs.create.departmentLabel}
                htmlFor="department"
                error={form.errors.department}
              >
                <Input
                  id="department"
                  value={form.values.department}
                  disabled={disabled}
                  error={form.errors.department}
                  placeholder={t.jobs.create.departmentPlaceholder}
                  onChange={(event) =>
                    form.setFieldValue("department", event.target.value)
                  }
                  onBlur={(event) =>
                    form.validateField("department", event.target.value)
                  }
                />
              </FormField>

              <FormField
                label={t.jobs.create.locationLabel}
                htmlFor="location"
                error={form.errors.location}
              >
                <Input
                  id="location"
                  value={form.values.location}
                  disabled={disabled}
                  error={form.errors.location}
                  placeholder={t.jobs.create.locationPlaceholder}
                  onChange={(event) =>
                    form.setFieldValue("location", event.target.value)
                  }
                  onBlur={(event) =>
                    form.validateField("location", event.target.value)
                  }
                />
              </FormField>
            </div>

            <div className="create-job-grid">
              <FormField
                label={t.jobs.create.employmentTypeLabel}
                htmlFor="employmentType"
                error={form.errors.employmentType}
                required
              >
                <Select
                  id="employmentType"
                  value={form.values.employmentType}
                  disabled={disabled}
                  error={form.errors.employmentType}
                  options={employmentOptions}
                  placeholder={t.jobs.create.selectPlaceholder}
                  required
                  onChange={(event) => {
                    const value =
                      event.target.value as typeof form.values.employmentType;
                    form.setFieldValue("employmentType", value);
                    form.validateField("employmentType", value);
                  }}
                  onBlur={() => form.validateField("employmentType")}
                />
              </FormField>

              <FormField
                label={t.jobs.create.workplaceTypeLabel}
                htmlFor="workplaceType"
                error={form.errors.workplaceType}
                required
              >
                <Select
                  id="workplaceType"
                  value={form.values.workplaceType}
                  disabled={disabled}
                  error={form.errors.workplaceType}
                  options={workplaceOptions}
                  placeholder={t.jobs.create.selectPlaceholder}
                  required
                  onChange={(event) => {
                    const value =
                      event.target.value as typeof form.values.workplaceType;
                    form.setFieldValue("workplaceType", value);
                    form.validateField("workplaceType", value);
                  }}
                  onBlur={() => form.validateField("workplaceType")}
                />
              </FormField>
            </div>

            <h3 className="settings-section-title">
              {t.jobs.create.salarySection}
            </h3>

            <div className="create-job-grid">
              <FormField
                label={t.jobs.create.salaryMinLabel}
                htmlFor="salaryMin"
                error={form.errors.salaryMin}
              >
                <Input
                  id="salaryMin"
                  type="number"
                  min={0}
                  value={form.values.salaryMin}
                  disabled={disabled}
                  error={form.errors.salaryMin}
                  onChange={(event) =>
                    form.setFieldValue("salaryMin", event.target.value)
                  }
                  onBlur={(event) =>
                    form.validateField("salaryMin", event.target.value)
                  }
                />
              </FormField>

              <FormField
                label={t.jobs.create.salaryMaxLabel}
                htmlFor="salaryMax"
                error={form.errors.salaryMax}
              >
                <Input
                  id="salaryMax"
                  type="number"
                  min={0}
                  value={form.values.salaryMax}
                  disabled={disabled}
                  error={form.errors.salaryMax}
                  onChange={(event) =>
                    form.setFieldValue("salaryMax", event.target.value)
                  }
                  onBlur={(event) =>
                    form.validateField("salaryMax", event.target.value)
                  }
                />
              </FormField>
            </div>

            <div className="create-job-grid">
              <FormField
                label={t.jobs.create.currencyLabel}
                htmlFor="currency"
                error={form.errors.currency}
              >
                <Select
                  id="currency"
                  value={form.values.currency}
                  disabled={disabled}
                  error={form.errors.currency}
                  options={currencyOptions}
                  onChange={(event) => {
                    form.setFieldValue("currency", event.target.value);
                    form.validateField("currency", event.target.value);
                  }}
                  onBlur={() => form.validateField("currency")}
                />
              </FormField>

              <FormField
                label={t.jobs.create.salaryVisibilityLabel}
                htmlFor="salaryVisible"
                error={form.errors.salaryVisible}
                required
              >
                <Select
                  id="salaryVisible"
                  value={form.values.salaryVisible}
                  disabled={disabled}
                  error={form.errors.salaryVisible}
                  options={salaryVisibilityOptions}
                  onChange={(event) => {
                    const value = event.target.value as "visible" | "hidden";
                    form.setFieldValue("salaryVisible", value);
                    form.validateField("salaryVisible", value);
                  }}
                  onBlur={() => form.validateField("salaryVisible")}
                />
              </FormField>
            </div>

            <h3 className="settings-section-title">
              {t.jobs.create.descriptionSection}
            </h3>

            <FormField
              label={t.jobs.create.descriptionLabel}
              htmlFor="description"
              error={form.errors.description}
              required
            >
              <RichTextEditor
                id="description"
                value={form.values.description}
                disabled={disabled}
                error={form.errors.description}
                onChange={(value) => form.setFieldValue("description", value)}
                onBlur={() => form.validateField("description")}
              />
            </FormField>

            <FormField
              label={t.jobs.create.responsibilitiesLabel}
              htmlFor="responsibilities"
              error={form.errors.responsibilities}
            >
              <RichTextEditor
                id="responsibilities"
                value={form.values.responsibilities}
                disabled={disabled}
                error={form.errors.responsibilities}
                onChange={(value) =>
                  form.setFieldValue("responsibilities", value)
                }
                onBlur={() => form.validateField("responsibilities")}
              />
            </FormField>

            <FormField
              label={t.jobs.create.requirementsLabel}
              htmlFor="requirements"
              error={form.errors.requirements}
            >
              <RichTextEditor
                id="requirements"
                value={form.values.requirements}
                disabled={disabled}
                error={form.errors.requirements}
                onChange={(value) => form.setFieldValue("requirements", value)}
                onBlur={() => form.validateField("requirements")}
              />
            </FormField>

            <FormField
              label={t.jobs.create.benefitsLabel}
              htmlFor="benefits"
              error={form.errors.benefits}
            >
              <RichTextEditor
                id="benefits"
                value={form.values.benefits}
                disabled={disabled}
                error={form.errors.benefits}
                onChange={(value) => form.setFieldValue("benefits", value)}
                onBlur={() => form.validateField("benefits")}
              />
            </FormField>

            <h3 className="settings-section-title">
              {t.jobs.create.skillsSection}
            </h3>

            <FormField
              label={t.jobs.create.skillsLabel}
              htmlFor="skills"
              error={form.errors.skills}
            >
              <MultiSelect
                id="skills"
                values={form.values.skills}
                disabled={disabled}
                error={form.errors.skills}
                placeholder={t.jobs.create.skillsPlaceholder}
                addLabel={t.jobs.create.skillsAdd}
                onChange={(values) => form.setFieldValue("skills", values)}
                onBlur={() => form.validateField("skills")}
              />
            </FormField>

            <h3 className="settings-section-title">
              {t.jobs.create.hiringSection}
            </h3>

            <div className="create-job-grid">
              <FormField
                label={t.jobs.create.positionsLabel}
                htmlFor="positions"
                error={form.errors.positions}
                required
              >
                <Input
                  id="positions"
                  type="number"
                  min={1}
                  max={999}
                  value={form.values.positions}
                  disabled={disabled}
                  error={form.errors.positions}
                  onChange={(event) =>
                    form.setFieldValue("positions", event.target.value)
                  }
                  onBlur={(event) =>
                    form.validateField("positions", event.target.value)
                  }
                />
              </FormField>

              <FormField
                label={t.jobs.create.expirationDateLabel}
                htmlFor="expirationDate"
                error={form.errors.expirationDate}
              >
                <DatePicker
                  id="expirationDate"
                  value={form.values.expirationDate}
                  disabled={disabled}
                  error={form.errors.expirationDate}
                  onChange={(value) => {
                    form.setFieldValue("expirationDate", value);
                    form.validateField("expirationDate", value);
                  }}
                  onBlur={() => form.validateField("expirationDate")}
                />
              </FormField>
            </div>

            <div className="settings-actions">
              <Button
                type="button"
                variant="secondary"
                disabled={form.isSubmitting}
                onClick={form.cancel}
              >
                {t.jobs.create.cancel}
              </Button>
              <LoadingButton
                type="submit"
                loading={form.isSubmitting}
                loadingLabel={t.jobs.create.saving}
                disabled={form.isGenerating}
              >
                {t.jobs.create.saveDraft}
              </LoadingButton>
            </div>
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
