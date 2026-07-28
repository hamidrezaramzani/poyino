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
};

export const translations: Record<Locale, Translation> = {
  fa: {
    languageLabel: "فارسی",
    switchLanguageLabel: "English",
    heroBadge: "استخدام هوشمند برای تیم های در حال رشد",
    heroTitle: "پوینو به شما کمک می کند استعداد مناسب را سریع تر و با اطمینان بیشتر پیدا کنید.",
    heroDescription:
      "پوینو یک پلتفرم استخدام مبتنی بر هوش مصنوعی است که آگهی شغلی، دریافت رزومه، تحلیل خودکار و ارزیابی اولیه متقاضیان را در یک جریان کاری ساده و منظم جمع می کند.",
    primaryCta: "درخواست دموی محصول",
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
    finalCtaButton: "شروع گفتگو با تیم پوینو",
  },
  en: {
    languageLabel: "English",
    switchLanguageLabel: "فارسی",
    heroBadge: "Intelligent hiring for growing teams",
    heroTitle: "Poyino helps you discover the right talent faster and with more confidence.",
    heroDescription:
      "Poyino is an AI-powered recruitment platform that brings job publishing, resume intake, automated analysis, and early candidate evaluation into one simple workflow.",
    primaryCta: "Request a Product Demo",
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
    finalCtaButton: "Talk to the Poyino Team",
  },
};
