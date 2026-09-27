/** Editorial intros shown at the top of category pages (template copy, not DB content). */
export const CATEGORY_INTROS: Record<string, string> = {
  applications:
    "Guides for the paperwork side of a move: CVs, cover letters, statements of purpose, recommendation letters and document files for jobs, scholarships and visas. Each guide points to the official portal or form it relies on, so you can check the current rules before you submit.",
  careers:
    "Practical career paths for readers in Pakistan and abroad: which roles are hiring, what proof employers ask for, and how to move from a first job to a better one. We focus on routes you can start with the skills and documents you already have.",
  lifestyle:
    "Routines for the long stretch of a job search, a degree abroad or a career change: planning your week, protecting sleep and money, and keeping going when replies are slow.",
  scholarships:
    "Scholarship guides built around official sources such as HEC, Fulbright, DAAD and university funding pages: who can apply, typical timelines, and the documents to prepare early.",
  skills:
    "Skills employers are asking for right now, from AI tools and data storytelling to design, video editing and communication, with small projects you can show as proof instead of only listing a course.",
  "study-abroad":
    "Planning guides for studying abroad: choosing a country and programme, costs and return on investment, admissions calendars, attestation and visa steps, written for students applying from Pakistan.",
  technology:
    "Beginner-friendly technology paths such as cybersecurity, cloud and SaaS admin, and staying secure while working remotely, with the tools and first projects that help you get hired.",
  tutorials:
    "Step-by-step walkthroughs for specific tasks: document attestation, online applications, study tools and similar jobs where the order of steps matters.",
};

export function categoryIntro(slug: string, name: string): string {
  return (
    CATEGORY_INTROS[slug] ||
    `Practical ${name.toLowerCase()} guides from Global Career Hub, written for readers first and checked against official sources where rules apply.`
  );
}
