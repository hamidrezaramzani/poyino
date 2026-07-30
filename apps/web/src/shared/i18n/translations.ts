export type Locale = "fa" | "en";

export type Translation = {
  languageLabel: string;
  switchLanguageLabel: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  socialProofLabel: string;
  socialProofValue: string;
  highlightsTitle: string;
  highlightsDescription: string;
  highlights: Array<{
    title: string;
    description: string;
  }>;
  workflowTitle: string;
  workflowDescription: string;
  workflowSteps: Array<{
    title: string;
    description: string;
  }>;
  trustTitle: string;
  trustDescription: string;
  trustItems: string[];
  metrics: Array<{
    value: string;
    label: string;
  }>;
  finalCtaTitle: string;
  finalCtaDescription: string;
  finalCtaButton: string;
  loginNav: string;
  footer: {
    product: string;
    company: string;
    highlights: string;
    workflow: string;
    trust: string;
    register: string;
    login: string;
    rights: string;
    tagline: string;
  };
  register: {
    title: string;
    description: string;
    organizationNameLabel: string;
    organizationNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    submitting: string;
    haveAccount: string;
    loginLink: string;
    successToast: string;
    errors: {
      organizationNameRequired: string;
      organizationNameTooShort: string;
      organizationNameTooLong: string;
      emailInvalid: string;
      emailExists: string;
      passwordTooShort: string;
      passwordsDoNotMatch: string;
      unexpected: string;
    };
  };
  login: {
    title: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    submitting: string;
    forgotPasswordLink: string;
    noAccount: string;
    registerLink: string;
    errors: {
      emailInvalid: string;
      passwordTooShort: string;
      invalidCredentials: string;
      emailNotVerified: string;
      tooManyRequests: string;
      unexpected: string;
    };
  };
  forgotPassword: {
    title: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    loginLink: string;
    successToast: string;
    errors: {
      emailInvalid: string;
      tooManyRequests: string;
      unexpected: string;
    };
  };
  resetPassword: {
    title: string;
    description: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    submitting: string;
    validatingToken: string;
    loginLink: string;
    forgotPasswordLink: string;
    successToast: string;
    errors: {
      missingToken: string;
      invalidToken: string;
      expiredToken: string;
      passwordTooShort: string;
      passwordsDoNotMatch: string;
      tooManyRequests: string;
      unexpected: string;
    };
  };
  dashboard: {
    title: string;
    description: string;
    welcome: string;
    homeLink: string;
    sidebarLabel: string;
    openSidebar: string;
    closeSidebar: string;
    placeholder: string;
    placeholderHint: string;
    nav: {
      overview: string;
      jobs: string;
      createJob: string;
      jobList: string;
      candidates: string;
      interviews: string;
      reports: string;
      settings: string;
    };
    sidebar: {
      organizationFallback: string;
      collapse: string;
      expand: string;
    };
    userMenu: {
      profile: string;
      settings: string;
      logout: string;
    };
    logout: {
      title: string;
      description: string;
      cancel: string;
      confirm: string;
      confirming: string;
    };
    statistics: {
      title: string;
      totalJobs: string;
      totalJobsDescription: string;
      activeJobs: string;
      activeJobsDescription: string;
      totalCandidates: string;
      totalCandidatesDescription: string;
      totalHired: string;
      totalHiredDescription: string;
      loadError: string;
    };
    jobs: {
      title: string;
      description: string;
      empty: string;
      create: string;
      view: string;
      edit: string;
      columns: {
        title: string;
        status: string;
        publishedAt: string;
        candidateCount: string;
        actions: string;
      };
    };
    candidates: {
      title: string;
      description: string;
      empty: string;
      view: string;
      viewAll: string;
      analyzing: string;
      columns: {
        name: string;
        job: string;
        aiScore: string;
        status: string;
        appliedAt: string;
        actions: string;
      };
    };
    jobStatus: {
      DRAFT: string;
      PUBLISHED: string;
      ARCHIVED: string;
    };
    candidateStatus: {
      APPLIED: string;
      REVIEWING: string;
      INTERVIEW_SCHEDULED: string;
      INTERVIEW_PASSED: string;
      REJECTED: string;
      HIRED: string;
    };
    error: {
      title: string;
      description: string;
      retry: string;
    };
  };
  settings: {
    title: string;
    description: string;
    tabsLabel: string;
    tabs: {
      general: string;
      profile: string;
      branding: string;
      notifications: string;
    };
    save: string;
    saving: string;
    reset: string;
    retry: string;
    unsaved: {
      title: string;
      description: string;
      stay: string;
      leave: string;
    };
    languages: {
      persian: string;
      english: string;
    };
    countries: {
      iran: string;
      uae: string;
      turkey: string;
      germany: string;
      uk: string;
      usa: string;
      canada: string;
      other: string;
    };
    errors: {
      unexpected: string;
      loadFailed: string;
      organizationNameRequired: string;
      organizationNameTooShort: string;
      organizationNameTooLong: string;
      displayNameTooLong: string;
      descriptionTooLong: string;
      emailInvalid: string;
      emailExists: string;
      phoneTooLong: string;
      websiteInvalid: string;
      timezoneRequired: string;
      languageRequired: string;
      addressTooLong: string;
      fileInvalidType: string;
      fileTooLarge: string;
      primaryColorInvalid: string;
      secondaryColorInvalid: string;
    };
    general: {
      title: string;
      description: string;
      organizationSection: string;
      contactSection: string;
      locationSection: string;
      organizationName: string;
      displayName: string;
      descriptionLabel: string;
      email: string;
      phone: string;
      website: string;
      country: string;
      countryPlaceholder: string;
      city: string;
      timezone: string;
      language: string;
      successToast: string;
    };
    profile: {
      title: string;
      description: string;
      identitySection: string;
      contactSection: string;
      logo: string;
      logoEmpty: string;
      uploadLogo: string;
      removeLogo: string;
      organizationName: string;
      email: string;
      phone: string;
      website: string;
      address: string;
      successToast: string;
    };
    branding: {
      title: string;
      description: string;
      logoSection: string;
      colorsSection: string;
      previewSection: string;
      primaryLogo: string;
      darkLogo: string;
      logoEmpty: string;
      uploadLogo: string;
      removeLogo: string;
      primaryColor: string;
      secondaryColor: string;
      previewHeader: string;
      previewJobTitle: string;
      previewJobDescription: string;
      previewCta: string;
      successToast: string;
    };
    notifications: {
      title: string;
      description: string;
      newCandidateTitle: string;
      newCandidateDescription: string;
      candidateStatusTitle: string;
      candidateStatusDescription: string;
      interviewReminderTitle: string;
      interviewReminderDescription: string;
      jobExpirationTitle: string;
      jobExpirationDescription: string;
      jobPublishedTitle: string;
      jobPublishedDescription: string;
      successToast: string;
    };
    changePassword: {
      title: string;
      description: string;
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
      submit: string;
      successToast: string;
      errors: {
        currentRequired: string;
        currentIncorrect: string;
        passwordTooShort: string;
        passwordsDoNotMatch: string;
        samePassword: string;
        tooManyRequests: string;
      };
    };
  };
  jobs: {
    create: {
      title: string;
      description: string;
      saveDraft: string;
      saving: string;
      cancel: string;
      successToast: string;
      basicSection: string;
      salarySection: string;
      descriptionSection: string;
      skillsSection: string;
      hiringSection: string;
      aiSection: string;
      templateSection: string;
      titleLabel: string;
      departmentLabel: string;
      departmentPlaceholder: string;
      employmentTypeLabel: string;
      workplaceTypeLabel: string;
      locationLabel: string;
      locationPlaceholder: string;
      salaryMinLabel: string;
      salaryMaxLabel: string;
      currencyLabel: string;
      salaryVisibilityLabel: string;
      descriptionLabel: string;
      responsibilitiesLabel: string;
      requirementsLabel: string;
      benefitsLabel: string;
      skillsLabel: string;
      skillsPlaceholder: string;
      skillsAdd: string;
      positionsLabel: string;
      expirationDateLabel: string;
      templateLabel: string;
      templatePlaceholder: string;
      templateEmpty: string;
      aiPromptLabel: string;
      aiPromptPlaceholder: string;
      aiGenerate: string;
      aiGenerating: string;
      selectPlaceholder: string;
      employmentTypes: {
        FULL_TIME: string;
        PART_TIME: string;
        CONTRACT: string;
        INTERNSHIP: string;
        TEMPORARY: string;
      };
      workplaceTypes: {
        ON_SITE: string;
        HYBRID: string;
        REMOTE: string;
      };
      salaryVisibility: {
        visible: string;
        hidden: string;
      };
      unsaved: {
        title: string;
        description: string;
        stay: string;
        leave: string;
      };
      errors: {
        unexpected: string;
        titleRequired: string;
        titleTooShort: string;
        titleTooLong: string;
        departmentTooLong: string;
        employmentTypeRequired: string;
        workplaceTypeRequired: string;
        locationTooLong: string;
        salaryMinInvalid: string;
        salaryMaxInvalid: string;
        salaryRangeInvalid: string;
        currencyInvalid: string;
        salaryVisibilityRequired: string;
        descriptionRequired: string;
        descriptionTooShort: string;
        skillTooLong: string;
        skillsTooMany: string;
        positionsInvalid: string;
        positionsTooLow: string;
        positionsTooHigh: string;
        expirationDateInvalid: string;
        expirationDateInPast: string;
        promptTooShort: string;
        promptTooLong: string;
        tooManyRequests: string;
      };
    };
    list: {
      title: string;
      description: string;
      create: string;
      empty: string;
      loadFailed: string;
      retry: string;
      columns: {
        title: string;
        status: string;
        candidateCount: string;
        createdAt: string;
        actions: string;
      };
      actions: {
        details: string;
        edit: string;
      };
      pagination: {
        previous: string;
        next: string;
        summary: string;
      };
      errors: {
        unexpected: string;
      };
    };
    edit: {
      title: string;
      description: string;
      save: string;
      saving: string;
      reset: string;
      cancel: string;
      retry: string;
      loadFailed: string;
      successToast: string;
    };
    details: {
      title: string;
      notFound: string;
      loadFailed: string;
      retry: string;
      backToJobs: string;
      emptyValue: string;
      infoTitle: string;
      candidatesTitle: string;
      publicTitle: string;
      salaryLabel: string;
      salaryHidden: string;
      publicUrl: string;
      publishedAt: string;
      totalCandidates: string;
      latestCandidate: string;
      noCandidates: string;
      linkCopiedToast: string;
      expiredBadge: string;
      expiresOn: string;
      expiredOn: string;
      actions: {
        edit: string;
        publish: string;
        unpublish: string;
        delete: string;
        viewCandidates: string;
        viewAllCandidates: string;
        copyLink: string;
        linkCopied: string;
        viewPublic: string;
      };
      publish: {
        title: string;
        description: string;
        cancel: string;
        confirm: string;
        confirming: string;
        successToast: string;
        notPublishable: string;
      };
      unpublish: {
        title: string;
        description: string;
        cancel: string;
        confirm: string;
        confirming: string;
        successToast: string;
      };
      delete: {
        title: string;
        description: string;
        cancel: string;
        confirm: string;
        confirming: string;
        successToast: string;
        hasCandidates: string;
      };
      stats: {
        applications: string;
        newApplications: string;
        interviews: string;
        hired: string;
      };
      errors: {
        unexpected: string;
      };
    };
  };
  verifyEmail: {
    title: string;
    description: string;
    tokenReceived: string;
    missingToken: string;
    loginLink: string;
  };
};

export const translations: Record<Locale, Translation> = {
  fa: {
    languageLabel: "فارسی",
    switchLanguageLabel: "English",
    heroBadge: "استخدام هوشمند برای تیم های در حال رشد",
    heroTitle: "پوینو به شما کمک می کند استعداد مناسب را سریع تر و با اطمینان بیشتر پیدا کنید.",
    heroDescription:
      "پوینو یک پلتفرم استخدام مبتنی بر هوش مصنوعی است که آگهی شغلی، دریافت رزومه، تحلیل خودکار و ارزیابی اولیه متقاضیان را در یک جریان کاری ساده و منظم جمع می کند.",
    primaryCta: "ثبت نام سازمان",
    secondaryCta: "آشنایی با رویکرد پوینو",
    socialProofLabel: "وعده برند",
    socialProofValue: "کشف استعداد مناسب با شفافیت، سرعت و کنترل انسانی",
    highlightsTitle: "چرا پوینو",
    highlightsDescription:
      "طراحی محصول بر پایه سادگی، سرعت و اعتماد ساخته شده است تا تیم های منابع انسانی بدون آشفتگی ابزارها، تصمیم های بهتری بگیرند.",
    highlights: [
      {
        title: "یک مسیر واحد برای دریافت رزومه",
        description:
          "برای هر فرصت شغلی یک لینک عمومی بسازید و همه درخواست ها را در یک فضای منظم دریافت کنید.",
      },
      {
        title: "تحلیل اولیه با کمک هوش مصنوعی",
        description:
          "استخراج اطلاعات رزومه، خلاصه سازی و تطبیق اولیه به کاهش کارهای تکراری کمک می کند.",
      },
      {
        title: "تصمیم گیری با حفظ کنترل انسانی",
        description:
          "هوش مصنوعی پیشنهاد می دهد، اما تصمیم نهایی همیشه در اختیار تیم استخدام باقی می ماند.",
      },
    ],
    workflowTitle: "جریان کاری روشن و قابل فهم",
    workflowDescription:
      "هر بخش از تجربه محصول باید مشخص کند اکنون کجا هستید، چه کاری می توانید انجام دهید و قدم بعدی چیست.",
    workflowSteps: [
      {
        title: "1. انتشار فرصت شغلی",
        description:
          "فرصت شغلی را یک بار ایجاد کنید و لینک عمومی دریافت متقاضی را منتشر کنید.",
      },
      {
        title: "2. جمع آوری و تحلیل رزومه ها",
        description:
          "رزومه ها از مسیرهای مختلف در یک محل جمع می شوند و برای بررسی سریع آماده می شوند.",
      },
      {
        title: "3. اولویت بندی و پیشبرد استخدام",
        description:
          "نامزدها را سریع تر مقایسه کنید، دید بهتری بگیرید و با اطمینان بیشتر وارد مراحل بعد شوید.",
      },
    ],
    trustTitle: "طراحی شده برای اعتماد و تمرکز",
    trustDescription:
      "لحن، رنگ ها و ساختار صفحه باید حس حرفه ای، آرام و دقیق برند پوینو را منتقل کنند.",
    trustItems: [
      "رابط کاربری مینیمال و کم اصطکاک",
      "تاکید بر وضوح، ساختار و خوانایی",
      "استفاده از رنگ های برند برای القای اعتماد و ثبات",
    ],
    metrics: [
      { value: "1", label: "فضای کاری متمرکز برای مدیریت متقاضیان" },
      { value: "AI", label: "تحلیل کمکی برای کاهش کار دستی" },
      { value: "100%", label: "حفظ کنترل نهایی توسط انسان" },
    ],
    finalCtaTitle: "استخدام بهتر از یک تجربه بهتر شروع می شود.",
    finalCtaDescription:
      "اگر می خواهید فرایند جذب را ساده تر، سریع تر و دقیق تر کنید، پوینو می تواند نقطه شروع مناسبی برای تیم شما باشد.",
    finalCtaButton: "ثبت نام سازمان",
    loginNav: "ورود",
    footer: {
      product: "محصول",
      company: "سازمان",
      highlights: "چرا پوینو",
      workflow: "جریان کاری",
      trust: "اعتماد",
      register: "ثبت نام",
      login: "ورود",
      rights: "تمامی حقوق محفوظ است.",
      tagline: "استخدام هوشمند با شفافیت، سرعت و کنترل انسانی.",
    },
    register: {
      title: "ثبت نام سازمان",
      description: "سازمان خود را بسازید و اولین حساب مدیر را ایجاد کنید.",
      organizationNameLabel: "نام سازمان",
      organizationNamePlaceholder: "نام سازمان",
      emailLabel: "پست الکترونیکی",
      emailPlaceholder: "example@company.com",
      passwordLabel: "رمز عبور",
      confirmPasswordLabel: "تکرار رمز عبور",
      showPassword: "نمایش",
      hidePassword: "مخفی",
      submit: "ثبت نام",
      submitting: "در حال ثبت نام...",
      haveAccount: "قبلاً ثبت نام کرده اید؟",
      loginLink: "ورود",
      successToast: "ثبت نام با موفقیت انجام شد. لطفاً ایمیل خود را تأیید کنید.",
      errors: {
        organizationNameRequired: "نام سازمان الزامی است.",
        organizationNameTooShort: "نام سازمان باید حداقل ۳ کاراکتر باشد.",
        organizationNameTooLong: "نام سازمان نباید بیشتر از ۸۰ کاراکتر باشد.",
        emailInvalid: "پست الکترونیکی معتبر نیست.",
        emailExists: "پست الکترونیکی قبلاً ثبت شده است.",
        passwordTooShort: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
        passwordsDoNotMatch: "رمز عبور و تکرار رمز عبور یکسان نیست.",
        unexpected: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
      },
    },
    login: {
      title: "ورود",
      description: "پس از تأیید ایمیل می توانید وارد حساب خود شوید.",
      emailLabel: "پست الکترونیکی",
      emailPlaceholder: "example@company.com",
      passwordLabel: "رمز عبور",
      showPassword: "نمایش",
      hidePassword: "مخفی",
      submit: "ورود",
      submitting: "در حال ورود...",
      forgotPasswordLink: "رمز عبور را فراموش کرده اید؟",
      noAccount: "حساب کاربری ندارید؟",
      registerLink: "ثبت نام سازمان",
      errors: {
        emailInvalid: "پست الکترونیکی معتبر نیست.",
        passwordTooShort: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
        invalidCredentials: "پست الکترونیکی یا رمز عبور اشتباه است.",
        emailNotVerified:
          "حساب کاربری شما هنوز فعال نشده است. لطفاً ایمیل خود را بررسی کنید.",
        tooManyRequests:
          "تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
        unexpected: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
      },
    },
    forgotPassword: {
      title: "بازیابی رمز عبور",
      description: "ایمیل حساب خود را وارد کنید تا لینک بازیابی برای شما ارسال شود.",
      emailLabel: "پست الکترونیکی",
      emailPlaceholder: "example@company.com",
      submit: "ارسال لینک بازیابی",
      submitting: "در حال ارسال...",
      loginLink: "بازگشت به ورود",
      successToast:
        "در صورت وجود حساب کاربری، لینک بازیابی رمز عبور برای شما ارسال شد.",
      errors: {
        emailInvalid: "پست الکترونیکی معتبر نیست.",
        tooManyRequests:
          "تعداد درخواست‌های بازیابی رمز عبور بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
        unexpected: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
      },
    },
    resetPassword: {
      title: "بازنشانی رمز عبور",
      description: "رمز عبور جدید خود را وارد کنید.",
      passwordLabel: "رمز عبور جدید",
      confirmPasswordLabel: "تکرار رمز عبور",
      showPassword: "نمایش",
      hidePassword: "مخفی",
      submit: "بازنشانی رمز عبور",
      submitting: "در حال بازنشانی...",
      validatingToken: "در حال بررسی لینک بازیابی...",
      loginLink: "بازگشت به ورود",
      forgotPasswordLink: "درخواست لینک جدید",
      successToast: "رمز عبور با موفقیت تغییر کرد. اکنون می توانید وارد شوید.",
      errors: {
        missingToken: "لینک بازیابی معتبر نیست.",
        invalidToken: "لینک بازیابی معتبر نیست.",
        expiredToken: "اعتبار لینک بازیابی به پایان رسیده است.",
        passwordTooShort: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
        passwordsDoNotMatch: "رمز عبور و تکرار رمز عبور یکسان نیست.",
        tooManyRequests:
          "تعداد تلاش‌های بازنشانی رمز عبور بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
        unexpected: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
      },
    },
    dashboard: {
      title: "داشبورد",
      description: "به فضای کاری پوینو خوش آمدید.",
      welcome: "ورود شما با موفقیت انجام شد.",
      homeLink: "بازگشت به صفحه اصلی",
      sidebarLabel: "منوی اصلی",
      openSidebar: "باز کردن منو",
      closeSidebar: "بستن منو",
      placeholder: "این بخش به زودی آماده می‌شود.",
      placeholderHint: "ماژول انتخاب‌شده هنوز در نسخه فعلی پیاده‌سازی نشده است.",
      nav: {
        overview: "داشبورد",
        jobs: "فرصت‌های شغلی",
        createJob: "ایجاد فرصت شغلی",
        jobList: "فهرست فرصت‌ها",
        candidates: "متقاضیان",
        interviews: "مصاحبه‌ها",
        reports: "گزارش‌ها",
        settings: "تنظیمات",
      },
      sidebar: {
        organizationFallback: "سازمان",
        collapse: "جمع کردن منو",
        expand: "باز کردن منو",
      },
      userMenu: {
        profile: "پروفایل",
        settings: "تنظیمات",
        logout: "خروج",
      },
      logout: {
        title: "خروج از حساب",
        description: "آیا از خروج از حساب کاربری اطمینان دارید؟",
        cancel: "انصراف",
        confirm: "خروج",
        confirming: "در حال خروج...",
      },
      statistics: {
        title: "آمار استخدام",
        totalJobs: "کل فرصت‌های شغلی",
        totalJobsDescription: "همه فرصت‌های ایجادشده",
        activeJobs: "فرصت‌های فعال",
        activeJobsDescription: "فرصت‌های منتشرشده",
        totalCandidates: "کل متقاضیان",
        totalCandidatesDescription: "همه درخواست‌های ارسال‌شده",
        totalHired: "استخدام‌شده‌ها",
        totalHiredDescription: "متقاضیان با وضعیت استخدام",
        loadError: "بارگذاری آمار ممکن نشد.",
      },
      jobs: {
        title: "آخرین فرصت‌های شغلی",
        description: "ده فرصت شغلی اخیر سازمان شما.",
        empty: "هنوز فرصت شغلی ثبت نشده است.",
        create: "ایجاد فرصت شغلی",
        view: "مشاهده",
        edit: "ویرایش",
        columns: {
          title: "عنوان",
          status: "وضعیت",
          publishedAt: "تاریخ انتشار",
          candidateCount: "تعداد متقاضی",
          actions: "اقدامات",
        },
      },
      candidates: {
        title: "آخرین متقاضیان",
        description: "ده متقاضی اخیر ارسال‌شده.",
        empty: "هنوز هیچ متقاضی‌ای درخواست نداده است.",
        view: "مشاهده متقاضی",
        viewAll: "مشاهده همه",
        analyzing: "در حال تحلیل...",
        columns: {
          name: "متقاضی",
          job: "فرصت شغلی",
          aiScore: "امتیاز هوش مصنوعی",
          status: "وضعیت",
          appliedAt: "تاریخ درخواست",
          actions: "اقدامات",
        },
      },
      jobStatus: {
        DRAFT: "پیش‌نویس",
        PUBLISHED: "منتشر شده",
        ARCHIVED: "بایگانی",
      },
      candidateStatus: {
        APPLIED: "ارسال شده",
        REVIEWING: "در حال بررسی",
        INTERVIEW_SCHEDULED: "مصاحبه زمان‌بندی شده",
        INTERVIEW_PASSED: "قبول در مصاحبه",
        REJECTED: "رد شده",
        HIRED: "استخدام شده",
      },
      error: {
        title: "خطا در بارگذاری داشبورد",
        description: "دریافت اطلاعات داشبورد با مشکل مواجه شد.",
        retry: "تلاش مجدد",
      },
    },
    settings: {
      title: "تنظیمات",
      description: "اطلاعات سازمان، برندینگ و اعلان‌ها را مدیریت کنید.",
      tabsLabel: "بخش‌های تنظیمات",
      tabs: {
        general: "عمومی",
        profile: "پروفایل",
        branding: "برندینگ",
        notifications: "اعلان‌ها",
      },
      save: "ذخیره تغییرات",
      saving: "در حال ذخیره...",
      reset: "بازنشانی",
      retry: "تلاش مجدد",
      unsaved: {
        title: "تغییرات ذخیره‌نشده",
        description: "تغییرات شما ذخیره نشده است. آیا می‌خواهید صفحه را ترک کنید؟",
        stay: "ماندن در صفحه",
        leave: "ترک صفحه",
      },
      languages: {
        persian: "فارسی",
        english: "انگلیسی",
      },
      countries: {
        iran: "ایران",
        uae: "امارات متحده عربی",
        turkey: "ترکیه",
        germany: "آلمان",
        uk: "بریتانیا",
        usa: "ایالات متحده",
        canada: "کانادا",
        other: "سایر",
      },
      errors: {
        unexpected: "خطایی رخ داده است. لطفاً دوباره تلاش کنید.",
        loadFailed: "بارگذاری تنظیمات ممکن نشد.",
        organizationNameRequired: "نام سازمان الزامی است.",
        organizationNameTooShort: "نام سازمان باید حداقل ۳ کاراکتر باشد.",
        organizationNameTooLong: "نام سازمان باید حداکثر ۸۰ کاراکتر باشد.",
        displayNameTooLong: "نام نمایشی باید حداکثر ۸۰ کاراکتر باشد.",
        descriptionTooLong: "توضیحات باید حداکثر ۳۰۰ کاراکتر باشد.",
        emailInvalid: "لطفاً یک ایمیل معتبر وارد کنید.",
        emailExists: "این ایمیل قبلاً ثبت شده است.",
        phoneTooLong: "شماره تلفن باید حداکثر ۲۰ کاراکتر باشد.",
        websiteInvalid: "لطفاً یک آدرس وبسایت معتبر وارد کنید.",
        timezoneRequired: "انتخاب منطقه زمانی الزامی است.",
        languageRequired: "انتخاب زبان الزامی است.",
        addressTooLong: "آدرس باید حداکثر ۳۰۰ کاراکتر باشد.",
        fileInvalidType: "فرمت فایل پشتیبانی نمی‌شود.",
        fileTooLarge: "حجم فایل نباید بیشتر از ۲ مگابایت باشد.",
        primaryColorInvalid: "رنگ اصلی نامعتبر است.",
        secondaryColorInvalid: "رنگ ثانویه نامعتبر است.",
      },
      general: {
        title: "تنظیمات عمومی",
        description: "اطلاعات پایه و ترجیحات پیش‌فرض سازمان را مدیریت کنید.",
        organizationSection: "اطلاعات سازمان",
        contactSection: "اطلاعات تماس",
        locationSection: "موقعیت و ترجیحات",
        organizationName: "نام سازمان",
        displayName: "نام نمایشی",
        descriptionLabel: "توضیح کوتاه",
        email: "ایمیل سازمان",
        phone: "شماره تلفن",
        website: "وبسایت",
        country: "کشور",
        countryPlaceholder: "انتخاب کشور",
        city: "شهر",
        timezone: "منطقه زمانی",
        language: "زبان پیش‌فرض",
        successToast: "اطلاعات با موفقیت ذخیره شد.",
      },
      profile: {
        title: "پروفایل سازمان",
        description: "اطلاعات عمومی سازمان که برای متقاضیان نمایش داده می‌شود.",
        identitySection: "هویت سازمان",
        contactSection: "اطلاعات تماس",
        logo: "لوگوی سازمان",
        logoEmpty: "بدون لوگو",
        uploadLogo: "آپلود لوگو",
        removeLogo: "حذف لوگو",
        organizationName: "نام سازمان",
        email: "ایمیل تماس",
        phone: "شماره تلفن",
        website: "وبسایت",
        address: "آدرس",
        successToast: "پروفایل سازمان با موفقیت به‌روزرسانی شد.",
      },
      branding: {
        title: "برندینگ",
        description: "هویت بصری سازمان را در صفحات عمومی شخصی‌سازی کنید.",
        logoSection: "لوگوی سازمان",
        colorsSection: "رنگ‌های برند",
        previewSection: "پیش‌نمایش زنده",
        primaryLogo: "لوگوی اصلی",
        darkLogo: "لوگوی حالت تاریک",
        logoEmpty: "بدون لوگو",
        uploadLogo: "آپلود لوگو",
        removeLogo: "حذف لوگو",
        primaryColor: "رنگ اصلی",
        secondaryColor: "رنگ ثانویه",
        previewHeader: "هدر صفحه عمومی",
        previewJobTitle: "توسعه‌دهنده فرانت‌اند",
        previewJobDescription: "نمونه کارت فرصت شغلی با برند سازمان شما.",
        previewCta: "ارسال درخواست",
        successToast: "تنظیمات برندینگ با موفقیت به‌روزرسانی شد.",
      },
      notifications: {
        title: "اعلان‌ها",
        description: "رویدادهایی که باید ایمیل دریافت کنید را انتخاب کنید.",
        newCandidateTitle: "متقاضی جدید",
        newCandidateDescription:
          "هنگام ارسال درخواست توسط متقاضی جدید ایمیل دریافت کنید.",
        candidateStatusTitle: "تغییر وضعیت متقاضی",
        candidateStatusDescription:
          "هنگام تغییر وضعیت استخدام متقاضی ایمیل دریافت کنید.",
        interviewReminderTitle: "یادآوری مصاحبه",
        interviewReminderDescription:
          "قبل از مصاحبه‌های زمان‌بندی‌شده ایمیل یادآوری دریافت کنید.",
        jobExpirationTitle: "یادآوری انقضای فرصت شغلی",
        jobExpirationDescription:
          "۳ روز قبل از انقضای فرصت شغلی منتشرشده ایمیل دریافت کنید.",
        jobPublishedTitle: "انتشار موفق فرصت شغلی",
        jobPublishedDescription:
          "پس از انتشار موفق یک فرصت شغلی ایمیل تأیید دریافت کنید.",
        successToast: "تنظیمات اعلان‌ها با موفقیت به‌روزرسانی شد.",
      },
      changePassword: {
        title: "تغییر رمز عبور",
        description: "برای به‌روزرسانی رمز عبور، رمز فعلی را وارد کنید.",
        currentPassword: "رمز عبور فعلی",
        newPassword: "رمز عبور جدید",
        confirmPassword: "تکرار رمز عبور جدید",
        submit: "تغییر رمز عبور",
        successToast: "رمز عبور با موفقیت تغییر کرد.",
        errors: {
          currentRequired: "رمز عبور فعلی الزامی است.",
          currentIncorrect: "رمز عبور فعلی اشتباه است.",
          passwordTooShort: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
          passwordsDoNotMatch: "رمز عبور و تکرار رمز عبور یکسان نیست.",
          samePassword: "رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد.",
          tooManyRequests:
            "تعداد تلاش‌ها بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
        },
      },
    },
    jobs: {
      create: {
        title: "ایجاد فرصت شغلی",
        description:
          "جزئیات موقعیت شغلی را وارد کنید و به عنوان پیش‌نویس ذخیره کنید.",
        saveDraft: "ذخیره پیش‌نویس",
        saving: "در حال ذخیره...",
        cancel: "انصراف",
        successToast: "فرصت شغلی با موفقیت ایجاد شد.",
        basicSection: "اطلاعات پایه",
        salarySection: "اطلاعات حقوق",
        descriptionSection: "شرح شغل",
        skillsSection: "مهارت‌ها",
        hiringSection: "اطلاعات استخدام",
        aiSection: "تولید با هوش مصنوعی",
        templateSection: "قالب شغلی",
        titleLabel: "عنوان شغلی",
        departmentLabel: "دپارتمان",
        departmentPlaceholder: "مثلاً مهندسی",
        employmentTypeLabel: "نوع همکاری",
        workplaceTypeLabel: "نوع محل کار",
        locationLabel: "موقعیت مکانی",
        locationPlaceholder: "مثلاً تهران",
        salaryMinLabel: "حداقل حقوق",
        salaryMaxLabel: "حداکثر حقوق",
        currencyLabel: "واحد پول",
        salaryVisibilityLabel: "نمایش حقوق",
        descriptionLabel: "توضیحات",
        responsibilitiesLabel: "مسئولیت‌ها",
        requirementsLabel: "نیازمندی‌ها",
        benefitsLabel: "مزایا",
        skillsLabel: "مهارت‌های مورد نیاز",
        skillsPlaceholder: "مهارت را بنویسید و Enter بزنید",
        skillsAdd: "افزودن",
        positionsLabel: "تعداد موقعیت",
        expirationDateLabel: "تاریخ انقضا",
        templateLabel: "انتخاب قالب",
        templatePlaceholder: "بدون قالب",
        templateEmpty: "قالبی برای انتخاب وجود ندارد.",
        aiPromptLabel: "توضیح کوتاه برای تولید",
        aiPromptPlaceholder:
          "به دنبال یک Senior React Developer با ۵ سال تجربه هستیم.",
        aiGenerate: "تولید محتوا",
        aiGenerating: "در حال تولید...",
        selectPlaceholder: "انتخاب کنید",
        employmentTypes: {
          FULL_TIME: "تمام‌وقت",
          PART_TIME: "پاره‌وقت",
          CONTRACT: "قراردادی",
          INTERNSHIP: "کارآموزی",
          TEMPORARY: "موقت",
        },
        workplaceTypes: {
          ON_SITE: "حضوری",
          HYBRID: "ترکیبی",
          REMOTE: "دورکاری",
        },
        salaryVisibility: {
          visible: "نمایش داده شود",
          hidden: "مخفی باشد",
        },
        unsaved: {
          title: "تغییرات ذخیره‌نشده",
          description:
            "تغییرات شما ذخیره نشده است. آیا می‌خواهید صفحه را ترک کنید؟",
          stay: "ماندن در صفحه",
          leave: "ترک صفحه",
        },
        errors: {
          unexpected: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
          titleRequired: "عنوان شغلی الزامی است.",
          titleTooShort: "عنوان شغلی باید حداقل ۳ کاراکتر باشد.",
          titleTooLong: "عنوان شغلی باید حداکثر ۱۰۰ کاراکتر باشد.",
          departmentTooLong: "دپارتمان باید حداکثر ۸۰ کاراکتر باشد.",
          employmentTypeRequired: "نوع همکاری الزامی است.",
          workplaceTypeRequired: "نوع محل کار الزامی است.",
          locationTooLong: "موقعیت مکانی باید حداکثر ۱۲۰ کاراکتر باشد.",
          salaryMinInvalid: "حداقل حقوق نامعتبر است.",
          salaryMaxInvalid: "حداکثر حقوق نامعتبر است.",
          salaryRangeInvalid: "حداکثر حقوق باید بیشتر از حداقل باشد.",
          currencyInvalid: "واحد پول نامعتبر است.",
          salaryVisibilityRequired: "وضعیت نمایش حقوق الزامی است.",
          descriptionRequired: "توضیحات الزامی است.",
          descriptionTooShort: "توضیحات باید حداقل ۵۰ کاراکتر باشد.",
          skillTooLong: "نام مهارت باید حداکثر ۸۰ کاراکتر باشد.",
          skillsTooMany: "حداکثر ۵۰ مهارت مجاز است.",
          positionsInvalid: "تعداد موقعیت نامعتبر است.",
          positionsTooLow: "تعداد موقعیت باید حداقل ۱ باشد.",
          positionsTooHigh: "تعداد موقعیت باید حداکثر ۹۹۹ باشد.",
          expirationDateInvalid: "تاریخ انقضا نامعتبر است.",
          expirationDateInPast: "تاریخ انقضا نمی‌تواند قبل از امروز باشد.",
          promptTooShort: "توضیح کوتاه باید حداقل ۱۰ کاراکتر باشد.",
          promptTooLong: "توضیح کوتاه باید حداکثر ۵۰۰ کاراکتر باشد.",
          tooManyRequests:
            "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
        },
      },
      list: {
        title: "فرصت‌های شغلی",
        description: "مدیریت و مشاهده همه فرصت‌های شغلی سازمان.",
        create: "ایجاد فرصت شغلی",
        empty: "هنوز فرصت شغلی‌ای ایجاد نشده است.",
        loadFailed: "بارگذاری فهرست فرصت‌های شغلی با خطا مواجه شد.",
        retry: "تلاش مجدد",
        columns: {
          title: "عنوان",
          status: "وضعیت",
          candidateCount: "متقاضیان",
          createdAt: "تاریخ ایجاد",
          actions: "عملیات",
        },
        actions: {
          details: "جزئیات",
          edit: "ویرایش",
        },
        pagination: {
          previous: "قبلی",
          next: "بعدی",
          summary: "نمایش {from} تا {to} از {total}",
        },
        errors: {
          unexpected: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        },
      },
      edit: {
        title: "ویرایش فرصت شغلی",
        description: "اطلاعات فرصت شغلی را به‌روزرسانی کنید.",
        save: "ذخیره تغییرات",
        saving: "در حال ذخیره...",
        reset: "بازنشانی",
        cancel: "انصراف",
        retry: "تلاش مجدد",
        loadFailed: "بارگذاری فرصت شغلی با خطا مواجه شد.",
        successToast: "فرصت شغلی با موفقیت به‌روزرسانی شد.",
      },
      details: {
        title: "جزئیات فرصت شغلی",
        notFound: "فرصت شغلی یافت نشد.",
        loadFailed: "بارگذاری جزئیات فرصت شغلی با خطا مواجه شد.",
        retry: "تلاش مجدد",
        backToJobs: "بازگشت به فرصت‌های شغلی",
        emptyValue: "—",
        infoTitle: "اطلاعات شغل",
        candidatesTitle: "خلاصه متقاضیان",
        publicTitle: "اطلاعات عمومی",
        salaryLabel: "حقوق",
        salaryHidden: "مخفی",
        publicUrl: "لینک عمومی",
        publishedAt: "تاریخ انتشار",
        totalCandidates: "تعداد کل متقاضیان",
        latestCandidate: "آخرین متقاضی",
        noCandidates: "هنوز متقاضی‌ای درخواست نداده است.",
        linkCopiedToast: "لینک عمومی کپی شد.",
        expiredBadge: "منقضی شده",
        expiresOn: "تاریخ انقضا: {date}",
        expiredOn: "منقضی شده در {date}",
        actions: {
          edit: "ویرایش",
          publish: "انتشار",
          unpublish: "لغو انتشار",
          delete: "حذف",
          viewCandidates: "مشاهده متقاضیان",
          viewAllCandidates: "مشاهده همه متقاضیان",
          copyLink: "کپی لینک",
          linkCopied: "کپی شد",
          viewPublic: "مشاهده صفحه عمومی",
        },
        publish: {
          title: "انتشار فرصت شغلی",
          description:
            "این فرصت شغلی به‌صورت عمومی در دسترس قرار می‌گیرد و متقاضیان می‌توانند درخواست ارسال کنند.",
          cancel: "انصراف",
          confirm: "انتشار",
          confirming: "در حال انتشار...",
          successToast: "فرصت شغلی با موفقیت منتشر شد.",
          notPublishable:
            "برای انتشار، فیلدهای الزامی فرصت شغلی را تکمیل کنید.",
        },
        unpublish: {
          title: "لغو انتشار فرصت شغلی",
          description:
            "این فرصت شغلی دیگر به‌صورت عمومی در دسترس نخواهد بود و متقاضیان نمی‌توانند درخواست جدید ارسال کنند.",
          cancel: "انصراف",
          confirm: "لغو انتشار",
          confirming: "در حال لغو انتشار...",
          successToast: "انتشار فرصت شغلی لغو شد.",
        },
        delete: {
          title: "حذف فرصت شغلی",
          description:
            "آیا مطمئن هستید که می‌خواهید این فرصت شغلی را برای همیشه حذف کنید؟ این عمل قابل بازگشت نیست.",
          cancel: "انصراف",
          confirm: "حذف",
          confirming: "در حال حذف...",
          successToast: "فرصت شغلی با موفقیت حذف شد.",
          hasCandidates:
            "این فرصت شغلی متقاضی دارد و قابل حذف نیست. به‌جای آن آن را بایگانی کنید.",
        },
        stats: {
          applications: "کل درخواست‌ها",
          newApplications: "درخواست‌های جدید",
          interviews: "مصاحبه‌ها",
          hired: "استخدام‌شده‌ها",
        },
        errors: {
          unexpected: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        },
      },
    },
    verifyEmail: {
      title: "تأیید ایمیل",
      description: "لینک تأیید ایمیل دریافت شد.",
      tokenReceived:
        "توکن تأیید شناسایی شد. تکمیل تأیید ایمیل به زودی فعال می شود.",
      missingToken: "لینک تأیید نامعتبر است یا توکن ندارد.",
      loginLink: "بازگشت به ورود",
    },
  },
  en: {
    languageLabel: "English",
    switchLanguageLabel: "فارسی",
    heroBadge: "Intelligent hiring for growing teams",
    heroTitle: "Poyino helps you discover the right talent faster and with more confidence.",
    heroDescription:
      "Poyino is an AI-powered recruitment platform that brings job publishing, resume intake, automated analysis, and early candidate evaluation into one simple workflow.",
    primaryCta: "Register Organization",
    secondaryCta: "See the Poyino Approach",
    socialProofLabel: "Brand promise",
    socialProofValue: "Discover the right talent with clarity, speed, and human control",
    highlightsTitle: "Why Poyino",
    highlightsDescription:
      "The product experience is built on simplicity, speed, and trust so hiring teams can make better decisions without tool chaos.",
    highlights: [
      {
        title: "One path for application intake",
        description:
          "Create a public link for every role and receive all applicants in one organized workspace.",
      },
      {
        title: "AI-assisted early review",
        description:
          "Resume extraction, summaries, and early matching help reduce repetitive manual work.",
      },
      {
        title: "Human control stays central",
        description:
          "AI recommends and organizes, while hiring decisions remain with your team.",
      },
    ],
    workflowTitle: "A workflow that stays clear",
    workflowDescription:
      "Each part of the experience should make it obvious where you are, what you can do, and what comes next.",
    workflowSteps: [
      {
        title: "1. Publish a job",
        description:
          "Create the role once and share a public application link wherever candidates discover it.",
      },
      {
        title: "2. Collect and analyze resumes",
        description:
          "Applications from different channels arrive in one place and become easier to review quickly.",
      },
      {
        title: "3. Prioritize and move forward",
        description:
          "Compare candidates faster, gain better context, and move into later stages with confidence.",
      },
    ],
    trustTitle: "Designed for trust and focus",
    trustDescription:
      "The tone, palette, and structure should express the calm, professional, and precise personality of Poyino.",
    trustItems: [
      "Minimal and low-friction interface",
      "Strong emphasis on clarity, structure, and readability",
      "Brand-led colors that reinforce trust and stability",
    ],
    metrics: [
      { value: "1", label: "focused workspace for applicant management" },
      { value: "AI", label: "assistive analysis that cuts manual work" },
      { value: "100%", label: "final decision-making kept with humans" },
    ],
    finalCtaTitle: "Better hiring starts with a better experience.",
    finalCtaDescription:
      "If you want to make recruiting simpler, faster, and more precise, Poyino can be a strong starting point for your team.",
    finalCtaButton: "Register Organization",
    loginNav: "Log in",
    footer: {
      product: "Product",
      company: "Organization",
      highlights: "Why Poyino",
      workflow: "Workflow",
      trust: "Trust",
      register: "Register",
      login: "Log in",
      rights: "All rights reserved.",
      tagline: "Intelligent hiring with clarity, speed, and human control.",
    },
    register: {
      title: "Organization Registration",
      description: "Create your organization and its first administrator account.",
      organizationNameLabel: "Organization Name",
      organizationNamePlaceholder: "Organization Name",
      emailLabel: "Email",
      emailPlaceholder: "example@company.com",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      showPassword: "Show",
      hidePassword: "Hide",
      submit: "Register",
      submitting: "Registering...",
      haveAccount: "Already have an account?",
      loginLink: "Log in",
      successToast: "Registration successful. Please verify your email.",
      errors: {
        organizationNameRequired: "Organization name is required.",
        organizationNameTooShort: "Organization name must be at least 3 characters.",
        organizationNameTooLong: "Organization name must be at most 80 characters.",
        emailInvalid: "Please enter a valid email address.",
        emailExists: "This email is already registered.",
        passwordTooShort: "Password must be at least 6 characters.",
        passwordsDoNotMatch: "Password and confirmation do not match.",
        unexpected: "Something went wrong. Please try again.",
      },
    },
    login: {
      title: "Log in",
      description: "You can sign in after verifying your email.",
      emailLabel: "Email",
      emailPlaceholder: "example@company.com",
      passwordLabel: "Password",
      showPassword: "Show",
      hidePassword: "Hide",
      submit: "Log in",
      submitting: "Signing in...",
      forgotPasswordLink: "Forgot password?",
      noAccount: "Don't have an account?",
      registerLink: "Register organization",
      errors: {
        emailInvalid: "Please enter a valid email address.",
        passwordTooShort: "Password must be at least 6 characters.",
        invalidCredentials: "Invalid email or password.",
        emailNotVerified:
          "Your account is not activated yet. Please check your email.",
        tooManyRequests:
          "Too many login attempts. Please try again in a few minutes.",
        unexpected: "Something went wrong. Please try again.",
      },
    },
    forgotPassword: {
      title: "Forgot password",
      description: "Enter your account email and we will send a reset link.",
      emailLabel: "Email",
      emailPlaceholder: "example@company.com",
      submit: "Send reset link",
      submitting: "Sending...",
      loginLink: "Back to login",
      successToast:
        "If an account exists, a password reset link has been sent to you.",
      errors: {
        emailInvalid: "Please enter a valid email address.",
        tooManyRequests:
          "Too many password reset requests. Please try again in a few minutes.",
        unexpected: "Something went wrong. Please try again.",
      },
    },
    resetPassword: {
      title: "Reset password",
      description: "Enter your new password below.",
      passwordLabel: "New password",
      confirmPasswordLabel: "Confirm password",
      showPassword: "Show",
      hidePassword: "Hide",
      submit: "Reset password",
      submitting: "Resetting...",
      validatingToken: "Validating your reset link...",
      loginLink: "Back to login",
      forgotPasswordLink: "Request a new link",
      successToast: "Your password was updated. You can sign in now.",
      errors: {
        missingToken: "This reset link is invalid.",
        invalidToken: "This reset link is invalid.",
        expiredToken: "This reset link has expired.",
        passwordTooShort: "Password must be at least 6 characters.",
        passwordsDoNotMatch: "Password and confirmation do not match.",
        tooManyRequests:
          "Too many password reset attempts. Please try again in a few minutes.",
        unexpected: "Something went wrong. Please try again.",
      },
    },
    dashboard: {
      title: "Dashboard",
      description: "Welcome to your Poyino workspace.",
      welcome: "You have signed in successfully.",
      homeLink: "Back to home",
      sidebarLabel: "Main navigation",
      openSidebar: "Open menu",
      closeSidebar: "Close menu",
      placeholder: "This module is coming soon.",
      placeholderHint: "The selected module is not implemented in this release yet.",
      nav: {
        overview: "Dashboard",
        jobs: "Jobs",
        createJob: "Create job",
        jobList: "Job list",
        candidates: "Candidates",
        interviews: "Interviews",
        reports: "Reports",
        settings: "Settings",
      },
      sidebar: {
        organizationFallback: "Organization",
        collapse: "Collapse sidebar",
        expand: "Expand sidebar",
      },
      userMenu: {
        profile: "Profile",
        settings: "Settings",
        logout: "Log out",
      },
      logout: {
        title: "Log out",
        description: "Are you sure you want to log out of your account?",
        cancel: "Cancel",
        confirm: "Log out",
        confirming: "Logging out...",
      },
      statistics: {
        title: "Hiring statistics",
        totalJobs: "Total jobs",
        totalJobsDescription: "All created job postings",
        activeJobs: "Active jobs",
        activeJobsDescription: "Currently published jobs",
        totalCandidates: "Total candidates",
        totalCandidatesDescription: "All submitted applications",
        totalHired: "Total hired",
        totalHiredDescription: "Candidates with hired status",
        loadError: "Unable to load statistics.",
      },
      jobs: {
        title: "Recent job posts",
        description: "The latest 10 jobs in your organization.",
        empty: "No job postings yet.",
        create: "Create job",
        view: "View",
        edit: "Edit",
        columns: {
          title: "Job title",
          status: "Status",
          publishedAt: "Published date",
          candidateCount: "Candidates",
          actions: "Actions",
        },
      },
      candidates: {
        title: "Recent candidates",
        description: "The latest 10 submitted candidates.",
        empty: "No candidates have applied yet.",
        view: "View candidate",
        viewAll: "View all",
        analyzing: "Analyzing...",
        columns: {
          name: "Candidate",
          job: "Applied job",
          aiScore: "AI score",
          status: "Status",
          appliedAt: "Applied date",
          actions: "Actions",
        },
      },
      jobStatus: {
        DRAFT: "Draft",
        PUBLISHED: "Published",
        ARCHIVED: "Archived",
      },
      candidateStatus: {
        APPLIED: "Applied",
        REVIEWING: "Reviewing",
        INTERVIEW_SCHEDULED: "Interview scheduled",
        INTERVIEW_PASSED: "Interview passed",
        REJECTED: "Rejected",
        HIRED: "Hired",
      },
      error: {
        title: "Unable to load dashboard",
        description: "Something went wrong while loading dashboard data.",
        retry: "Retry",
      },
    },
    settings: {
      title: "Settings",
      description: "Manage organization details, branding, and notifications.",
      tabsLabel: "Settings sections",
      tabs: {
        general: "General",
        profile: "Profile",
        branding: "Branding",
        notifications: "Notifications",
      },
      save: "Save changes",
      saving: "Saving...",
      reset: "Reset",
      retry: "Retry",
      unsaved: {
        title: "Unsaved changes",
        description: "You have unsaved changes. Do you want to leave this page?",
        stay: "Stay",
        leave: "Leave",
      },
      languages: {
        persian: "Persian",
        english: "English",
      },
      countries: {
        iran: "Iran",
        uae: "United Arab Emirates",
        turkey: "Turkey",
        germany: "Germany",
        uk: "United Kingdom",
        usa: "United States",
        canada: "Canada",
        other: "Other",
      },
      errors: {
        unexpected: "Something went wrong. Please try again.",
        loadFailed: "Unable to load settings.",
        organizationNameRequired: "Organization name is required.",
        organizationNameTooShort:
          "Organization name must be at least 3 characters.",
        organizationNameTooLong:
          "Organization name must be at most 80 characters.",
        displayNameTooLong: "Display name must be at most 80 characters.",
        descriptionTooLong: "Description must be at most 300 characters.",
        emailInvalid: "Please enter a valid email address.",
        emailExists: "This email is already registered.",
        phoneTooLong: "Phone number must be at most 20 characters.",
        websiteInvalid: "Please enter a valid website URL.",
        timezoneRequired: "Timezone is required.",
        languageRequired: "Language is required.",
        addressTooLong: "Address must be at most 300 characters.",
        fileInvalidType: "Unsupported file format.",
        fileTooLarge: "File size must be at most 2 MB.",
        primaryColorInvalid: "Primary color is invalid.",
        secondaryColorInvalid: "Secondary color is invalid.",
      },
      general: {
        title: "General settings",
        description:
          "Manage your organization's basic information and default preferences.",
        organizationSection: "Organization information",
        contactSection: "Contact information",
        locationSection: "Location and preferences",
        organizationName: "Organization name",
        displayName: "Display name",
        descriptionLabel: "Short description",
        email: "Organization email",
        phone: "Phone number",
        website: "Website",
        country: "Country",
        countryPlaceholder: "Select a country",
        city: "City",
        timezone: "Timezone",
        language: "Default language",
        successToast: "Settings saved successfully.",
      },
      profile: {
        title: "Organization profile",
        description:
          "Public-facing organization details shown to applicants.",
        identitySection: "Organization identity",
        contactSection: "Contact information",
        logo: "Organization logo",
        logoEmpty: "No logo",
        uploadLogo: "Upload logo",
        removeLogo: "Remove logo",
        organizationName: "Organization name",
        email: "Contact email",
        phone: "Phone number",
        website: "Website",
        address: "Address",
        successToast: "Organization profile updated successfully.",
      },
      branding: {
        title: "Branding",
        description:
          "Customize your organization's visual identity across public pages.",
        logoSection: "Organization logo",
        colorsSection: "Brand colors",
        previewSection: "Live preview",
        primaryLogo: "Primary logo",
        darkLogo: "Dark mode logo",
        logoEmpty: "No logo",
        uploadLogo: "Upload logo",
        removeLogo: "Remove logo",
        primaryColor: "Primary color",
        secondaryColor: "Secondary color",
        previewHeader: "Public page header",
        previewJobTitle: "Frontend Developer",
        previewJobDescription: "Sample job card using your organization branding.",
        previewCta: "Apply now",
        successToast: "Branding settings have been updated successfully.",
      },
      notifications: {
        title: "Notifications",
        description: "Choose which events should send email notifications.",
        newCandidateTitle: "New candidate applied",
        newCandidateDescription:
          "Receive an email whenever a new candidate submits an application.",
        candidateStatusTitle: "Candidate status changed",
        candidateStatusDescription:
          "Receive an email when a candidate's hiring status changes.",
        interviewReminderTitle: "Upcoming interview reminder",
        interviewReminderDescription:
          "Receive an email before scheduled interviews.",
        jobExpirationTitle: "Job expiration reminder",
        jobExpirationDescription:
          "Receive an email 3 days before a published job expires.",
        jobPublishedTitle: "Job published successfully",
        jobPublishedDescription:
          "Receive confirmation after publishing a job.",
        successToast: "Notification settings have been updated successfully.",
      },
      changePassword: {
        title: "Change password",
        description: "Enter your current password to set a new one.",
        currentPassword: "Current password",
        newPassword: "New password",
        confirmPassword: "Confirm new password",
        submit: "Change password",
        successToast: "Password changed successfully.",
        errors: {
          currentRequired: "Current password is required.",
          currentIncorrect: "Current password is incorrect.",
          passwordTooShort: "Password must be at least 6 characters.",
          passwordsDoNotMatch: "Password and confirmation do not match.",
          samePassword: "New password must be different from the current password.",
          tooManyRequests:
            "Too many attempts. Please try again in a few minutes.",
        },
      },
    },
    jobs: {
      create: {
        title: "Create job",
        description: "Fill in the role details and save it as a draft.",
        saveDraft: "Save draft",
        saving: "Saving...",
        cancel: "Cancel",
        successToast: "Job created successfully.",
        basicSection: "Basic information",
        salarySection: "Salary information",
        descriptionSection: "Job description",
        skillsSection: "Skills",
        hiringSection: "Hiring information",
        aiSection: "AI assisted generation",
        templateSection: "Job template",
        titleLabel: "Job title",
        departmentLabel: "Department",
        departmentPlaceholder: "e.g. Engineering",
        employmentTypeLabel: "Employment type",
        workplaceTypeLabel: "Workplace type",
        locationLabel: "Location",
        locationPlaceholder: "e.g. Tehran",
        salaryMinLabel: "Minimum salary",
        salaryMaxLabel: "Maximum salary",
        currencyLabel: "Currency",
        salaryVisibilityLabel: "Salary visibility",
        descriptionLabel: "Description",
        responsibilitiesLabel: "Responsibilities",
        requirementsLabel: "Requirements",
        benefitsLabel: "Benefits",
        skillsLabel: "Required skills",
        skillsPlaceholder: "Type a skill and press Enter",
        skillsAdd: "Add",
        positionsLabel: "Number of positions",
        expirationDateLabel: "Expiration date",
        templateLabel: "Choose template",
        templatePlaceholder: "No template",
        templateEmpty: "No templates available yet.",
        aiPromptLabel: "Short description for generation",
        aiPromptPlaceholder:
          "We are looking for a Senior React Developer with 5 years of experience.",
        aiGenerate: "Generate content",
        aiGenerating: "Generating...",
        selectPlaceholder: "Select an option",
        employmentTypes: {
          FULL_TIME: "Full time",
          PART_TIME: "Part time",
          CONTRACT: "Contract",
          INTERNSHIP: "Internship",
          TEMPORARY: "Temporary",
        },
        workplaceTypes: {
          ON_SITE: "On-site",
          HYBRID: "Hybrid",
          REMOTE: "Remote",
        },
        salaryVisibility: {
          visible: "Visible",
          hidden: "Hidden",
        },
        unsaved: {
          title: "Unsaved changes",
          description: "You have unsaved changes. Do you want to leave this page?",
          stay: "Stay",
          leave: "Leave",
        },
        errors: {
          unexpected: "Something went wrong. Please try again.",
          titleRequired: "Job title is required.",
          titleTooShort: "Job title must be at least 3 characters.",
          titleTooLong: "Job title must be at most 100 characters.",
          departmentTooLong: "Department must be at most 80 characters.",
          employmentTypeRequired: "Employment type is required.",
          workplaceTypeRequired: "Workplace type is required.",
          locationTooLong: "Location must be at most 120 characters.",
          salaryMinInvalid: "Minimum salary is invalid.",
          salaryMaxInvalid: "Maximum salary is invalid.",
          salaryRangeInvalid: "Maximum salary must be greater than minimum.",
          currencyInvalid: "Currency is invalid.",
          salaryVisibilityRequired: "Salary visibility is required.",
          descriptionRequired: "Description is required.",
          descriptionTooShort: "Description must be at least 50 characters.",
          skillTooLong: "Skill name must be at most 80 characters.",
          skillsTooMany: "You can add at most 50 skills.",
          positionsInvalid: "Number of positions is invalid.",
          positionsTooLow: "Number of positions must be at least 1.",
          positionsTooHigh: "Number of positions must be at most 999.",
          expirationDateInvalid: "Expiration date is invalid.",
          expirationDateInPast: "Expiration date cannot be earlier than today.",
          promptTooShort: "Prompt must be at least 10 characters.",
          promptTooLong: "Prompt must be at most 500 characters.",
          tooManyRequests: "Too many requests. Please try again shortly.",
        },
      },
      list: {
        title: "Jobs",
        description: "View and manage all organization job postings.",
        create: "Create job",
        empty: "No jobs have been created yet.",
        loadFailed: "Unable to load the job list.",
        retry: "Retry",
        columns: {
          title: "Title",
          status: "Status",
          candidateCount: "Candidates",
          createdAt: "Created",
          actions: "Actions",
        },
        actions: {
          details: "Details",
          edit: "Edit",
        },
        pagination: {
          previous: "Previous",
          next: "Next",
          summary: "Showing {from} to {to} of {total}",
        },
        errors: {
          unexpected: "Something went wrong. Please try again.",
        },
      },
      edit: {
        title: "Edit job",
        description: "Update the job posting details.",
        save: "Save changes",
        saving: "Saving...",
        reset: "Reset",
        cancel: "Cancel",
        retry: "Retry",
        loadFailed: "Unable to load this job.",
        successToast: "Job updated successfully.",
      },
      details: {
        title: "Job details",
        notFound: "Job not found.",
        loadFailed: "Unable to load job details.",
        retry: "Retry",
        backToJobs: "Back to jobs",
        emptyValue: "—",
        infoTitle: "Job information",
        candidatesTitle: "Candidate summary",
        publicTitle: "Public information",
        salaryLabel: "Salary",
        salaryHidden: "Hidden",
        publicUrl: "Public URL",
        publishedAt: "Published date",
        totalCandidates: "Total candidates",
        latestCandidate: "Latest candidate",
        noCandidates: "No candidates have applied yet.",
        linkCopiedToast: "Public link copied.",
        expiredBadge: "Expired",
        expiresOn: "Expires on {date}",
        expiredOn: "Expired on {date}",
        actions: {
          edit: "Edit",
          publish: "Publish",
          unpublish: "Unpublish",
          delete: "Delete",
          viewCandidates: "View candidates",
          viewAllCandidates: "View all candidates",
          copyLink: "Copy link",
          linkCopied: "Copied",
          viewPublic: "View public page",
        },
        publish: {
          title: "Publish Job",
          description:
            "This job will become publicly available and candidates will be able to submit applications.",
          cancel: "Cancel",
          confirm: "Publish",
          confirming: "Publishing...",
          successToast: "Job published successfully.",
          notPublishable:
            "Complete the required job fields before publishing.",
        },
        unpublish: {
          title: "Unpublish Job",
          description:
            "This job will no longer be publicly available and candidates will not be able to submit new applications.",
          cancel: "Cancel",
          confirm: "Unpublish",
          confirming: "Unpublishing...",
          successToast: "Job unpublished successfully.",
        },
        delete: {
          title: "Delete Job",
          description:
            "Are you sure you want to permanently delete this job? This action cannot be undone.",
          cancel: "Cancel",
          confirm: "Delete",
          confirming: "Deleting...",
          successToast: "Job deleted successfully.",
          hasCandidates:
            "This job has submitted candidates and cannot be deleted. Archive it instead.",
        },
        stats: {
          applications: "Total applications",
          newApplications: "New applications",
          interviews: "Interview candidates",
          hired: "Hired candidates",
        },
        errors: {
          unexpected: "Something went wrong. Please try again.",
        },
      },
    },
    verifyEmail: {
      title: "Verify email",
      description: "Your email verification link was opened.",
      tokenReceived:
        "A verification token was detected. Full verification will be enabled soon.",
      missingToken: "This verification link is missing a token.",
      loginLink: "Back to login",
    },
  },
};
