/*
 * Demo mode: CarePost runs entirely in the browser with no API keys.
 * Uploads resolve to the bundled sample plan, the Companion answers from the
 * plan with scripted replies, and SMS reminders are simulated.
 */
import type { CarePlan } from "@/lib/types/care-plan";
import sample from "@/fixtures/sample-care-plan.json";

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function samplePlan(): CarePlan {
  // Fresh copy so checklist state never leaks into the module-level import
  return structuredClone(sample) as CarePlan;
}

/** Walks through believable progress steps, then returns the sample plan. */
export async function demoExtract(pages: number, onStep: (msg: string) => void): Promise<CarePlan> {
  for (let i = 1; i <= pages; i++) {
    onStep(pages > 1 ? `Reading page ${i} of ${pages}…` : "Reading your papers…");
    await wait(900);
  }
  onStep("Finding medicines and warning signs…");
  await wait(1000);
  onStep("Building your plan for today…");
  await wait(800);
  return samplePlan();
}

const list = (items: string[]) => items.map((x) => `- ${x}`).join("\n");

/** Scripted Companion reply, grounded in whatever plan is loaded. */
export function demoReply(question: string, plan: CarePlan | null): string {
  const q = question.toLowerCase();
  if (!plan) {
    return "I can answer questions about your own recovery once you add your discharge papers. Tap **Upload** — or try **Try sample** to see how it works.";
  }

  if (/watch|warn|danger|sign|er\b|emergency|911/.test(q)) {
    return `Here's what to watch for:\n\n${list(plan.red_flags.map((f) => f.text))}\n\nIf you have trouble breathing, chest pain, or feel much worse, **call 911**. For the others, go to urgent care or call your doctor.`;
  }
  if (/ibuprofen|advil|motrin|aspirin|tylenol|medic|pill|dose|drug|take/.test(q)) {
    const meds = plan.medications.map((m) => `**${m.name}**${m.dose ? ` ${m.dose}` : ""} — ${m.frequency_text ?? "as directed"}${m.notes ? ` (${m.notes.toLowerCase()})` : ""}`);
    return `Your papers list:\n\n${list(meds)}\n\nBefore adding anything new — including ibuprofen or other over-the-counter medicine — check with your pharmacist or doctor. They can tell you if it's safe with what you already take.`;
  }
  if (/doctor|call|appointment|follow|visit/.test(q)) {
    const fu = plan.follow_ups.map((f) => `${f.type} — ${f.within_text}`);
    const contact = plan.red_flags.filter((f) => f.severity_hint === "contact").map((f) => f.text);
    return `${fu.length ? `Your follow-up:\n\n${list(fu)}\n\n` : ""}Call your doctor sooner if you notice:\n\n${list(contact.length ? contact : ["Pain, swelling, or fever getting worse"])}`;
  }
  if (/food|eat|diet|drink|alcohol/.test(q)) {
    return `**Do:**\n${list(plan.diet.do)}\n\n**Avoid:**\n${list(plan.diet.avoid)}`;
  }
  if (/walk|activ|exercise|lift|work|shower|rest/.test(q)) {
    return `**You can:**\n${list(plan.activity.allowances)}\n\n**Avoid for now:**\n${list(plan.activity.restrictions)}`;
  }
  return `${plan.plain_language_summary}\n\nYou can ask me about your medicines, warning signs, food, activity, or your follow-up visit.`;
}

/** Streams a reply word by word so the chat feels live. */
export async function streamDemoReply(text: string, onChunk: (soFar: string) => void) {
  await wait(600);
  const words = text.split(/(\s+)/);
  let soFar = "";
  for (const w of words) {
    soFar += w;
    onChunk(soFar);
    if (w.trim()) await wait(28);
  }
}
