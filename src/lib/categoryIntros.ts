/** Editorial intros shown at the top of category pages (template copy, not DB content). */
export const CATEGORY_INTROS: Record<string, string> = {
  applications:
    "Guides for the paperwork side of a move: CVs, cover letters, statements of purpose, recommendation letters and document files for jobs, scholarships and visas. Each guide points to the official portal or form it relies on, so you can check the current rules before you submit.",
  careers:
    "Practical career paths for readers in Pakistan and abroad: which roles are hiring, what proof employers ask for, and how to move from a first job to a better one. We focus on routes you can start with the skills and documents you already have.",
  lifestyle:
    "Routines for the long stretch of a job search, a degree abroad or a career change: planning your week, protecting sleep and money, and keeping going when replies are slow. These are not productivity systems copied from a course. They are short, repeatable weeks you can run while you are still in class or still employed. A typical note here covers how to cap application hours so the search does not eat the evening, how to close the week so Monday does not start from a blank page, and how to talk to family when offers are slow without turning every dinner into a status meeting. Nothing on this shelf promises a mood, a visa, or a salary. If a routine names a tool or a form, the guide also says what the tool is for and when to ignore it. Read one piece, try it for a single week, and change the parts that do not fit your timetable.",
  scholarships:
    "Scholarship guides built around official sources such as HEC, Fulbright, DAAD and university funding pages: who can apply, typical timelines, and the documents to prepare early.",
  skills:
    "Skills employers are asking for right now, from AI tools and data storytelling to design, video editing and communication, with small projects you can show as proof instead of only listing a course.",
  "study-abroad":
    "Planning guides for studying abroad: choosing a country and programme, costs and return on investment, admissions calendars, attestation and visa steps, written for students applying from Pakistan.",
  technology:
    "Beginner-friendly technology paths such as cybersecurity, cloud and SaaS admin, and staying secure while working remotely, with the tools and first projects that help you get hired. The guides assume you can use a browser and a spreadsheet, not that you already have a computer-science degree. Each path is written as a sequence: what the job actually is on a Tuesday, which free or low-cost practice you can show, and which certificate claims are worth checking on the issuer's own page before you pay. Remote-work security sits here too, because a first tech job often starts on a shared laptop. If a page names a vendor exam or a cloud console, open that vendor's documentation beside the guide. Prices and exam names move; the official page is the one that bills you.",
  tutorials:
    "Step-by-step walkthroughs for specific tasks: document attestation, online applications, study tools and similar jobs where the order of steps matters. A tutorial on this site is a sequence you can follow with the portal open, not a list of slogans. Where a step depends on a government or university system, the guide names that system and links to it, then describes what you should see before you click the next button. Screens change. If the live form and the guide disagree, follow the form and send the URL so the page can be corrected. These walkthroughs do not file anything for you and they do not replace the help text inside the portal. Use them to prepare the file, the names, and the order, then submit on the official site yourself.",
};

export function categoryIntro(slug: string, name: string): string {
  return (
    CATEGORY_INTROS[slug] ||
    `Practical ${name.toLowerCase()} guides from Global Career Hub, written for readers first and checked against official sources where rules apply.`
  );
}
