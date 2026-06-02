"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { countries, languages, OTHER_LANGUAGE_VALUE } from "../lib/data";
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
  title: string;
}[] = [
  {
    accept: ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
    name: "passportCopy",
    title: "صورة من جواز السفر",
  },
  {
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    multiple: true,
    name: "personalPhotos",
    title: "عدد 2 صور شخصية",
  },
  {
    accept: ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
    name: "signatureImage",
    title: "صورة توقيع المرشح",
  },
  {
    accept: ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
    name: "endorsementFile",
    title: "مصادقة الجهة المرشحة",
  },
];

export default function Home() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [files, setFiles] = useState<FileState>(emptyFiles);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState("");
  const [isReady, setIsReady] = useState(false);

  const normalizedCompletion = useMemo(() => {
    const textTotal = values.nativeLanguage === OTHER_LANGUAGE_VALUE ? 15 : 14;
    const textDone = Object.entries(values).filter(([key, value]) => {
      if (key === "otherLanguage" && values.nativeLanguage !== OTHER_LANGUAGE_VALUE) return false;
      return value.trim().length > 0;
    }).length;
    const filesDone = Object.values(files).filter((entry) => entry.length > 0).length;
    return Math.round(((textDone + filesDone) / (textTotal + 4)) * 100);
  }, [files, values]);

  function updateValue(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setIsReady(false);
  }

  function updateFile(name: FileFieldName, event: ChangeEvent<HTMLInputElement>) {
    setFiles((current) => ({ ...current, [name]: Array.from(event.target.files ?? []) }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setIsReady(false);
  }

  function normalizeField(name: keyof FormValues) {
    const normalized = normalizeValues(values);
    setValues((current) => ({ ...current, [name]: normalized[name] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeValues(values);
    setValues(normalized);

    const nextErrors = {
      ...validateValues(normalized),
      ...(await validateFiles(files)),
    };

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("يرجى تصحيح الحقول المحددة قبل الإرسال.");
      setIsReady(false);
      requestAnimationFrame(() => {
        const firstError = document.querySelector("[data-error='true'] input, [data-error='true'] select") as HTMLElement | null;
        firstError?.focus();
      });
      return;
    }

    const payload = {
      ...normalized,
      files: Object.fromEntries(
        Object.entries(files).map(([name, currentFiles]) => [
          name,
          currentFiles.map((file) => ({ name: file.name, size: file.size, type: file.type })),
        ])
      ),
    };

    window.dispatchEvent(new CustomEvent("quran-competition-form:ready", { detail: payload }));
    console.info("Quran competition payload", payload);
    setStatus("تم التحقق من البيانات وتجهيز الطلب للإرسال.");
    setIsReady(true);
  }

  return (
    <main className="page-shell">
      <section className="form-hero" aria-labelledby="page-title">
        <div className="hero-text">
          <p>نموذج تسجيل رسمي</p>
          <h1 id="page-title">المسابقة العالمية الثانية والثلاثون للقران الكريم 1447هـ</h1>
          <span>يرجى استكمال البيانات المطلوبة ورفع المستندات.</span>
        </div>
        <div className="hero-progress" aria-label="نسبة اكتمال الطلب">
          <strong>{normalizedCompletion}%</strong>
          <small>اكتمال الطلب</small>
          <div>
            <span style={{ width: `${normalizedCompletion}%` }} />
          </div>
        </div>
      </section>

      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        <FormSection title="بيانات المتسابق الأساسية">
          <div className="field-row">
            <TextField
              error={errors.arabicName}
              label="الاسم باللغة العربية طبقًا لجواز السفر"
              name="arabicName"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="مثال: محمد أحمد علي"
              value={values.arabicName}
            />
            <TextField
              dir="ltr"
              error={errors.latinName}
              label="الاسم باللغة الإنجليزية أو الفرنسية"
              name="latinName"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="Example: Mohamed Ahmed / Jean-Pierre"
              value={values.latinName}
            />
          </div>

          <div className="field-row">
            <SelectField
              error={errors.nationality}
              label="الجنسية"
              name="nationality"
              onChange={updateValue}
              options={countries}
              placeholder="اختر الجنسية"
              value={values.nationality}
            />
            <TextField
              error={errors.occupation}
              label="المهنة"
              name="occupation"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="مثال: إمام وخطيب / Teacher"
              value={values.occupation}
            />
          </div>

          <div className="field-row">
            <TextField
              error={errors.education}
              label="المؤهل التعليمي"
              name="education"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="مثال: ليسانس دراسات إسلامية"
              value={values.education}
            />
            <TextField
              error={errors.dateOfBirth}
              label="تاريخ الميلاد"
              name="dateOfBirth"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="اختر تاريخ الميلاد"
              type="date"
              value={values.dateOfBirth}
            />
          </div>
        </FormSection>

        <FormSection title="بيانات جواز السفر والإقامة">
          <div className="field-row">
            <TextField
              dir="ltr"
              error={errors.passportNumber}
              label="رقم جواز السفر"
              name="passportNumber"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="مثال: A1234567"
              value={values.passportNumber}
            />
            <TextField
              error={errors.passportIssuePlace}
              label="جهة صدور جواز السفر"
              name="passportIssuePlace"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="مثال: مصلحة الجوازات - القاهرة"
              value={values.passportIssuePlace}
            />
          </div>

          <div className="field-row">
            <SelectField
              error={errors.residenceCountry}
              label="دولة الإقامة"
              name="residenceCountry"
              onChange={updateValue}
              options={countries}
              placeholder="اختر دولة الإقامة"
              value={values.residenceCountry}
            />
            <SelectField
              error={errors.nativeLanguage}
              label="اللغة الأصلية"
              name="nativeLanguage"
              onChange={updateValue}
              options={languages}
              placeholder="اختر اللغة الأصلية"
              value={values.nativeLanguage}
            />
          </div>

          <div className="field-row">
            <TextField
              error={errors.otherLanguage}
              label="اسم اللغة عند اختيار Other"
              name="otherLanguage"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="اكتب اسم اللغة"
              value={values.otherLanguage}
            />
            <TextField
              dir="ltr"
              error={errors.flightRoute}
              label="أقرب خط سير جوي إلى مطار القاهرة الدولي"
              name="flightRoute"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="أدخل خط السير الجوي"
              value={values.flightRoute}
            />
          </div>
        </FormSection>

        <FormSection title="بيانات التواصل والترشيح">
          <div className="field-row">
            <TextField
              dir="ltr"
              error={errors.email}
              label="البريد الإلكتروني"
              name="email"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="name@example.com"
              type="email"
              value={values.email}
            />
            <TextField
              error={errors.nominatingEntity}
              label="الجهة المرشحة"
              name="nominatingEntity"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="مثال: وزارة الأوقاف"
              value={values.nominatingEntity}
            />
          </div>

          <div className="field-row single-row">
            <TextField
              dir="ltr"
              error={errors.nominatingEntityEmail}
              label="البريد الإلكتروني للجهة المرشحة"
              name="nominatingEntityEmail"
              onBlur={normalizeField}
              onChange={updateValue}
              placeholder="entity@example.org"
              type="email"
              value={values.nominatingEntityEmail}
            />
          </div>
        </FormSection>

        <FormSection title="المرفقات المطلوبة">
          <div className="upload-row">
            {uploadFields.slice(0, 2).map((field) => (
              <UploadField
                key={field.name}
                {...field}
                error={errors[field.name]}
                files={files[field.name]}
                onChange={updateFile}
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
                onChange={updateFile}
              />
            ))}
          </div>
        </FormSection>

        <section className="form-actions">
          <p className={isReady ? "success" : ""}>{status || "بالضغط على إرسال، يقر المتسابق بصحة البيانات ومطابقتها للمستندات الرسمية."}</p>
          <div>
            <button className="secondary-button" type="button">حفظ كمسودة</button>
            <button type="submit">إرسال الطلب</button>
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
  multiple,
  name,
  onChange,
  title,
}: {
  accept: string;
  error?: string;
  files: File[];
  multiple?: boolean;
  name: FileFieldName;
  onChange: (name: FileFieldName, event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
}) {
  return (
    <label className="upload-card" data-error={Boolean(error)}>
      <span>{title}</span>
      <input accept={accept} multiple={multiple} name={name} onChange={(event) => onChange(name, event)} type="file" />
      <span className="dropzone">
        <b>اسحب الملف هنا أو اختر من الجهاز</b>
        <small>{files.length > 0 ? files.map((file) => file.name).join("، ") : "JPG, PNG, PDF حسب نوع الحقل"}</small>
      </span>
      {error && <strong>{error}</strong>}
    </label>
  );
}
