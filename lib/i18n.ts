export const localeCodes = ["ar", "en", "fr"] as const;

export type Locale = (typeof localeCodes)[number];

export const localeMeta: Record<Locale, { countryLocale: string; dir: "ltr" | "rtl"; lang: string }> = {
  ar: { countryLocale: "ar", dir: "rtl", lang: "ar" },
  en: { countryLocale: "en", dir: "ltr", lang: "en" },
  fr: { countryLocale: "fr", dir: "ltr", lang: "fr" },
};

export const translations = {
  ar: {
    actions: {
      submit: "إرسال الطلب",
      submitting: "جارٍ الإرسال...",
    },
    fields: {
      arabicName: {
        label: "الاسم باللغة العربية طبقًا لجواز السفر",
        placeholder: "مثال: محمد أحمد علي",
      },
      dateOfBirth: {
        label: "تاريخ الميلاد",
        placeholder: "اختر تاريخ الميلاد",
      },
      education: {
        label: "المؤهل التعليمي",
        placeholder: "مثال: ليسانس دراسات إسلامية",
      },
      email: {
        label: "البريد الإلكتروني",
        placeholder: "name@example.com",
      },
      flightRoute: {
        label: "أقرب خط سير جوي إلى مطار القاهرة الدولي",
        placeholder: "أدخل خط السير الجوي",
      },
      latinName: {
        label: "الاسم باللغة الإنجليزية أو الفرنسية",
        placeholder: "Example: Mohamed Ahmed / Jean-Pierre",
      },
      nationality: {
        label: "الجنسية",
        placeholder: "اختر الجنسية",
      },
      nativeLanguage: {
        label: "اللغة الأصلية",
        placeholder: "اختر اللغة الأصلية",
      },
      nominatingEntity: {
        label: "الجهة المرشحة",
        placeholder: "مثال: وزارة الأوقاف",
      },
      nominatingEntityEmail: {
        label: "البريد الإلكتروني للجهة المرشحة",
        placeholder: "entity@example.org",
      },
      occupation: {
        label: "المهنة",
        placeholder: "مثال: إمام وخطيب / Teacher",
      },
      otherLanguage: {
        label: "اسم اللغة عند اختيار Other",
        placeholder: "اكتب اسم اللغة",
      },
      passportIssuePlace: {
        label: "جهة صدور جواز السفر",
        placeholder: "مثال: مصلحة الجوازات - القاهرة",
      },
      passportNumber: {
        label: "رقم جواز السفر",
        placeholder: "مثال: A1234567",
      },
      residenceCountry: {
        label: "دولة الإقامة",
        placeholder: "اختر دولة الإقامة",
      },
    },
    fileHint: "JPG, PNG, PDF حسب نوع الحقل",
    form: {
      consent: "بالضغط على إرسال، يقر المتسابق بصحة البيانات ومطابقتها للمستندات الرسمية.",
    },
    hero: {
      badge: "نموذج تسجيل رسمي",
      logoAlt: "شعار وزارة الأوقاف المصرية",
      subtitle: "يرجى استكمال البيانات المطلوبة ورفع المستندات.",
      title: "المسابقة العالمية الثانية والثلاثون للقران الكريم 1447هـ",
    },
    language: {
      label: "لغة النموذج",
      options: {
        ar: "العربية",
        en: "English",
        fr: "Français",
      },
    },
    sections: {
      contact: "بيانات التواصل والترشيح",
      passport: "بيانات جواز السفر والإقامة",
      personal: "بيانات المتسابق الأساسية",
      uploads: "المرفقات المطلوبة",
    },
    status: {
      failed: "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.",
      invalid: "يرجى تصحيح الحقول المحددة قبل الإرسال.",
      ready: "تم التحقق من البيانات وتجهيز الطلب للإرسال.",
      submitted: "تم إرسال الطلب بنجاح.",
      submitting: "جارٍ إرسال الطلب...",
    },
    uploads: {
      endorsementFile: "مصادقة الجهة المرشحة",
      passportCopy: "صورة من جواز السفر",
      personalPhotos: "عدد 2 صور شخصية",
      signatureImage: "صورة توقيع المرشح",
    },
    uploadCta: "اختر ملف من الجهاز",
    validation: {
      ageRequirement: "يشترط أن يكون عمر المتقدم 30 سنة أو أكثر.",
      arabicName: "اكتب الاسم بحروف عربية فقط وبدون رموز أو أرقام.",
      dateOfBirthInvalid: "تاريخ الميلاد يجب أن يكون تاريخًا صحيحًا وليس في المستقبل.",
      dateOfBirthRequired: "أدخل تاريخ الميلاد.",
      education: "المؤهل يجب أن يكون من 2 إلى 100 حرف وبالرموز المسموحة فقط.",
      email: "اكتب بريدًا إلكترونيًا صحيحًا بحد أقصى 254 حرفًا.",
      entityEmail: "اكتب بريد الجهة المرشحة بصيغة صحيحة.",
      exactMany: (count: number, label: string) => `يجب رفع ${count} ملفات بالضبط في حقل ${label}.`,
      exactOne: (label: string) => `${label} مطلوب.`,
      extension: (fileName: string) => `${fileName}: امتداد الملف غير مسموح.`,
      fileSignature: (fileName: string) => `${fileName}: توقيع الملف لا يطابق الأنواع المسموحة.`,
      fileSize: (fileName: string) => `${fileName}: حجم الملف يتجاوز 5MB.`,
      fileType: (fileName: string) => `${fileName}: نوع الملف غير مسموح.`,
      flightRoute: "خط السير يجب أن يكون مثل AAA-AAA-CAI أو AAA/AAA/CAI، من 2 إلى 10 مطارات وبدون مسافات.",
      flightRouteCairo: "آخر محطة في خط السير يجب أن تكون CAI.",
      issuePlace: "جهة الإصدار يجب أن تكون من 2 إلى 150 حرف وبالرموز المسموحة فقط.",
      issuePlaceNotNationality: "جهة صدور جواز السفر يجب ألا تكون نفس الجنسية فقط؛ اكتب جهة الإصدار الفعلية.",
      latinName: "اكتب الاسم بحروف إنجليزية/فرنسية فقط مع السماح بالمسافة والشرطة و apostrophe.",
      nativeLanguage: "اختر اللغة الأصلية من القائمة.",
      nationality: "اختر جنسية صحيحة من القائمة.",
      nominatingEntity: "الجهة المرشحة يجب أن تكون من 2 إلى 150 حرف وبالرموز المسموحة فقط.",
      occupation: "المهنة يجب أن تكون من 2 إلى 100 حرف وبالرموز المسموحة فقط.",
      otherLanguage: "اسم اللغة يجب أن يكون حروفًا فقط مع المسافة أو الشرطة أو apostrophe، من 2 إلى 80 حرفًا.",
      passportAllZeros: "رقم الجواز لا يمكن أن يكون كله أصفارًا.",
      passportNumber: "رقم الجواز يجب أن يكون 5 إلى 20 خانة من A-Z و 0-9 والمسافة والشرطة، ولا يبدأ أو ينتهي بمسافة أو شرطة.",
      residenceCountry: "اختر دولة إقامة صحيحة من القائمة.",
    },
  },
  en: {
    actions: {
      saveDraft: "Save draft",
      submit: "Submit application",
      submitting: "Submitting...",
    },
    fields: {
      arabicName: {
        label: "Arabic name as shown in passport",
        placeholder: "Example: Mohamed Ahmed Ali",
      },
      dateOfBirth: {
        label: "Date of birth",
        placeholder: "Select date of birth",
      },
      education: {
        label: "Educational qualification",
        placeholder: "Example: Bachelor of Islamic Studies",
      },
      email: {
        label: "Email address",
        placeholder: "name@example.com",
      },
      flightRoute: {
        label: "Nearest flight route to Cairo International Airport",
        placeholder: "Enter flight route",
      },
      latinName: {
        label: "Name in English or French",
        placeholder: "Example: Mohamed Ahmed / Jean-Pierre",
      },
      nationality: {
        label: "Nationality",
        placeholder: "Select nationality",
      },
      nativeLanguage: {
        label: "Native language",
        placeholder: "Select native language",
      },
      nominatingEntity: {
        label: "Nominating entity",
        placeholder: "Example: Ministry of Awqaf",
      },
      nominatingEntityEmail: {
        label: "Nominating entity email",
        placeholder: "entity@example.org",
      },
      occupation: {
        label: "Profession",
        placeholder: "Example: Imam / Teacher",
      },
      otherLanguage: {
        label: "Language name when selecting Other",
        placeholder: "Enter language name",
      },
      passportIssuePlace: {
        label: "Passport issuing authority",
        placeholder: "Example: Passport Authority - Cairo",
      },
      passportNumber: {
        label: "Passport number",
        placeholder: "Example: A1234567",
      },
      residenceCountry: {
        label: "Country of residence",
        placeholder: "Select country of residence",
      },
    },
    fileHint: "JPG, PNG, PDF depending on the field",
    form: {
      consent: "By submitting, the contestant confirms that the information matches the official documents.",
    },
    hero: {
      badge: "Official Registration Form",
      logoAlt: "Egyptian Ministry of Awqaf logo",
      subtitle: "Please complete the required information and upload the documents.",
      title: "32nd International Holy Quran Competition 1447 AH",
    },
    language: {
      label: "Form language",
      options: {
        ar: "Arabic",
        en: "English",
        fr: "French",
      },
    },
    sections: {
      contact: "Contact and Nomination Details",
      passport: "Passport and Residence Details",
      personal: "Contestant Information",
      uploads: "Required Attachments",
    },
    status: {
      failed: "The application could not be submitted. Please try again.",
      invalid: "Please correct the highlighted fields before submitting.",
      ready: "The information has been validated and the application is ready to submit.",
      submitted: "Application submitted successfully.",
      submitting: "Submitting the application...",
    },
    uploads: {
      endorsementFile: "Nominating entity certification",
      passportCopy: "Passport copy",
      personalPhotos: "Two personal photos",
      signatureImage: "Candidate signature image",
    },
    uploadCta: "Drag file here or choose from device",
    validation: {
      ageRequirement: "The applicant must be at least 30 years old.",
      arabicName: "Enter the name using Arabic letters only, without symbols or numbers.",
      dateOfBirthInvalid: "Date of birth must be valid and cannot be in the future.",
      dateOfBirthRequired: "Enter the date of birth.",
      education: "Educational qualification must be 2 to 100 characters and use only allowed symbols.",
      email: "Enter a valid email address up to 254 characters.",
      entityEmail: "Enter a valid nominating entity email address.",
      exactMany: (count: number, label: string) => `Upload exactly ${count} files for ${label}.`,
      exactOne: (label: string) => `${label} is required.`,
      extension: (fileName: string) => `${fileName}: file extension is not allowed.`,
      fileSignature: (fileName: string) => `${fileName}: file signature does not match the allowed types.`,
      fileSize: (fileName: string) => `${fileName}: file size exceeds 5MB.`,
      fileType: (fileName: string) => `${fileName}: file type is not allowed.`,
      flightRoute: "Flight route must look like AAA-AAA-CAI or AAA/AAA/CAI, with 2 to 10 airports and no spaces.",
      flightRouteCairo: "The last stop in the flight route must be CAI.",
      issuePlace: "Issuing authority must be 2 to 150 characters and use only allowed symbols.",
      issuePlaceNotNationality: "Passport issuing authority cannot be only the nationality; enter the actual issuing authority.",
      latinName: "Enter the name using English/French letters only; spaces, hyphens, and apostrophes are allowed.",
      nativeLanguage: "Select a valid native language from the list.",
      nationality: "Select a valid nationality from the list.",
      nominatingEntity: "Nominating entity must be 2 to 150 characters and use only allowed symbols.",
      occupation: "Profession must be 2 to 100 characters and use only allowed symbols.",
      otherLanguage: "Language name must be letters only with spaces, hyphens, or apostrophes, from 2 to 80 characters.",
      passportAllZeros: "Passport number cannot be all zeros.",
      passportNumber: "Passport number must be 5 to 20 characters using A-Z, 0-9, spaces, or hyphens, and cannot start or end with a space or hyphen.",
      residenceCountry: "Select a valid country of residence from the list.",
    },
  },
  fr: {
    actions: {
      saveDraft: "Enregistrer le brouillon",
      submit: "Envoyer la demande",
      submitting: "Envoi...",
    },
    fields: {
      arabicName: {
        label: "Nom arabe comme indiqué sur le passeport",
        placeholder: "Exemple : Mohamed Ahmed Ali",
      },
      dateOfBirth: {
        label: "Date de naissance",
        placeholder: "Sélectionner la date de naissance",
      },
      education: {
        label: "Niveau d'études",
        placeholder: "Exemple : Licence en études islamiques",
      },
      email: {
        label: "Adresse e-mail",
        placeholder: "name@example.com",
      },
      flightRoute: {
        label: "Itinéraire aérien le plus proche vers l'aéroport international du Caire",
        placeholder: "Saisir l'itinéraire aérien",
      },
      latinName: {
        label: "Nom en anglais ou en français",
        placeholder: "Exemple : Mohamed Ahmed / Jean-Pierre",
      },
      nationality: {
        label: "Nationalité",
        placeholder: "Sélectionner la nationalité",
      },
      nativeLanguage: {
        label: "Langue maternelle",
        placeholder: "Sélectionner la langue maternelle",
      },
      nominatingEntity: {
        label: "Organisme de nomination",
        placeholder: "Exemple : Ministère des Awqaf",
      },
      nominatingEntityEmail: {
        label: "E-mail de l'organisme de nomination",
        placeholder: "entity@example.org",
      },
      occupation: {
        label: "Profession",
        placeholder: "Exemple : Imam / Enseignant",
      },
      otherLanguage: {
        label: "Nom de la langue si Autre est sélectionné",
        placeholder: "Saisir le nom de la langue",
      },
      passportIssuePlace: {
        label: "Autorité de délivrance du passeport",
        placeholder: "Exemple : Autorité des passeports - Le Caire",
      },
      passportNumber: {
        label: "Numéro de passeport",
        placeholder: "Exemple : A1234567",
      },
      residenceCountry: {
        label: "Pays de résidence",
        placeholder: "Sélectionner le pays de résidence",
      },
    },
    fileHint: "JPG, PNG, PDF selon le champ",
    form: {
      consent: "En envoyant, le candidat confirme que les informations correspondent aux documents officiels.",
    },
    hero: {
      badge: "Formulaire officiel d'inscription",
      logoAlt: "Logo du ministère égyptien des Awqaf",
      subtitle: "Veuillez compléter les informations demandées et téléverser les documents.",
      title: "32e Concours international du Saint Coran 1447 H",
    },
    language: {
      label: "Langue du formulaire",
      options: {
        ar: "Arabe",
        en: "Anglais",
        fr: "Français",
      },
    },
    sections: {
      contact: "Contact et nomination",
      passport: "Passeport et résidence",
      personal: "Informations du candidat",
      uploads: "Pièces jointes requises",
    },
    status: {
      failed: "La demande n'a pas pu être envoyée. Veuillez réessayer.",
      invalid: "Veuillez corriger les champs indiqués avant l'envoi.",
      ready: "Les informations ont été vérifiées et la demande est prête à être envoyée.",
      submitted: "Demande envoyée avec succès.",
      submitting: "Envoi de la demande...",
    },
    uploads: {
      endorsementFile: "Certification de l'organisme de nomination",
      passportCopy: "Copie du passeport",
      personalPhotos: "Deux photos personnelles",
      signatureImage: "Image de la signature du candidat",
    },
    uploadCta: "Glissez le fichier ici ou choisissez depuis l'appareil",
    validation: {
      ageRequirement: "Le candidat doit avoir au moins 30 ans.",
      arabicName: "Saisissez le nom en lettres arabes uniquement, sans symboles ni chiffres.",
      dateOfBirthInvalid: "La date de naissance doit être valide et ne peut pas être dans le futur.",
      dateOfBirthRequired: "Saisissez la date de naissance.",
      education: "Le niveau d'études doit contenir de 2 à 100 caractères et seulement les symboles autorisés.",
      email: "Saisissez une adresse e-mail valide de 254 caractères maximum.",
      entityEmail: "Saisissez une adresse e-mail valide pour l'organisme de nomination.",
      exactMany: (count: number, label: string) => `Téléversez exactement ${count} fichiers pour ${label}.`,
      exactOne: (label: string) => `${label} est requis.`,
      extension: (fileName: string) => `${fileName} : l'extension du fichier n'est pas autorisée.`,
      fileSignature: (fileName: string) => `${fileName} : la signature du fichier ne correspond pas aux types autorisés.`,
      fileSize: (fileName: string) => `${fileName} : la taille du fichier dépasse 5MB.`,
      fileType: (fileName: string) => `${fileName} : le type de fichier n'est pas autorisé.`,
      flightRoute: "L'itinéraire doit être au format AAA-AAA-CAI ou AAA/AAA/CAI, avec 2 à 10 aéroports et sans espaces.",
      flightRouteCairo: "La dernière escale de l'itinéraire doit être CAI.",
      issuePlace: "L'autorité de délivrance doit contenir de 2 à 150 caractères et seulement les symboles autorisés.",
      issuePlaceNotNationality: "L'autorité de délivrance du passeport ne peut pas être uniquement la nationalité ; saisissez l'autorité réelle.",
      latinName: "Saisissez le nom en lettres anglaises/françaises uniquement ; espaces, traits d'union et apostrophes sont autorisés.",
      nativeLanguage: "Sélectionnez une langue maternelle valide dans la liste.",
      nationality: "Sélectionnez une nationalité valide dans la liste.",
      nominatingEntity: "L'organisme de nomination doit contenir de 2 à 150 caractères et seulement les symboles autorisés.",
      occupation: "La profession doit contenir de 2 à 100 caractères et seulement les symboles autorisés.",
      otherLanguage: "Le nom de la langue doit contenir uniquement des lettres avec espaces, traits d'union ou apostrophes, de 2 à 80 caractères.",
      passportAllZeros: "Le numéro de passeport ne peut pas être composé uniquement de zéros.",
      passportNumber: "Le numéro de passeport doit contenir de 5 à 20 caractères avec A-Z, 0-9, espaces ou traits d'union, sans commencer ni finir par un espace ou un trait d'union.",
      residenceCountry: "Sélectionnez un pays de résidence valide dans la liste.",
    },
  },
} as const;
