import { Locale } from "./i18n";
import { FileState, FormValues } from "./validation";

const DEFAULT_API_BASE_URL = "http://localhost:5245";

export type ApplicationResponse = {
  id: number;
  arabicFullName: string;
  englishFullName: string;
  nationality: string;
  profession: string;
  educationalQualification: string;
  dateOfBirth: string;
  passportNumber: string;
  passportIssuingAuthority: string;
  countryOfResidence: string;
  nativeLanguage: string;
  otherLanguage: string | null;
  nearestFlightRouteToCairo: string;
  email: string;
  nominatingEntity: string;
  nominatingEntityEmail: string;
  passportFileUrl: string;
  personalPhoto1Url: string;
  personalPhoto2Url: string;
  signatureFileUrl: string;
  nominationApprovalFileUrl: string;
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data?: T | null;
  errors?: string[] | null;
};

export class ApplicationApiError extends Error {
  readonly errors: string[];
  readonly status: number;

  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.name = "ApplicationApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function submitApplication(
  values: FormValues,
  files: FileState,
  locale: Locale,
  labels: {
    nationality: string;
    nativeLanguage: string;
    residenceCountry: string;
  }
) {
  const response = await fetch(`${getApiBaseUrl()}/api/applications`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-Language": locale.toUpperCase(),
    },
    body: buildApplicationFormData(values, files, labels),
  });

  const payload = await readApiResponse<ApplicationResponse>(response);

  if (!response.ok || !payload.success || !payload.data) {
    throw new ApplicationApiError(
      payload.message || "Application submission failed.",
      response.status,
      payload.errors ?? []
    );
  }

  return payload.data;
}

function buildApplicationFormData(
  values: FormValues,
  files: FileState,
  labels: {
    nationality: string;
    nativeLanguage: string;
    residenceCountry: string;
  }
) {
  const formData = new FormData();

  formData.append("ArabicFullName", values.arabicName);
  formData.append("EnglishFullName", values.latinName);
  formData.append("Nationality", labels.nationality);
  formData.append("Profession", values.occupation);
  formData.append("EducationalQualification", values.education);
  formData.append("DateOfBirth", values.dateOfBirth);
  formData.append("PassportNumber", values.passportNumber);
  formData.append("PassportIssuingAuthority", values.passportIssuePlace);
  formData.append("CountryOfResidence", labels.residenceCountry);
  formData.append("NativeLanguage", labels.nativeLanguage);

  if (values.otherLanguage) {
    formData.append("OtherLanguage", values.otherLanguage);
  }

  formData.append("NearestFlightRouteToCairo", values.flightRoute);
  formData.append("Email", values.email);
  formData.append("NominatingEntity", values.nominatingEntity);
  formData.append("NominatingEntityEmail", values.nominatingEntityEmail);
  formData.append("PassportFile", files.passportCopy[0]);

  for (const photo of files.personalPhotos) {
    formData.append("PersonalPhotos", photo);
  }

  formData.append("SignatureFile", files.signatureImage[0]);
  formData.append("NominationApprovalFile", files.endorsementFile[0]);

  return formData;
}

async function readApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return {
      success: false,
      message: response.ok ? "Unexpected empty response." : `Request failed with status ${response.status}.`,
    };
  }

  return response.json();
}

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}
