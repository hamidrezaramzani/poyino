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
