import { countries, languages, OTHER_LANGUAGE_VALUE } from "./data";
import { Locale, translations } from "./i18n";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type FormValues = {
  arabicName: string;
  latinName: string;
  nationality: string;
  occupation: string;
  education: string;
  dateOfBirth: string;
  passportNumber: string;
  passportIssuePlace: string;
  residenceCountry: string;
  nativeLanguage: string;
  otherLanguage: string;
  email: string;
  nominatingEntity: string;
  nominatingEntityEmail: string;
  flightRoute: string;
};

export type FileFieldName = "passportCopy" | "personalPhotos" | "signatureImage" | "endorsementFile";
export type FieldErrors = Partial<Record<keyof FormValues | FileFieldName, string>>;
export type FileState = Record<FileFieldName, File[]>;

const patterns = {
  arabicName: /^[\u0600-\u06FF]+(?:\s+[\u0600-\u06FF]+)*$/u,
  latinName: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/u,
  mixedText: /^[\u0600-\u06FFA-Za-zÀ-ÖØ-öø-ÿ0-9\s\-\.,\/()]+$/u,
  nominatingEntity: /^[\u0600-\u06FFA-Za-zÀ-ÖØ-öø-ÿ0-9\s\-\.,\/()&]+$/u,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/u,
  passport: /^(?!0+$)[A-Z0-9][A-Z0-9 -]{3,18}[A-Z0-9]$/u,
  route: /^[A-Z]{3}(?:[-/][A-Z]{3}){1,9}$/u,
  otherLanguage: /^\p{L}+(?:[ '\-]\p{L}+)*$/u,
};

export const fileRules: Record<FileFieldName, {
  extensions: string[];
  exactCount: number;
  mimes: string[];
}> = {
  passportCopy: {
    extensions: ["jpg", "jpeg", "png", "pdf"],
    exactCount: 1,
    mimes: ["image/jpeg", "image/png", "application/pdf"],
  },
  personalPhotos: {
    extensions: ["jpg", "jpeg", "png"],
    exactCount: 2,
    mimes: ["image/jpeg", "image/png"],
  },
  signatureImage: {
    extensions: ["jpg", "jpeg", "png", "pdf"],
    exactCount: 1,
    mimes: ["image/jpeg", "image/png", "application/pdf"],
  },
  endorsementFile: {
    extensions: ["jpg", "jpeg", "png", "pdf"],
    exactCount: 1,
    mimes: ["image/jpeg", "image/png", "application/pdf"],
  },
};

const countryCodes = new Set(countries.map(([code]) => code));
const languageCodes = new Set(languages.map(([code]) => code));

export const initialValues: FormValues = {
  arabicName: "",
  latinName: "",
  nationality: "",
  occupation: "",
  education: "",
  dateOfBirth: "",
  passportNumber: "",
  passportIssuePlace: "",
  residenceCountry: "",
  nativeLanguage: "",
  otherLanguage: "",
  email: "",
  nominatingEntity: "",
  nominatingEntityEmail: "",
  flightRoute: "",
};

export function normalizeValues(values: FormValues): FormValues {
  const normalized = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value.trim().replace(/\s+/g, " ")])
  ) as FormValues;

  normalized.passportNumber = normalized.passportNumber.toUpperCase();
  normalized.flightRoute = normalized.flightRoute.toUpperCase();
  normalized.email = normalized.email.toLowerCase();
  normalized.nominatingEntityEmail = normalized.nominatingEntityEmail.toLowerCase();

  return normalized;
}

export function validateValues(values: FormValues, locale: Locale = "ar"): FieldErrors {
  const errors: FieldErrors = {};
  const t = translations[locale].validation;

  requirePattern(errors, "arabicName", values.arabicName, patterns.arabicName, t.arabicName);
  requirePattern(errors, "latinName", values.latinName, patterns.latinName, t.latinName);
  requireSelect(errors, "nationality", values.nationality, countryCodes, t.nationality);
  requireBoundedPattern(errors, "occupation", values.occupation, patterns.mixedText, 2, 100, t.occupation);
  requireBoundedPattern(errors, "education", values.education, patterns.mixedText, 2, 100, t.education);
  validateDateOfBirth(errors, values.dateOfBirth, locale);
  validatePassport(errors, values.passportNumber, locale);
  requireBoundedPattern(errors, "passportIssuePlace", values.passportIssuePlace, patterns.mixedText, 2, 150, t.issuePlace);
  validateIssuePlaceNotNationality(errors, values.passportIssuePlace, values.nationality, locale);
  requireSelect(errors, "residenceCountry", values.residenceCountry, countryCodes, t.residenceCountry);
  requireSelect(errors, "nativeLanguage", values.nativeLanguage, languageCodes, t.nativeLanguage);

  if (values.nativeLanguage === OTHER_LANGUAGE_VALUE) {
    requireBoundedPattern(errors, "otherLanguage", values.otherLanguage, patterns.otherLanguage, 2, 80, t.otherLanguage);
  }

  requirePattern(errors, "email", values.email, patterns.email, t.email);
  requireBoundedPattern(errors, "nominatingEntity", values.nominatingEntity, patterns.nominatingEntity, 2, 150, t.nominatingEntity);
  requirePattern(errors, "nominatingEntityEmail", values.nominatingEntityEmail, patterns.email, t.entityEmail);
  validateFlightRoute(errors, values.flightRoute, locale);

  return errors;
}

export async function validateFiles(files: FileState, locale: Locale = "ar"): Promise<FieldErrors> {
  const errors: FieldErrors = {};
  const t = translations[locale].validation;

  for (const [fieldName, rule] of Object.entries(fileRules) as [FileFieldName, typeof fileRules[FileFieldName]][]) {
    const currentFiles = files[fieldName];
    const fieldLabel = translations[locale].uploads[fieldName];

    if (currentFiles.length !== rule.exactCount) {
      errors[fieldName] = rule.exactCount === 1
        ? t.exactOne(fieldLabel)
        : t.exactMany(rule.exactCount, fieldLabel);
      continue;
    }

    for (const file of currentFiles) {
      const fileError = await validateFile(file, rule, locale);
      if (fileError) {
        errors[fieldName] = fileError;
        break;
      }
    }
  }

  return errors;
}

function requirePattern(errors: FieldErrors, fieldName: keyof FormValues, value: string, pattern: RegExp, message: string) {
  if (!value || !pattern.test(value)) errors[fieldName] = message;
}

function requireSelect(errors: FieldErrors, fieldName: keyof FormValues, value: string, allowedValues: Set<string>, message: string) {
  if (!value || !allowedValues.has(value)) errors[fieldName] = message;
}

function requireBoundedPattern(errors: FieldErrors, fieldName: keyof FormValues, value: string, pattern: RegExp, min: number, max: number, message: string) {
  if (!value || value.length < min || value.length > max || !pattern.test(value)) errors[fieldName] = message;
}

function validateDateOfBirth(errors: FieldErrors, value: string, locale: Locale) {
  const t = translations[locale].validation;

  if (!value) {
    errors.dateOfBirth = t.dateOfBirthRequired;
    return;
  }

  const birthDate = parseDateInput(value);
  const today = startOfDay(new Date());

  if (!birthDate || birthDate > today) {
    errors.dateOfBirth = t.dateOfBirthInvalid;
    return;
  }

  const minimumBirthDate = startOfDay(new Date(today));
  minimumBirthDate.setFullYear(minimumBirthDate.getFullYear() - 30);

  if (birthDate > minimumBirthDate) errors.dateOfBirth = t.ageRequirement;
}

function validatePassport(errors: FieldErrors, value: string, locale: Locale) {
  const t = translations[locale].validation;

  if (!value || !patterns.passport.test(value)) {
    errors.passportNumber = t.passportNumber;
    return;
  }

  if (/^0+$/.test(value.replace(/[ -]/g, ""))) {
    errors.passportNumber = t.passportAllZeros;
  }
}

function validateIssuePlaceNotNationality(errors: FieldErrors, issuePlace: string, nationalityCode: string, locale: Locale) {
  if (errors.passportIssuePlace || !issuePlace || !nationalityCode) return;

  const country = countries.find(([code]) => code === nationalityCode);
  const normalizedIssuePlace = normalizeForCompare(issuePlace);
  const normalizedCountryNames = country ? Object.values(country[1]).map(normalizeForCompare) : [];

  if (normalizedIssuePlace === nationalityCode.toLowerCase() || normalizedCountryNames.includes(normalizedIssuePlace)) {
    errors.passportIssuePlace = translations[locale].validation.issuePlaceNotNationality;
  }
}

function validateFlightRoute(errors: FieldErrors, value: string, locale: Locale) {
  const t = translations[locale].validation;

  if (!value || /\s/.test(value) || !patterns.route.test(value)) {
    errors.flightRoute = t.flightRoute;
    return;
  }

  const stops = value.split(/[-/]/);
  if (stops.at(-1) !== "CAI") errors.flightRoute = t.flightRouteCairo;
}

async function validateFile(file: File, rule: typeof fileRules[FileFieldName], locale: Locale) {
  const t = translations[locale].validation;
  const extension = getFileExtension(file.name);

  if (!rule.extensions.includes(extension)) return t.extension(file.name);
  if (file.type && !rule.mimes.includes(file.type)) return t.fileType(file.name);
  if (file.size > MAX_FILE_SIZE) return t.fileSize(file.name);

  const signature = await getFileSignature(file);
  const actualType = detectFileType(signature);

  if (!actualType || !rule.mimes.includes(actualType)) return t.fileSignature(file.name);

  return "";
}

function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1) ?? "" : "";
}

async function getFileSignature(file: File) {
  const bytes = await file.slice(0, 8).arrayBuffer();
  return [...new Uint8Array(bytes)];
}

function detectFileType(bytes: number[]) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";

  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";

  return "";
}

function parseDateInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearRaw, monthRaw, dayRaw] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;

  return startOfDay(date);
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function normalizeForCompare(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}
