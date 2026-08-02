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
    breadcrumbsLabel: string;
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
  candidates: {
    list: {
      title: string;
      description: string;
      searchPlaceholder: string;
      loadFailed: string;
      retry: string;
      empty: string;
      stats: {
        total: string;
        reviewing: string;
        interviewScheduled: string;
        hired: string;
        rejected: string;
      };
      filters: {
        statusLabel: string;
        allStatuses: string;
        experienceLevelLabel: string;
        allExperienceLevels: string;
        educationLabel: string;
        educationPlaceholder: string;
        dateRangeLabel: string;
        allDateRanges: string;
      };
      experienceLevels: {
        JUNIOR: string;
        MID: string;
        SENIOR: string;
      };
      dateRanges: {
        TODAY: string;
        LAST_7_DAYS: string;
        LAST_30_DAYS: string;
        CUSTOM: string;
      };
      columns: {
        name: string;
        position: string;
        aiScore: string;
        experience: string;
        skills: string;
        status: string;
        appliedAt: string;
        actions: string;
      };
      actions: {
        view: string;
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
    org: {
      title: string;
      description: string;
      loadFailed: string;
      retry: string;
      empty: string;
      columns: {
        name: string;
        job: string;
        aiScore: string;
        status: string;
        appliedAt: string;
        actions: string;
      };
      actions: {
        view: string;
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
    details: {
      title: string;
      notFound: string;
      loadFailed: string;
      retry: string;
      backToList: string;
      emptyValue: string;
      statusLabel: string;
      statusUpdated: string;
      actions: {
        scheduleInterview: string;
        downloadResume: string;
      };
      ai: {
        title: string;
        empty: string;
        matchScore: string;
        summary: string;
        strengths: string;
        weaknesses: string;
        missingSkills: string;
        interviewQuestions: string;
      };
      resume: {
        title: string;
        empty: string;
        download: string;
      };
      profile: {
        title: string;
        email: string;
        phone: string;
        currentPosition: string;
        yearsExperience: string;
        education: string;
        experience: string;
        skills: string;
        links: string;
        appliedAt: string;
      };
      notes: {
        title: string;
        empty: string;
        placeholder: string;
        add: string;
        adding: string;
        edit: string;
        save: string;
        cancel: string;
        delete: string;
        editedLabel: string;
        deleteConfirm: {
          title: string;
          description: string;
          cancel: string;
          confirm: string;
          confirming: string;
        };
      };
      timeline: {
        title: string;
        empty: string;
        events: {
          APPLICATION_SUBMITTED: string;
          RESUME_PROCESSED: string;
          AI_ANALYSIS_COMPLETED: string;
          STATUS_CHANGED: string;
          NOTE_ADDED: string;
          NOTE_UPDATED: string;
          NOTE_DELETED: string;
          INTERVIEW_SCHEDULED: string;
          INTERVIEW_UPDATED: string;
          INTERVIEW_CANCELLED: string;
          INTERVIEW_COMPLETED: string;
          INTERVIEW_STARTED: string;
          INTERVIEW_NO_SHOW: string;
          INTERVIEW_PROCESS_UPDATED: string;
        };
      };
      interviews: {
        title: string;
        empty: string;
        scheduleButton: string;
        manageButton: string;
        processStatus: string;
        editAction: string;
        cancelAction: string;
        completeAction: string;
        joinAction: string;
      };
      errors: {
        unexpected: string;
      };
    };
    interview: {
      types: {
        HR: string;
        TECHNICAL: string;
        TEAM_LEAD: string;
        MANAGER: string;
        FINAL: string;
        CUSTOM: string;
      };
      statuses: {
        SCHEDULED: string;
        IN_PROGRESS: string;
        COMPLETED: string;
        CANCELLED: string;
        NO_SHOW: string;
      };
      processStatuses: {
        WAITING: string;
        INTERVIEWING: string;
        PASSED: string;
        FAILED: string;
        HIRED: string;
      };
      results: {
        PASSED: string;
        FAILED: string;
        PENDING: string;
      };
      form: {
        createTitle: string;
        editTitle: string;
        nameLabel: string;
        namePlaceholder: string;
        dateTimeLabel: string;
        typeLabel: string;
        recruiterLabel: string;
        recruiterNone: string;
        locationLabel: string;
        locationPlaceholder: string;
        meetingUrlLabel: string;
        meetingUrlPlaceholder: string;
        internalNotesLabel: string;
        internalNotesPlaceholder: string;
        candidateNotesLabel: string;
        candidateNotesPlaceholder: string;
        notesLabel: string;
        notesPlaceholder: string;
        save: string;
        saving: string;
        cancel: string;
        conflictWarning: string;
        errors: {
          nameRequired: string;
          scheduledAtRequired: string;
          meetingUrlInvalid: string;
          notesTooLong: string;
          unexpected: string;
        };
      };
      cancelDialog: {
        title: string;
        description: string;
        cancel: string;
        confirm: string;
        confirming: string;
      };
      completeDialog: {
        title: string;
        description: string;
        resultLabel: string;
        notesLabel: string;
        notesPlaceholder: string;
        cancel: string;
        confirm: string;
        confirming: string;
      };
      toasts: {
        created: string;
        updated: string;
        cancelled: string;
        completed: string;
        hired: string;
        rejected: string;
        statusUpdated: string;
      };
      errors: {
        notEditable: string;
        unexpected: string;
      };
    };
    interviewsModule: {
      process: {
        title: string;
        backToProfile: string;
        scheduleStage: string;
        hire: string;
        reject: string;
        empty: string;
        loadFailed: string;
        retry: string;
      };
      ai: {
        title: string;
        promptLabel: string;
        promptPlaceholder: string;
        generate: string;
        regenerate: string;
        regenerating: string;
        stageLabel: string;
        preparing: string;
        generatingQuestions: string;
        buildingChecklist: string;
        failed: string;
        retry: string;
        objectives: string;
        technical: string;
        behavioral: string;
        followUp: string;
        strengths: string;
        weaknesses: string;
        missingSkills: string;
        checklist: string;
      };
      summary: {
        title: string;
        description: string;
        generate: string;
        regenerate: string;
        generating: string;
        failed: string;
        retry: string;
        emptyCompleted: string;
        executiveSummary: string;
        timeline: string;
        consensus: string;
        strengths: string;
        weaknesses: string;
        risks: string;
        outstandingQuestions: string;
        suggestedNextStep: string;
        advisoryNote: string;
      };
      calendar: {
        title: string;
        description: string;
        month: string;
        week: string;
        day: string;
        today: string;
        previous: string;
        next: string;
        filters: string;
        recruiter: string;
        job: string;
        type: string;
        status: string;
        all: string;
        todayTitle: string;
        upcomingTitle: string;
        emptyTitle: string;
        emptyDescription: string;
        loadFailed: string;
        retry: string;
        conflict: string;
        drawerTitle: string;
        openProfile: string;
        edit: string;
        complete: string;
        cancel: string;
        quickStatus: string;
      };
    };
  };
  analytics: {
    title: string;
    description: string;
    loadFailed: string;
    retry: string;
    empty: string;
    rangeLabel: string;
    ranges: {
      LAST_7_DAYS: string;
      LAST_30_DAYS: string;
      LAST_90_DAYS: string;
      LAST_YEAR: string;
      CUSTOM: string;
    };
    kpis: {
      totalJobs: string;
      activeJobs: string;
      totalApplications: string;
      totalCandidates: string;
      interviewsScheduled: string;
      hiredCandidates: string;
      rejectedCandidates: string;
      averageTimeToHireDays: string;
      averageTimeToHireEmpty: string;
    };
    charts: {
      trendsTitle: string;
      trendsDescription: string;
      statusDistributionTitle: string;
      funnelTitle: string;
      jobPerformanceTitle: string;
    };
    funnelStages: {
      APPLICATIONS: string;
      UNDER_REVIEW: string;
      INTERVIEW_SCHEDULED: string;
      INTERVIEW_COMPLETED: string;
      HIRED: string;
    };
    jobPerformance: {
      columns: {
        title: string;
        applications: string;
        interviews: string;
        hires: string;
        hireRate: string;
      };
      empty: string;
    };
  };
  verifyEmail: {
    title: string;
    description: string;
    tokenReceived: string;
    missingToken: string;
    loginLink: string;
  };
  publicJob: {
    applyNow: string;
    companyInfo: string;
    overview: string;
    description: string;
    responsibilities: string;
    requirements: string;
    benefits: string;
    employmentType: string;
    workplaceType: string;
    department: string;
    positions: string;
    publishedAt: string;
    expirationDate: string;
    location: string;
    expiredTitle: string;
    expiredDescription: string;
    notFoundTitle: string;
    notFoundDescription: string;
    loadFailed: string;
    retry: string;
    emptyValue: string;
    apply: {
      title: string;
      description: string;
      backToJob: string;
      uploadStep: string;
      reviewStep: string;
      uploadHint: string;
      chooseFile: string;
      resumeSelected: string;
      removeResume: string;
      uploading: string;
      continue: string;
      extractingTitle: string;
      extractingDescription: string;
      analyzingTitle: string;
      analyzingDescription: string;
      personalTitle: string;
      professionalTitle: string;
      linksTitle: string;
      fullName: string;
      email: string;
      phone: string;
      currentPosition: string;
      skills: string;
      skillsHint: string;
      experience: string;
      education: string;
      linkedin: string;
      portfolio: string;
      website: string;
      submit: string;
      submitting: string;
      errors: {
        resumeRequired: string;
        unsupportedFile: string;
        fileTooLarge: string;
        uploadFailed: string;
        extractionFailed: string;
        analysisFailed: string;
        fullNameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        phoneRequired: string;
        duplicate: string;
        unexpected: string;
      };
    };
    success: {
      title: string;
      description: string;
      summaryTitle: string;
      jobTitle: string;
      organization: string;
      submittedAt: string;
      trackingTitle: string;
      trackingHint: string;
      copyLink: string;
      linkCopied: string;
      openTracking: string;
      nextStepsTitle: string;
      nextSteps: string;
      keepSafe: string;
    };
    tracking: {
      title: string;
      statusTitle: string;
      timelineTitle: string;
      jobTitle: string;
      submittedTitle: string;
      lastUpdated: string;
      notFoundTitle: string;
      notFoundDescription: string;
      loadFailed: string;
      retry: string;
      fullName: string;
      email: string;
      phone: string;
      currentPosition: string;
      statusLabels: {
        APPLIED: string;
        REVIEWING: string;
        INTERVIEW_SCHEDULED: string;
        INTERVIEW_PASSED: string;
        HIRED: string;
        REJECTED: string;
      };
      statusDescriptions: {
        APPLIED: string;
        REVIEWING: string;
        INTERVIEW_SCHEDULED: string;
        INTERVIEW_PASSED: string;
        HIRED: string;
        REJECTED: string;
      };
      timelineSteps: {
        APPLIED: string;
        REVIEWING: string;
        INTERVIEW_SCHEDULED: string;
        INTERVIEW_PASSED: string;
        FINAL: string;
      };
    };
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
      breadcrumbsLabel: "مسیر صفحه",
      placeholder: "این بخش به زودی آماده می‌شود.",
      placeholderHint: "ماژول انتخاب‌شده هنوز در نسخه فعلی پیاده‌سازی نشده است.",
      nav: {
        overview: "داشبورد",
        jobs: "فرصت‌های شغلی",
        createJob: "ایجاد فرصت شغلی",
        jobList: "فهرست فرصت‌ها",
        candidates: "متقاضیان",
        interviews: "مصاحبه‌ها",
        reports: "تحلیل‌ها",
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
    candidates: {
      list: {
        title: "متقاضیان",
        description: "مشاهده، فیلتر و مدیریت متقاضیان این فرصت شغلی.",
        searchPlaceholder: "جستجو بر اساس نام، ایمیل یا مهارت...",
        loadFailed: "بارگذاری فهرست متقاضیان با خطا مواجه شد.",
        retry: "تلاش مجدد",
        empty: "هنوز متقاضی‌ای برای این فرصت شغلی ثبت نشده است.",
        stats: {
          total: "کل متقاضیان",
          reviewing: "در حال بررسی",
          interviewScheduled: "مصاحبه زمان‌بندی شده",
          hired: "استخدام شده",
          rejected: "رد شده",
        },
        filters: {
          statusLabel: "وضعیت",
          allStatuses: "همه وضعیت‌ها",
          experienceLevelLabel: "سطح تجربه",
          allExperienceLevels: "همه سطوح",
          educationLabel: "تحصیلات",
          educationPlaceholder: "مثلاً کارشناسی",
          dateRangeLabel: "بازه زمانی درخواست",
          allDateRanges: "همه بازه‌ها",
        },
        experienceLevels: {
          JUNIOR: "جونیور",
          MID: "میدسنیور",
          SENIOR: "سنیور",
        },
        dateRanges: {
          TODAY: "امروز",
          LAST_7_DAYS: "۷ روز گذشته",
          LAST_30_DAYS: "۳۰ روز گذشته",
          CUSTOM: "بازه دلخواه",
        },
        columns: {
          name: "متقاضی",
          position: "سمت فعلی",
          aiScore: "امتیاز هوش مصنوعی",
          experience: "تجربه",
          skills: "مهارت‌ها",
          status: "وضعیت",
          appliedAt: "تاریخ درخواست",
          actions: "اقدامات",
        },
        actions: {
          view: "مشاهده پروفایل",
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
      org: {
        title: "همه متقاضیان",
        description: "متقاضیان همه فرصت‌های شغلی سازمان شما.",
        loadFailed: "بارگذاری فهرست متقاضیان با خطا مواجه شد.",
        retry: "تلاش مجدد",
        empty: "هنوز هیچ متقاضی‌ای درخواست نداده است.",
        columns: {
          name: "متقاضی",
          job: "فرصت شغلی",
          aiScore: "امتیاز هوش مصنوعی",
          status: "وضعیت",
          appliedAt: "تاریخ درخواست",
          actions: "اقدامات",
        },
        actions: {
          view: "مشاهده پروفایل",
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
      details: {
        title: "پروفایل متقاضی",
        notFound: "متقاضی یافت نشد.",
        loadFailed: "بارگذاری پروفایل متقاضی با خطا مواجه شد.",
        retry: "تلاش مجدد",
        backToList: "بازگشت به فهرست متقاضیان",
        emptyValue: "—",
        statusLabel: "وضعیت",
        statusUpdated: "وضعیت متقاضی به‌روزرسانی شد.",
        actions: {
          scheduleInterview: "زمان‌بندی مصاحبه",
          downloadResume: "دانلود رزومه",
        },
        ai: {
          title: "تحلیل هوش مصنوعی",
          empty: "تحلیل هوش مصنوعی برای این متقاضی در دسترس نیست.",
          matchScore: "امتیاز تطبیق",
          summary: "خلاصه اجرایی",
          strengths: "نقاط قوت",
          weaknesses: "نقاط قابل بهبود",
          missingSkills: "مهارت‌های مورد نیاز اما موجود نیست",
          interviewQuestions: "پیشنهاد سؤالات مصاحبه",
        },
        resume: {
          title: "رزومه",
          empty: "رزومه‌ای بارگذاری نشده است.",
          download: "دانلود رزومه",
        },
        profile: {
          title: "اطلاعات متقاضی",
          email: "ایمیل",
          phone: "شماره تماس",
          currentPosition: "سمت فعلی",
          yearsExperience: "سال‌های تجربه",
          education: "تحصیلات",
          experience: "سوابق کاری",
          skills: "مهارت‌ها",
          links: "لینک‌ها",
          appliedAt: "تاریخ درخواست",
        },
        notes: {
          title: "یادداشت‌ها",
          empty: "هنوز یادداشتی ثبت نشده است.",
          placeholder: "یادداشت خود را بنویسید...",
          add: "افزودن یادداشت",
          adding: "در حال افزودن...",
          edit: "ویرایش",
          save: "ذخیره",
          cancel: "انصراف",
          delete: "حذف",
          editedLabel: "ویرایش شده",
          deleteConfirm: {
            title: "حذف یادداشت",
            description: "آیا از حذف این یادداشت اطمینان دارید؟",
            cancel: "انصراف",
            confirm: "حذف",
            confirming: "در حال حذف...",
          },
        },
        timeline: {
          title: "خط زمانی فعالیت‌ها",
          empty: "هنوز فعالیتی ثبت نشده است.",
          events: {
            APPLICATION_SUBMITTED: "درخواست ارسال شد",
            RESUME_PROCESSED: "رزومه پردازش شد",
            AI_ANALYSIS_COMPLETED: "تحلیل هوش مصنوعی تکمیل شد",
            STATUS_CHANGED: "وضعیت تغییر کرد",
            NOTE_ADDED: "یادداشت افزوده شد",
            NOTE_UPDATED: "یادداشت ویرایش شد",
            NOTE_DELETED: "یادداشت حذف شد",
            INTERVIEW_SCHEDULED: "مصاحبه زمان‌بندی شد",
            INTERVIEW_UPDATED: "مصاحبه ویرایش شد",
            INTERVIEW_CANCELLED: "مصاحبه لغو شد",
            INTERVIEW_COMPLETED: "مصاحبه برگزار شد",
            INTERVIEW_STARTED: "مصاحبه آغاز شد",
            INTERVIEW_NO_SHOW: "عدم حضور در مصاحبه",
            INTERVIEW_PROCESS_UPDATED: "فرآیند مصاحبه به‌روزرسانی شد",
          },
        },
        interviews: {
          title: "مصاحبه‌ها",
          empty: "هنوز مصاحبه‌ای زمان‌بندی نشده است.",
          scheduleButton: "زمان‌بندی مصاحبه",
          manageButton: "مدیریت فرآیند مصاحبه",
          processStatus: "وضعیت فرآیند",
          editAction: "ویرایش",
          cancelAction: "لغو",
          completeAction: "ثبت نتیجه",
          joinAction: "ورود به جلسه",
        },
        errors: {
          unexpected: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        },
      },
      interview: {
        types: {
          HR: "منابع انسانی",
          TECHNICAL: "فنی",
          TEAM_LEAD: "لید تیم",
          MANAGER: "مدیریتی",
          FINAL: "نهایی",
          CUSTOM: "سفارشی",
        },
        statuses: {
          SCHEDULED: "زمان‌بندی شده",
          IN_PROGRESS: "در حال برگزاری",
          COMPLETED: "برگزار شده",
          CANCELLED: "لغو شده",
          NO_SHOW: "عدم حضور",
        },
        processStatuses: {
          WAITING: "در انتظار",
          INTERVIEWING: "در حال مصاحبه",
          PASSED: "قبول",
          FAILED: "رد",
          HIRED: "استخدام",
        },
        results: {
          PASSED: "قبول",
          FAILED: "رد",
          PENDING: "در انتظار",
        },
        form: {
          createTitle: "زمان‌بندی مصاحبه",
          editTitle: "ویرایش مصاحبه",
          nameLabel: "نام مرحله",
          namePlaceholder: "مثلاً مصاحبه فنی اول",
          dateTimeLabel: "تاریخ و ساعت",
          typeLabel: "نوع مصاحبه",
          recruiterLabel: "مصاحبه‌کننده",
          recruiterNone: "بدون تخصیص",
          locationLabel: "محل برگزاری",
          locationPlaceholder: "مثلاً دفتر مرکزی یا لینک آنلاین",
          meetingUrlLabel: "لینک جلسه",
          meetingUrlPlaceholder: "https://...",
          internalNotesLabel: "یادداشت داخلی",
          internalNotesPlaceholder: "فقط برای تیم استخدام...",
          candidateNotesLabel: "یادداشت برای متقاضی",
          candidateNotesPlaceholder: "در صفحه پیگیری نمایش داده می‌شود...",
          notesLabel: "یادداشت",
          notesPlaceholder: "توضیحات یا نکات مصاحبه...",
          save: "ذخیره",
          saving: "در حال ذخیره...",
          cancel: "انصراف",
          conflictWarning: "تداخل زمانی برای این مصاحبه‌کننده شناسایی شد.",
          errors: {
            nameRequired: "نام مرحله الزامی است.",
            scheduledAtRequired: "تاریخ و ساعت مصاحبه الزامی است.",
            meetingUrlInvalid: "لینک جلسه معتبر نیست.",
            notesTooLong: "یادداشت باید حداکثر ۵۰۰۰ کاراکتر باشد.",
            unexpected: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
          },
        },
        cancelDialog: {
          title: "لغو مصاحبه",
          description: "آیا از لغو این مصاحبه اطمینان دارید؟",
          cancel: "انصراف",
          confirm: "لغو مصاحبه",
          confirming: "در حال لغو...",
        },
        completeDialog: {
          title: "ثبت نتیجه مصاحبه",
          description: "این مصاحبه به عنوان برگزار شده ثبت می‌شود.",
          resultLabel: "نتیجه",
          notesLabel: "یادداشت نتیجه (اختیاری)",
          notesPlaceholder: "خلاصه نتیجه مصاحبه...",
          cancel: "انصراف",
          confirm: "ثبت نتیجه",
          confirming: "در حال ثبت...",
        },
        toasts: {
          created: "مصاحبه با موفقیت زمان‌بندی شد.",
          updated: "مصاحبه با موفقیت به‌روزرسانی شد.",
          cancelled: "مصاحبه لغو شد.",
          completed: "نتیجه مصاحبه ثبت شد.",
          hired: "متقاضی استخدام شد.",
          rejected: "متقاضی رد شد.",
          statusUpdated: "وضعیت مصاحبه به‌روزرسانی شد.",
        },
        errors: {
          notEditable: "این مصاحبه دیگر قابل ویرایش نیست.",
          unexpected: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        },
      },
      interviewsModule: {
        process: {
          title: "فرآیند مصاحبه",
          backToProfile: "بازگشت به پروفایل",
          scheduleStage: "افزودن مرحله مصاحبه",
          hire: "استخدام",
          reject: "رد کردن",
          empty: "هنوز مرحله‌ای برای مصاحبه تعریف نشده است.",
          loadFailed: "بارگذاری فرآیند مصاحبه ناموفق بود.",
          retry: "تلاش مجدد",
        },
        ai: {
          title: "آماده‌سازی مصاحبه با هوش مصنوعی",
          promptLabel: "دستورالعمل اختیاری",
          promptPlaceholder: "مثلاً روی معماری سیستم تمرکز کن...",
          generate: "تولید راهنما",
          regenerate: "تولید مجدد",
          regenerating: "در حال تولید مجدد...",
          stageLabel: "مرحله مصاحبه",
          preparing: "در حال آماده‌سازی مصاحبه...",
          generatingQuestions: "در حال تولید سؤالات...",
          buildingChecklist: "در حال ساخت چک‌لیست ارزیابی...",
          failed: "امکان تولید آماده‌سازی مصاحبه وجود ندارد. لطفاً دوباره تلاش کنید.",
          retry: "تلاش مجدد",
          objectives: "اهداف مصاحبه",
          technical: "سؤالات فنی",
          behavioral: "سؤالات رفتاری",
          followUp: "سؤالات پیگیری",
          strengths: "نقاط قوت",
          weaknesses: "نقاط ضعف احتمالی",
          missingSkills: "مهارت‌های ناقص",
          checklist: "چک‌لیست ارزیابی",
        },
        summary: {
          title: "خلاصه فرآیند مصاحبه",
          description:
            "خلاصه هوش مصنوعی بر اساس مصاحبه‌های تکمیل‌شده و یادداشت‌های داخلی.",
          generate: "تولید خلاصه",
          regenerate: "تولید مجدد خلاصه",
          generating: "در حال تولید خلاصه مصاحبه...",
          failed: "امکان تولید خلاصه مصاحبه وجود ندارد. لطفاً دوباره تلاش کنید.",
          retry: "تلاش مجدد",
          emptyCompleted:
            "برای تولید خلاصه، حداقل یک مصاحبه تکمیل‌شده لازم است.",
          executiveSummary: "خلاصه اجرایی",
          timeline: "خلاصه مراحل مصاحبه",
          consensus: "اجماع مصاحبه‌کنندگان",
          strengths: "نقاط قوت",
          weaknesses: "نقاط ضعف",
          risks: "ریسک‌ها",
          outstandingQuestions: "سؤالات باقی‌مانده",
          suggestedNextStep: "پیشنهاد گام بعدی",
          advisoryNote: "این پیشنهاد صرفاً جنبه مشورتی دارد و تصمیم نهایی با شماست.",
        },
        calendar: {
          title: "تقویم مصاحبه‌ها",
          description: "همه مصاحبه‌های زمان‌بندی‌شده سازمان را مدیریت کنید.",
          month: "ماه",
          week: "هفته",
          day: "روز",
          today: "امروز",
          previous: "قبلی",
          next: "بعدی",
          filters: "فیلترها",
          recruiter: "مصاحبه‌کننده",
          job: "فرصت شغلی",
          type: "نوع",
          status: "وضعیت",
          all: "همه",
          todayTitle: "مصاحبه‌های امروز",
          upcomingTitle: "۷ روز آینده",
          emptyTitle: "مصاحبه‌ای زمان‌بندی نشده است.",
          emptyDescription: "برای بازه انتخاب‌شده مصاحبه‌ای وجود ندارد.",
          loadFailed: "بارگذاری تقویم ناموفق بود.",
          retry: "تلاش مجدد",
          conflict: "تداخل زمانی شناسایی شد",
          drawerTitle: "جزئیات مصاحبه",
          openProfile: "پروفایل متقاضی",
          edit: "ویرایش",
          complete: "ثبت نتیجه",
          cancel: "لغو",
          quickStatus: "تغییر وضعیت",
        },
      },
    },
    analytics: {
      title: "تحلیل‌ها",
      description: "شاخص‌های کلیدی استخدام و عملکرد فرصت‌های شغلی را بررسی کنید.",
      loadFailed: "بارگذاری اطلاعات تحلیلی با خطا مواجه شد.",
      retry: "تلاش مجدد",
      empty: "داده‌ای برای نمایش وجود ندارد.",
      rangeLabel: "بازه زمانی",
      ranges: {
        LAST_7_DAYS: "۷ روز گذشته",
        LAST_30_DAYS: "۳۰ روز گذشته",
        LAST_90_DAYS: "۹۰ روز گذشته",
        LAST_YEAR: "یک سال گذشته",
        CUSTOM: "بازه دلخواه",
      },
      kpis: {
        totalJobs: "کل فرصت‌های شغلی",
        activeJobs: "فرصت‌های فعال",
        totalApplications: "کل درخواست‌ها",
        totalCandidates: "کل متقاضیان",
        interviewsScheduled: "مصاحبه‌های زمان‌بندی شده",
        hiredCandidates: "استخدام‌شده‌ها",
        rejectedCandidates: "رد شده‌ها",
        averageTimeToHireDays: "میانگین زمان استخدام (روز)",
        averageTimeToHireEmpty: "داده کافی نیست",
      },
      charts: {
        trendsTitle: "روند درخواست‌ها",
        trendsDescription: "تعداد درخواست‌های دریافتی در طول زمان",
        statusDistributionTitle: "توزیع وضعیت متقاضیان",
        funnelTitle: "قیف استخدام",
        jobPerformanceTitle: "عملکرد فرصت‌های شغلی",
      },
      funnelStages: {
        APPLICATIONS: "درخواست‌ها",
        UNDER_REVIEW: "در حال بررسی",
        INTERVIEW_SCHEDULED: "مصاحبه زمان‌بندی شده",
        INTERVIEW_COMPLETED: "مصاحبه برگزار شده",
        HIRED: "استخدام شده",
      },
      jobPerformance: {
        columns: {
          title: "فرصت شغلی",
          applications: "درخواست‌ها",
          interviews: "مصاحبه‌ها",
          hires: "استخدامی‌ها",
          hireRate: "نرخ استخدام",
        },
        empty: "هنوز داده‌ای برای فرصت‌های شغلی وجود ندارد.",
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
    publicJob: {
      applyNow: "ارسال درخواست",
      companyInfo: "درباره شرکت",
      overview: "خلاصه فرصت شغلی",
      description: "شرح موقعیت",
      responsibilities: "مسئولیت‌ها",
      requirements: "الزامات",
      benefits: "مزایا",
      employmentType: "نوع همکاری",
      workplaceType: "محل کار",
      department: "دپارتمان",
      positions: "تعداد موقعیت",
      publishedAt: "تاریخ انتشار",
      expirationDate: "مهلت ارسال",
      location: "موقعیت مکانی",
      expiredTitle: "این فرصت دیگر پذیرش درخواست ندارد.",
      expiredDescription: "مهلت ارسال درخواست به پایان رسیده است.",
      notFoundTitle: "فرصت شغلی پیدا نشد",
      notFoundDescription:
        "فرصت شغلی مورد نظر وجود ندارد یا دیگر در دسترس نیست.",
      loadFailed: "بارگذاری فرصت شغلی با خطا مواجه شد.",
      retry: "تلاش مجدد",
      emptyValue: "—",
      apply: {
        title: "ارسال درخواست",
        description:
          "رزومه خود را بارگذاری کنید تا فرم به صورت خودکار تکمیل شود، سپس اطلاعات را بررسی و ارسال کنید.",
        backToJob: "بازگشت به فرصت شغلی",
        uploadStep: "بارگذاری رزومه",
        reviewStep: "بررسی اطلاعات",
        uploadHint: "فقط فایل PDF تا ۱۰ مگابایت",
        chooseFile: "انتخاب فایل",
        resumeSelected: "رزومه آماده بارگذاری است.",
        removeResume: "حذف فایل",
        uploading: "در حال بارگذاری رزومه...",
        continue: "ادامه",
        extractingTitle: "در حال خواندن رزومه...",
        extractingDescription: "متن رزومه استخراج می‌شود.",
        analyzingTitle: "در حال تحلیل رزومه با هوش مصنوعی...",
        analyzingDescription: "اطلاعات ساختاریافته از رزومه استخراج می‌شود.",
        personalTitle: "اطلاعات شخصی",
        professionalTitle: "اطلاعات حرفه‌ای",
        linksTitle: "لینک‌ها",
        fullName: "نام و نام خانوادگی",
        email: "ایمیل",
        phone: "شماره تماس",
        currentPosition: "سمت فعلی",
        skills: "مهارت‌ها",
        skillsHint: "مهارت‌ها را با ویرگول جدا کنید.",
        experience: "سوابق کاری",
        education: "تحصیلات",
        linkedin: "لینکدین",
        portfolio: "نمونه کار",
        website: "وب‌سایت",
        submit: "ارسال درخواست",
        submitting: "در حال ارسال...",
        errors: {
          resumeRequired: "لطفاً رزومه خود را بارگذاری کنید.",
          unsupportedFile: "فقط فایل‌های PDF پشتیبانی می‌شوند.",
          fileTooLarge: "حجم فایل از حد مجاز بیشتر است.",
          uploadFailed: "بارگذاری رزومه با خطا مواجه شد.",
          extractionFailed:
            "خواندن رزومه ممکن نشد. لطفاً فایل PDF دیگری بارگذاری کنید.",
          analysisFailed:
            "تحلیل رزومه ممکن نشد. لطفاً فرم را به صورت دستی تکمیل کنید.",
          fullNameRequired: "نام و نام خانوادگی الزامی است.",
          emailRequired: "ایمیل الزامی است.",
          emailInvalid: "ایمیل معتبر نیست.",
          phoneRequired: "شماره تماس الزامی است.",
          duplicate: "شما قبلاً برای این فرصت شغلی درخواست داده‌اید.",
          unexpected: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        },
      },
      success: {
        title: "درخواست با موفقیت ارسال شد",
        description:
          "درخواست شما دریافت شد. تیم جذب آن را بررسی کرده و وضعیت را به‌روزرسانی می‌کند.",
        summaryTitle: "خلاصه درخواست",
        jobTitle: "عنوان شغلی",
        organization: "سازمان",
        submittedAt: "زمان ارسال",
        trackingTitle: "لینک پیگیری خصوصی",
        trackingHint: "برای مشاهده وضعیت درخواست از این لینک استفاده کنید.",
        copyLink: "کپی لینک",
        linkCopied: "لینک پیگیری کپی شد.",
        openTracking: "باز کردن صفحه پیگیری",
        nextStepsTitle: "مراحل بعدی",
        nextSteps:
          "هر زمان می‌توانید با لینک پیگیری، وضعیت درخواست خود را بررسی کنید.",
        keepSafe: "لطفاً این لینک را در جای امنی نگه دارید.",
      },
      tracking: {
        title: "پیگیری درخواست",
        statusTitle: "وضعیت فعلی",
        timelineTitle: "مسیر پیشرفت",
        jobTitle: "اطلاعات فرصت شغلی",
        submittedTitle: "اطلاعات ارسال‌شده",
        lastUpdated: "آخرین به‌روزرسانی",
        notFoundTitle: "لینک پیگیری پیدا نشد",
        notFoundDescription: "لینک پیگیری نامعتبر است یا منقضی شده است.",
        loadFailed: "بارگذاری اطلاعات پیگیری با خطا مواجه شد.",
        retry: "تلاش مجدد",
        fullName: "نام و نام خانوادگی",
        email: "ایمیل",
        phone: "شماره تماس",
        currentPosition: "سمت فعلی",
        statusLabels: {
          APPLIED: "ارسال شده",
          REVIEWING: "در حال بررسی",
          INTERVIEW_SCHEDULED: "مصاحبه زمان‌بندی شده",
          INTERVIEW_PASSED: "مصاحبه انجام شده",
          HIRED: "استخدام شده",
          REJECTED: "رد شده",
        },
        statusDescriptions: {
          APPLIED: "درخواست شما با موفقیت دریافت شد.",
          REVIEWING: "تیم جذب در حال بررسی درخواست شماست.",
          INTERVIEW_SCHEDULED: "تبریک! شما به مصاحبه دعوت شده‌اید.",
          INTERVIEW_PASSED:
            "مصاحبه شما انجام شده و تصمیم نهایی در حال آماده‌سازی است.",
          HIRED: "تبریک! شما فرآیند جذب را با موفقیت پشت سر گذاشته‌اید.",
          REJECTED:
            "از علاقه‌مندی شما سپاسگزاریم. پس از بررسی، تصمیم گرفتیم با متقاضی دیگری ادامه دهیم.",
        },
        timelineSteps: {
          APPLIED: "ارسال درخواست",
          REVIEWING: "در حال بررسی",
          INTERVIEW_SCHEDULED: "مصاحبه زمان‌بندی شده",
          INTERVIEW_PASSED: "مصاحبه انجام شده",
          FINAL: "تصمیم نهایی",
        },
      },
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
      breadcrumbsLabel: "Breadcrumb",
      placeholder: "This module is coming soon.",
      placeholderHint: "The selected module is not implemented in this release yet.",
      nav: {
        overview: "Dashboard",
        jobs: "Jobs",
        createJob: "Create job",
        jobList: "Job list",
        candidates: "Candidates",
        interviews: "Interviews",
        reports: "Analytics",
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
    candidates: {
      list: {
        title: "Candidates",
        description: "View, filter, and manage candidates for this job.",
        searchPlaceholder: "Search by name, email, or skill...",
        loadFailed: "Unable to load the candidate list.",
        retry: "Retry",
        empty: "No candidates have applied for this job yet.",
        stats: {
          total: "Total candidates",
          reviewing: "Reviewing",
          interviewScheduled: "Interview scheduled",
          hired: "Hired",
          rejected: "Rejected",
        },
        filters: {
          statusLabel: "Status",
          allStatuses: "All statuses",
          experienceLevelLabel: "Experience level",
          allExperienceLevels: "All levels",
          educationLabel: "Education",
          educationPlaceholder: "e.g. Bachelor's degree",
          dateRangeLabel: "Applied within",
          allDateRanges: "All time",
        },
        experienceLevels: {
          JUNIOR: "Junior",
          MID: "Mid-level",
          SENIOR: "Senior",
        },
        dateRanges: {
          TODAY: "Today",
          LAST_7_DAYS: "Last 7 days",
          LAST_30_DAYS: "Last 30 days",
          CUSTOM: "Custom range",
        },
        columns: {
          name: "Candidate",
          position: "Current position",
          aiScore: "AI score",
          experience: "Experience",
          skills: "Skills",
          status: "Status",
          appliedAt: "Applied date",
          actions: "Actions",
        },
        actions: {
          view: "View profile",
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
      org: {
        title: "All candidates",
        description: "Candidates across every job in your organization.",
        loadFailed: "Unable to load the candidate list.",
        retry: "Retry",
        empty: "No candidates have applied yet.",
        columns: {
          name: "Candidate",
          job: "Job",
          aiScore: "AI score",
          status: "Status",
          appliedAt: "Applied date",
          actions: "Actions",
        },
        actions: {
          view: "View profile",
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
      details: {
        title: "Candidate profile",
        notFound: "Candidate not found.",
        loadFailed: "Unable to load the candidate profile.",
        retry: "Retry",
        backToList: "Back to candidates",
        emptyValue: "—",
        statusLabel: "Status",
        statusUpdated: "Candidate status updated.",
        actions: {
          scheduleInterview: "Schedule interview",
          downloadResume: "Download resume",
        },
        ai: {
          title: "AI analysis",
          empty: "AI analysis is not available for this candidate.",
          matchScore: "Match score",
          summary: "Executive summary",
          strengths: "Strengths",
          weaknesses: "Areas for improvement",
          missingSkills: "Missing required skills",
          interviewQuestions: "Suggested interview questions",
        },
        resume: {
          title: "Resume",
          empty: "No resume has been uploaded.",
          download: "Download resume",
        },
        profile: {
          title: "Candidate information",
          email: "Email",
          phone: "Phone number",
          currentPosition: "Current position",
          yearsExperience: "Years of experience",
          education: "Education",
          experience: "Work experience",
          skills: "Skills",
          links: "Links",
          appliedAt: "Applied date",
        },
        notes: {
          title: "Notes",
          empty: "No notes have been added yet.",
          placeholder: "Write your note...",
          add: "Add note",
          adding: "Adding...",
          edit: "Edit",
          save: "Save",
          cancel: "Cancel",
          delete: "Delete",
          editedLabel: "Edited",
          deleteConfirm: {
            title: "Delete note",
            description: "Are you sure you want to delete this note?",
            cancel: "Cancel",
            confirm: "Delete",
            confirming: "Deleting...",
          },
        },
        timeline: {
          title: "Activity timeline",
          empty: "No activity has been recorded yet.",
          events: {
            APPLICATION_SUBMITTED: "Application submitted",
            RESUME_PROCESSED: "Resume processed",
            AI_ANALYSIS_COMPLETED: "AI analysis completed",
            STATUS_CHANGED: "Status changed",
            NOTE_ADDED: "Note added",
            NOTE_UPDATED: "Note updated",
            NOTE_DELETED: "Note deleted",
            INTERVIEW_SCHEDULED: "Interview scheduled",
            INTERVIEW_UPDATED: "Interview updated",
            INTERVIEW_CANCELLED: "Interview cancelled",
            INTERVIEW_COMPLETED: "Interview completed",
            INTERVIEW_STARTED: "Interview started",
            INTERVIEW_NO_SHOW: "Interview no-show",
            INTERVIEW_PROCESS_UPDATED: "Interview process updated",
          },
        },
        interviews: {
          title: "Interviews",
          empty: "No interviews have been scheduled yet.",
          scheduleButton: "Schedule interview",
          manageButton: "Manage interview process",
          processStatus: "Process status",
          editAction: "Edit",
          cancelAction: "Cancel",
          completeAction: "Mark completed",
          joinAction: "Join meeting",
        },
        errors: {
          unexpected: "Something went wrong. Please try again.",
        },
      },
      interview: {
        types: {
          HR: "HR",
          TECHNICAL: "Technical",
          TEAM_LEAD: "Team lead",
          MANAGER: "Managerial",
          FINAL: "Final",
          CUSTOM: "Custom",
        },
        statuses: {
          SCHEDULED: "Scheduled",
          IN_PROGRESS: "In progress",
          COMPLETED: "Completed",
          CANCELLED: "Cancelled",
          NO_SHOW: "No show",
        },
        processStatuses: {
          WAITING: "Waiting",
          INTERVIEWING: "Interviewing",
          PASSED: "Passed",
          FAILED: "Failed",
          HIRED: "Hired",
        },
        results: {
          PASSED: "Passed",
          FAILED: "Failed",
          PENDING: "Pending",
        },
        form: {
          createTitle: "Schedule interview",
          editTitle: "Edit interview",
          nameLabel: "Stage name",
          namePlaceholder: "e.g. First technical interview",
          dateTimeLabel: "Date and time",
          typeLabel: "Interview type",
          recruiterLabel: "Recruiter",
          recruiterNone: "Unassigned",
          locationLabel: "Location",
          locationPlaceholder: "e.g. HQ office or online link",
          meetingUrlLabel: "Meeting URL",
          meetingUrlPlaceholder: "https://...",
          internalNotesLabel: "Internal notes",
          internalNotesPlaceholder: "Visible only to recruiters...",
          candidateNotesLabel: "Candidate notes",
          candidateNotesPlaceholder: "Shown on the tracking page...",
          notesLabel: "Notes",
          notesPlaceholder: "Details or talking points...",
          save: "Save",
          saving: "Saving...",
          cancel: "Cancel",
          conflictWarning: "Schedule conflict detected for this recruiter.",
          errors: {
            nameRequired: "Stage name is required.",
            scheduledAtRequired: "Interview date and time is required.",
            meetingUrlInvalid: "Meeting URL is invalid.",
            notesTooLong: "Notes must be at most 5000 characters.",
            unexpected: "Something went wrong. Please try again.",
          },
        },
        cancelDialog: {
          title: "Cancel interview",
          description: "Are you sure you want to cancel this interview?",
          cancel: "Cancel",
          confirm: "Cancel interview",
          confirming: "Cancelling...",
        },
        completeDialog: {
          title: "Complete interview",
          description: "This interview will be marked as completed.",
          resultLabel: "Result",
          notesLabel: "Outcome notes (optional)",
          notesPlaceholder: "Summary of the interview outcome...",
          cancel: "Cancel",
          confirm: "Mark completed",
          confirming: "Saving...",
        },
        toasts: {
          created: "Interview scheduled successfully.",
          updated: "Interview updated successfully.",
          cancelled: "Interview cancelled.",
          completed: "Interview outcome recorded.",
          hired: "Candidate hired.",
          rejected: "Candidate rejected.",
          statusUpdated: "Interview status updated.",
        },
        errors: {
          notEditable: "This interview can no longer be edited.",
          unexpected: "Something went wrong. Please try again.",
        },
      },
      interviewsModule: {
        process: {
          title: "Interview process",
          backToProfile: "Back to profile",
          scheduleStage: "Add interview stage",
          hire: "Hire",
          reject: "Reject",
          empty: "No interview stages yet.",
          loadFailed: "Unable to load the interview process.",
          retry: "Retry",
        },
        ai: {
          title: "AI interview preparation",
          promptLabel: "Optional instructions",
          promptPlaceholder: "e.g. Focus on system design...",
          generate: "Generate guide",
          regenerate: "Regenerate",
          regenerating: "Regenerating...",
          stageLabel: "Interview stage",
          preparing: "Preparing interview...",
          generatingQuestions: "Generating questions...",
          buildingChecklist: "Building evaluation checklist...",
          failed: "Unable to generate interview preparation. Please try again.",
          retry: "Retry",
          objectives: "Interview objectives",
          technical: "Technical questions",
          behavioral: "Behavioral questions",
          followUp: "Follow-up questions",
          strengths: "Strengths",
          weaknesses: "Potential concerns",
          missingSkills: "Missing skills",
          checklist: "Evaluation checklist",
        },
        summary: {
          title: "Interview journey summary",
          description:
            "AI summary based on completed interviews and internal recruiter notes.",
          generate: "Generate summary",
          regenerate: "Regenerate summary",
          generating: "Generating interview summary...",
          failed: "Unable to generate interview summary. Please try again.",
          retry: "Retry",
          emptyCompleted:
            "At least one completed interview is required to generate a summary.",
          executiveSummary: "Executive summary",
          timeline: "Interview timeline summary",
          consensus: "Recruiter consensus",
          strengths: "Strengths",
          weaknesses: "Weaknesses",
          risks: "Risks",
          outstandingQuestions: "Outstanding questions",
          suggestedNextStep: "Suggested next step",
          advisoryNote:
            "This recommendation is advisory only. Recruiters make the final decision.",
        },
        calendar: {
          title: "Interview calendar",
          description: "Manage all scheduled interviews across your organization.",
          month: "Month",
          week: "Week",
          day: "Day",
          today: "Today",
          previous: "Previous",
          next: "Next",
          filters: "Filters",
          recruiter: "Recruiter",
          job: "Job",
          type: "Type",
          status: "Status",
          all: "All",
          todayTitle: "Today's interviews",
          upcomingTitle: "Next 7 days",
          emptyTitle: "No interviews scheduled.",
          emptyDescription: "There are no interviews for the selected period.",
          loadFailed: "Unable to load the calendar.",
          retry: "Retry",
          conflict: "Schedule conflict detected",
          drawerTitle: "Interview details",
          openProfile: "Open candidate profile",
          edit: "Edit",
          complete: "Complete",
          cancel: "Cancel",
          quickStatus: "Update status",
        },
      },
    },
    analytics: {
      title: "Analytics",
      description: "Review key hiring metrics and job performance.",
      loadFailed: "Unable to load analytics data.",
      retry: "Retry",
      empty: "No data to display.",
      rangeLabel: "Date range",
      ranges: {
        LAST_7_DAYS: "Last 7 days",
        LAST_30_DAYS: "Last 30 days",
        LAST_90_DAYS: "Last 90 days",
        LAST_YEAR: "Last year",
        CUSTOM: "Custom range",
      },
      kpis: {
        totalJobs: "Total jobs",
        activeJobs: "Active jobs",
        totalApplications: "Total applications",
        totalCandidates: "Total candidates",
        interviewsScheduled: "Interviews scheduled",
        hiredCandidates: "Hired candidates",
        rejectedCandidates: "Rejected candidates",
        averageTimeToHireDays: "Average time to hire (days)",
        averageTimeToHireEmpty: "Not enough data",
      },
      charts: {
        trendsTitle: "Application trends",
        trendsDescription: "Applications received over time",
        statusDistributionTitle: "Candidate status distribution",
        funnelTitle: "Hiring funnel",
        jobPerformanceTitle: "Job performance",
      },
      funnelStages: {
        APPLICATIONS: "Applications",
        UNDER_REVIEW: "Under review",
        INTERVIEW_SCHEDULED: "Interview scheduled",
        INTERVIEW_COMPLETED: "Interview completed",
        HIRED: "Hired",
      },
      jobPerformance: {
        columns: {
          title: "Job",
          applications: "Applications",
          interviews: "Interviews",
          hires: "Hires",
          hireRate: "Hire rate",
        },
        empty: "No job performance data yet.",
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
    publicJob: {
      applyNow: "Apply Now",
      companyInfo: "About the company",
      overview: "Job overview",
      description: "Job description",
      responsibilities: "Responsibilities",
      requirements: "Requirements",
      benefits: "Benefits",
      employmentType: "Employment type",
      workplaceType: "Workplace type",
      department: "Department",
      positions: "Number of positions",
      publishedAt: "Published date",
      expirationDate: "Expiration date",
      location: "Location",
      expiredTitle: "This job is no longer accepting applications.",
      expiredDescription: "The application deadline has passed.",
      notFoundTitle: "Job not found",
      notFoundDescription:
        "The requested job does not exist or is no longer available.",
      loadFailed: "Unable to load this job.",
      retry: "Retry",
      emptyValue: "—",
      apply: {
        title: "Apply for this job",
        description:
          "Upload your resume so we can autofill the form, then review and submit.",
        backToJob: "Back to job",
        uploadStep: "Upload resume",
        reviewStep: "Review information",
        uploadHint: "PDF only, up to 10 MB",
        chooseFile: "Choose file",
        resumeSelected: "Resume ready to upload.",
        removeResume: "Remove file",
        uploading: "Uploading resume...",
        continue: "Continue",
        extractingTitle: "Reading your resume...",
        extractingDescription: "Extracting text from your PDF.",
        analyzingTitle: "Analyzing your resume with AI...",
        analyzingDescription: "Filling the application form from your resume.",
        personalTitle: "Personal information",
        professionalTitle: "Professional information",
        linksTitle: "Links",
        fullName: "Full name",
        email: "Email",
        phone: "Phone number",
        currentPosition: "Current position",
        skills: "Skills",
        skillsHint: "Separate skills with commas.",
        experience: "Work experience",
        education: "Education",
        linkedin: "LinkedIn",
        portfolio: "Portfolio",
        website: "Website",
        submit: "Submit application",
        submitting: "Submitting...",
        errors: {
          resumeRequired: "Please upload your resume.",
          unsupportedFile: "Only PDF files are supported.",
          fileTooLarge: "File size exceeds the maximum allowed limit.",
          uploadFailed: "Unable to upload your resume.",
          extractionFailed:
            "Unable to read your resume. Please upload another PDF.",
          analysisFailed:
            "Unable to analyze your resume. Please complete the application manually.",
          fullNameRequired: "Full name is required.",
          emailRequired: "Email is required.",
          emailInvalid: "Email is invalid.",
          phoneRequired: "Phone number is required.",
          duplicate: "You have already applied for this job.",
          unexpected: "Something went wrong.",
        },
      },
      success: {
        title: "Application submitted successfully",
        description:
          "Your application has been received. Our recruitment team will review it and update its status.",
        summaryTitle: "Application summary",
        jobTitle: "Job title",
        organization: "Organization",
        submittedAt: "Submitted at",
        trackingTitle: "Private tracking link",
        trackingHint: "Use this link anytime to check your application status.",
        copyLink: "Copy link",
        linkCopied: "Tracking link copied.",
        openTracking: "Open tracking page",
        nextStepsTitle: "Next steps",
        nextSteps:
          "You can use the tracking link at any time to check the status of your application.",
        keepSafe: "Please keep this link in a safe place.",
      },
      tracking: {
        title: "Application tracking",
        statusTitle: "Current status",
        timelineTitle: "Progress timeline",
        jobTitle: "Job information",
        submittedTitle: "Submitted information",
        lastUpdated: "Last updated",
        notFoundTitle: "Tracking link not found",
        notFoundDescription: "The tracking link is invalid or has expired.",
        loadFailed: "Unable to load tracking information.",
        retry: "Retry",
        fullName: "Full name",
        email: "Email",
        phone: "Phone number",
        currentPosition: "Current position",
        statusLabels: {
          APPLIED: "Submitted",
          REVIEWING: "Under review",
          INTERVIEW_SCHEDULED: "Interview scheduled",
          INTERVIEW_PASSED: "Interview completed",
          HIRED: "Hired",
          REJECTED: "Rejected",
        },
        statusDescriptions: {
          APPLIED: "Your application has been received successfully.",
          REVIEWING: "Our recruitment team is currently reviewing your application.",
          INTERVIEW_SCHEDULED: "Congratulations! You have been invited to an interview.",
          INTERVIEW_PASSED:
            "Your interview has been completed. The final decision is being prepared.",
          HIRED:
            "Congratulations! You have successfully passed the recruitment process.",
          REJECTED:
            "Thank you for your interest. After careful consideration, we decided to move forward with another candidate.",
        },
        timelineSteps: {
          APPLIED: "Application submitted",
          REVIEWING: "Under review",
          INTERVIEW_SCHEDULED: "Interview scheduled",
          INTERVIEW_PASSED: "Interview completed",
          FINAL: "Final decision",
        },
      },
    },
  },
};
