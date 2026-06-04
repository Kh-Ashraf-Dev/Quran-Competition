"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ApplicationApiError, submitApplication } from "../lib/api";
import { countries, languages } from "../lib/data";
import { Locale, localeCodes, localeMeta, translations } from "../lib/i18n";
import {
  FieldErrors,
  FileFieldName,
  FileState,
  FormValues,
  initialValues,
  normalizeValues,
  validateFiles,
  validateValues,
} from "../lib/validation";

const emptyFiles: FileState = {
  passportCopy: [],
  personalPhotos: [],
  signatureImage: [],
  endorsementFile: [],
};

const uploadFields: {
  accept: string;
  multiple?: boolean;
  name: FileFieldName;
}[] = [
    {
      accept: ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
      name: "passportCopy",
    },
    {
      accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
      multiple: true,
      name: "personalPhotos",
    },
    {
      accept: ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
      name: "signatureImage",
    },
    {
      accept: ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
      name: "endorsementFile",
    },
  ];

type StatusKey = "" | "failed" | "invalid" | "ready" | "submitted" | "submitting";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [files, setFiles] = useState<FileState>(emptyFiles);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<StatusKey>("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const t = translations[locale];
  const meta = localeMeta[locale];
  const countryOptions = useMemo(() => getCountryOptions(locale), [locale]);
  const nativeLanguageOptions = useMemo(() => getNativeLanguageOptions(locale), [locale]);
  const statusMessage = status === "failed" && apiError ? apiError : status ? t.status[status] : "";

  useEffect(() => {
    document.documentElement.lang = meta.lang;
    document.documentElement.dir = meta.dir;
  }, [meta.dir, meta.lang]);

  function updateValue(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setApiError("");
    setStatus("");
    setIsReady(false);
  }

  function updateFile(name: FileFieldName, event: ChangeEvent<HTMLInputElement>) {
    setFiles((current) => ({ ...current, [name]: Array.from(event.target.files ?? []) }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setApiError("");
    setStatus("");
    setIsReady(false);
  }

  function normalizeField(name: keyof FormValues) {
    const normalized = normalizeValues(values);
    setValues((current) => ({ ...current, [name]: normalized[name] }));
  }

  async function updateLocale(nextLocale: Locale) {
    setLocale(nextLocale);

    if (Object.keys(errors).length === 0) return;

    const normalized = normalizeValues(values);
    setErrors({
      ...validateValues(normalized, nextLocale),
      ...(await validateFiles(files, nextLocale)),
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeValues(values);
    setValues(normalized);
    setApiError("");
    setStatus("");

    const nextErrors = {
      ...validateValues(normalized, locale),
      ...(await validateFiles(files, locale)),
    };

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("invalid");
      setIsReady(false);
      requestAnimationFrame(() => {
        const firstError = document.querySelector("[data-error='true'] input, [data-error='true'] select") as HTMLElement | null;
        firstError?.focus();
      });
      return;
    }

    setStatus("submitting");
    setIsSubmitting(true);

    try {
      const result = await submitApplication(normalized, files, locale, {
        nationality: getOptionLabel(countries, normalized.nationality, locale),
        nativeLanguage: getOptionLabel(languages, normalized.nativeLanguage, locale),
        residenceCountry: getOptionLabel(countries, normalized.residenceCountry, locale),
      });

      window.dispatchEvent(new CustomEvent("quran-competition-form:submitted", { detail: result }));
      console.info("Quran competition application submitted", result);
      setStatus("submitted");
      setIsReady(true);
    } catch (error) {
      const message = error instanceof ApplicationApiError
        ? [error.message, ...error.errors].filter(Boolean).join(" ")
        : t.status.failed;

      setApiError(message);
      setStatus("failed");
      setIsReady(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell" data-locale={locale} dir={meta.dir} lang={meta.lang}>
      <section className="form-hero" aria-labelledby="page-title">
        <div className="hero-text">
          <p>{t.hero.badge}</p>
          <h1 id="page-title">{t.hero.title}</h1>
          <span>{t.hero.subtitle}</span>
          <LanguageSelector locale={locale} onChange={updateLocale} />
        </div>
        <img className="hero-logo" src="/image.png" alt={t.hero.logoAlt} width={224} height={218} />
      </section>

      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        <FormSection title={t.sections.personal}>
          <div className="field-row">
            <TextField
              error={errors.arabicName}
              label={t.fields.arabicName.label}
              name="arabicName"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.arabicName.placeholder}
              value={values.arabicName}
            />
            <TextField
              dir="ltr"
              error={errors.latinName}
              label={t.fields.latinName.label}
              name="latinName"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.latinName.placeholder}
              value={values.latinName}
            />
          </div>

          <div className="field-row">
            <SelectField
              error={errors.nationality}
              label={t.fields.nationality.label}
              name="nationality"
              onChange={updateValue}
              options={countryOptions}
              placeholder={t.fields.nationality.placeholder}
              value={values.nationality}
            />
            <TextField
              error={errors.occupation}
              label={t.fields.occupation.label}
              name="occupation"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.occupation.placeholder}
              value={values.occupation}
            />
          </div>

          <div className="field-row">
            <TextField
              error={errors.education}
              label={t.fields.education.label}
              name="education"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.education.placeholder}
              value={values.education}
            />
            <TextField
              error={errors.dateOfBirth}
              label={t.fields.dateOfBirth.label}
              name="dateOfBirth"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.dateOfBirth.placeholder}
              type="date"
              value={values.dateOfBirth}
            />
          </div>
        </FormSection>

        <FormSection title={t.sections.passport}>
          <div className="field-row">
            <TextField
              dir="ltr"
              error={errors.passportNumber}
              label={t.fields.passportNumber.label}
              name="passportNumber"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.passportNumber.placeholder}
              value={values.passportNumber}
            />
            <TextField
              error={errors.passportIssuePlace}
              label={t.fields.passportIssuePlace.label}
              name="passportIssuePlace"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.passportIssuePlace.placeholder}
              value={values.passportIssuePlace}
            />
          </div>

          <div className="field-row">
            <SelectField
              error={errors.residenceCountry}
              label={t.fields.residenceCountry.label}
              name="residenceCountry"
              onChange={updateValue}
              options={countryOptions}
              placeholder={t.fields.residenceCountry.placeholder}
              value={values.residenceCountry}
            />
            <SelectField
              error={errors.nativeLanguage}
              label={t.fields.nativeLanguage.label}
              name="nativeLanguage"
              onChange={updateValue}
              options={nativeLanguageOptions}
              placeholder={t.fields.nativeLanguage.placeholder}
              value={values.nativeLanguage}
            />
          </div>

          <div className="field-row">
            <TextField
              error={errors.otherLanguage}
              label={t.fields.otherLanguage.label}
              name="otherLanguage"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.otherLanguage.placeholder}
              value={values.otherLanguage}
            />
            <TextField
              dir="ltr"
              error={errors.flightRoute}
              label={t.fields.flightRoute.label}
              name="flightRoute"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.flightRoute.placeholder}
              value={values.flightRoute}
            />
          </div>
        </FormSection>

        <FormSection title={t.sections.contact}>
          <div className="field-row">
            <TextField
              dir="ltr"
              error={errors.email}
              label={t.fields.email.label}
              name="email"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.email.placeholder}
              type="email"
              value={values.email}
            />
            <TextField
              error={errors.nominatingEntity}
              label={t.fields.nominatingEntity.label}
              name="nominatingEntity"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.nominatingEntity.placeholder}
              value={values.nominatingEntity}
            />
          </div>

          <div className="field-row single-row">
            <TextField
              dir="ltr"
              error={errors.nominatingEntityEmail}
              label={t.fields.nominatingEntityEmail.label}
              name="nominatingEntityEmail"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder={t.fields.nominatingEntityEmail.placeholder}
              type="email"
              value={values.nominatingEntityEmail}
            />
          </div>
        </FormSection>

        <FormSection title={t.sections.uploads}>
          <div className="upload-row">
            {uploadFields.slice(0, 2).map((field) => (
              <UploadField
                key={field.name}
                {...field}
                error={errors[field.name]}
                files={files[field.name]}
                hint={t.fileHint}
                onChange={updateFile}
                title={t.uploads[field.name]}
                uploadCta={t.uploadCta}
              />
            ))}
          </div>
          <div className="upload-row">
            {uploadFields.slice(2).map((field) => (
              <UploadField
                key={field.name}
                {...field}
                error={errors[field.name]}
                files={files[field.name]}
                hint={t.fileHint}
                onChange={updateFile}
                title={t.uploads[field.name]}
                uploadCta={t.uploadCta}
              />
            ))}
          </div>
        </FormSection>

        <section className="form-actions">
          <p className={isReady ? "success" : ""}>{statusMessage || t.form.consent}</p>
          <div>
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? t.actions.submitting : t.actions.submit}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}

function FormSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="form-section">
      <header>
        <h2>{title}</h2>
      </header>
      <div className="section-body">{children}</div>
    </section>
  );
}

function LanguageSelector({ locale, onChange }: { locale: Locale; onChange: (locale: Locale) => void }) {
  const t = translations[locale];

  return (
    <div className="language-selector" aria-label={t.language.label}>
      <span>{t.language.label}</span>
      <div role="group">
        {localeCodes.map((code) => (
          <button
            aria-pressed={locale === code}
            className={locale === code ? "active" : ""}
            key={code}
            onClick={() => onChange(code)}
            type="button"
          >
            {t.language.options[code]}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextField({
  dir,
  error,
  label,
  name,
  onBlur,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  dir?: "ltr" | "rtl";
  error?: string;
  label: string;
  name: keyof FormValues;
  onBlur: (name: keyof FormValues) => void;
  onChange: (name: keyof FormValues, value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="field-card" data-error={Boolean(error)}>
      <span>{label}</span>
      <input
        dir={dir}
        name={name}
        onBlur={() => onBlur(name)}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error && <strong>{error}</strong>}
    </label>
  );
}

function SelectField({
  error,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
}: {
  error?: string;
  label: string;
  name: keyof FormValues;
  onChange: (name: keyof FormValues, value: string) => void;
  options: readonly (readonly [string, string])[];
  placeholder: string;
  value: string;
}) {
  return (
    <label className="field-card" data-error={Boolean(error)}>
      <span>{label}</span>
      <select name={name} onChange={(event) => onChange(name, event.target.value)} value={value}>
        <option value="">{placeholder}</option>
        {options.map(([code, labelText]) => (
          <option key={code} value={code}>
            {labelText}
          </option>
        ))}
      </select>
      {error && <strong>{error}</strong>}
    </label>
  );
}

function UploadField({
  accept,
  error,
  files,
  hint,
  multiple,
  name,
  onChange,
  title,
  uploadCta,
}: {
  accept: string;
  error?: string;
  files: File[];
  hint: string;
  multiple?: boolean;
  name: FileFieldName;
  onChange: (name: FileFieldName, event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  uploadCta: string;
}) {
  return (
    <label className="upload-card" data-error={Boolean(error)}>
      <span>{title}</span>
      <input accept={accept} multiple={multiple} name={name} onChange={(event) => onChange(name, event)} type="file" />
      <span className="dropzone">
        <b>{uploadCta}</b>
        <small>{files.length > 0 ? files.map((file) => file.name).join("، ") : hint}</small>
      </span>
      {error && <strong>{error}</strong>}
    </label>
  );
}

function getCountryOptions(locale: Locale) {
  return getLocalizedOptions(countries, locale);
}

function getNativeLanguageOptions(locale: Locale) {
  return getLocalizedOptions(languages, locale);
}

function getLocalizedOptions(
  options: readonly (readonly [string, { ar: string; en: string; fr: string }])[],
  locale: Locale
) {
  const collator = new Intl.Collator(localeMeta[locale].countryLocale);

  return [...options.map(([code, labels]) => [code, labels[locale]] as const)].sort(([, first], [, second]) =>
    collator.compare(first, second)
  );
}

function getOptionLabel(
  options: readonly (readonly [string, { ar: string; en: string; fr: string }])[],
  code: string,
  locale: Locale
) {
  return options.find(([optionCode]) => optionCode === code)?.[1][locale] ?? code;
}
