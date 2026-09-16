import { query } from "@/lib/db";
import { toSlug } from "@/lib/posts";

type Seed = { title: string; excerpt: string; content: string };

const POSTS: Seed[] = [
  { title: "How to write a statement of purpose that a reviewer actually finishes", excerpt: "A SOP is not a life story. It is a short argument that you belong on that course.", content: "<p>Most statements of purpose fail because they start with childhood and never reach the course.</p><h2>Open with the decision</h2><p>Name the field and the problem in paragraph one.</p><h2>Show one proof</h2><p>One project beats ten hobbies.</p><h2>Name the department</h2><p>Skip generic praise. Mention a lab or module.</p>" },
  { title: "A practical checklist before you apply for a scholarship", excerpt: "Deadlines are public. The work that wins funding is the file you prepare weeks earlier.", content: "<p>Forms stall when transcripts and referees are missing.</p><h2>Collect documents early</h2><p>Passport, transcripts, tests, two referees who already said yes.</p><h2>Match the fund</h2><p>Country and subject rules are filters.</p><h2>Submit two days early</h2><p>Portals and time zones eat last hours.</p>" },
  { title: "Remote work skills that still show up on hiring screens", excerpt: "Teams hire people who can write a decision and ship without being watched.", content: "<p>A camera is not a career plan.</p><h2>Write so nobody needs a call</h2><p>Status, link, next step.</p><h2>Show work</h2><p>A small public sample beats slogans.</p>" },
  { title: "Study-abroad timelines if you are starting from Pakistan", excerpt: "Work backwards from the intake, not from the brochure.</p>", content: "<p>September planning in August misses the embassy window.</p><h2>Twelve months out</h2><p>Shortlist and book tests.</p><h2>Six months out</h2><p>Applications and housing.</p><h2>Three months out</h2><p>Visa file and funds evidence.</p>" },
  { title: "How to pick a career when everyone around you has an opinion", excerpt: "Try the work before you name it a calling.", content: "<p>Titles change. Tasks do not.</p><h2>List the tasks</h2><p>Write, sell, build, teach, or run a system.</p><h2>Borrow a week</h2><p>Shadow or freelance a small job.</p>" },
  { title: "LinkedIn profile fixes that take an afternoon", excerpt: "Headline and first three lines do more than a banner.</p>", content: "<p>Say what you do and for whom.</p><h2>Headline as a sentence</h2><p>Role, field, result.</p><h2>About in first person</h2><p>Five short lines.</p>" },
  { title: "English test prep without burning three months", excerpt: "Book the date first. Prep shrinks to fit the calendar.", content: "<p>The score is a task, not a verdict.</p><h2>Diagnose once</h2><p>One timed mock.</p><h2>Exam conditions</h2><p>Timer, no phone.</p>" },
  { title: "What to put in a first freelance portfolio when you have no clients", excerpt: "Invent the brief. Build three pieces that look like paid work.", content: "<p>Waiting for a client is a loop.</p><h2>Three pieces, one audience</h2><p>Pick a niche and ship.</p>" },
  { title: "Campus to first job: the emails that actually get a reply", excerpt: "Ask for fifteen minutes and one fact.</p>", content: "<p>Mass HR mail is easy to ignore.</p><h2>Five sentences</h2><p>Who you are, why them, one question.</p>" },
  { title: "How to read a course page before you pay a deposit", excerpt: "The module list tells you what Tuesdays feel like.", content: "<p>Skip lifestyle photos. Read assessment and hours.</p>" },
  { title: "A calm system for job applications you can keep for six weeks", excerpt: "One table and a Friday review.</p>", content: "<p>Application fatigue is clutter.</p><h2>One row per role</h2><p>Company, date, follow-up, status.</p>" },
  { title: "Digital skills worth learning if you are changing fields in 2026", excerpt: "One way to write, one way to analyse, one way to show work.", content: "<p>Employers ask if you can finish a task.</p><h2>Writing</h2><p>Clear documents travel.</p><h2>Spreadsheets</h2><p>Filters and a clean sheet.</p>" },
];

export async function seedSeoPosts(authorId: number) {
  const log: string[] = [];
  for (const post of POSTS) {
    const slug = toSlug(post.title);
    const exists = await query<Array<{ id: number }>>("SELECT id FROM posts WHERE slug = ? LIMIT 1", [slug]);
    if (exists[0]) { log.push(`skip: ${slug}`); continue; }
    await query(
      `INSERT INTO posts (title, slug, excerpt, content, featured_image, category_id, author_id, status, published_at)
       VALUES (?, ?, ?, ?, NULL, NULL, ?, 'draft', NULL)`,
      [post.title, slug, post.excerpt, post.content, authorId]
    );
    log.push(`draft: ${slug}`);
  }
  return log;
}
