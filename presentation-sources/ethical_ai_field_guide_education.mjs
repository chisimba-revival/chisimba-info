import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SKILL_DIR = "/home/derek/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations";
const workspaceDir = "/run/media/derek/main/chisimba-revival/chisimba-info";
const buildDir = path.join(workspaceDir, ".codex-ethical-ai-deck");
const finalPath = path.join(workspaceDir, "presentations", "Ethical_AI_for_Field_Guide_Education_v3.pptx");
const imageDir = path.join(workspaceDir, "presentation-assets", "ethical-ai-field-guide");
const images = {
  cover: path.join(imageDir, "cover.png"),
  fieldAssessment: path.join(imageDir, "field-assessment.png"),
  fieldTeaching: path.join(imageDir, "field-teaching.png"),
  assessmentWork: path.join(imageDir, "assessment-work.png"),
  review: path.join(imageDir, "review.png"),
  operations: path.join(imageDir, "operations.png"),
};

const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href);
await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(path.dirname(finalPath), { recursive: true });

const W = 1280, H = 720;
const C = { forest: "#3B6641", leaf: "#9BB35C", earth: "#64453B", navy: "#102B3F", blue: "#176B9B", ink: "#17212B", muted: "#5C676F", paper: "#F6F5EF", white: "#FFFFFF", pale: "#E8EFE4", amber: "#D59A3A", red: "#A5473F" };
const FONT = "Aptos";
const FONT_DISPLAY = "Aptos Display";

const p = Presentation.create({ slideSize: { width: W, height: H } });

function addBox(slide, x, y, w, h, fill, radius = 0, line = "none") {
  return slide.shapes.add({ geometry: radius ? "roundRect" : "rect", position: { left:x, top:y, width:w, height:h }, fill, line: { fill: line, width: line === "none" ? 0 : 1 }, borderRadius: radius || undefined });
}
function addText(slide, text, x, y, w, h, opts = {}) {
  const s = slide.shapes.add({ geometry: "textbox", position: { left:x, top:y, width:w, height:h }, fill: "none", line: { fill:"none", width:0 } });
  s.text = text;
  s.text.style = { typeface: opts.font || FONT, fontSize: opts.size || 24, bold: !!opts.bold, color: opts.color || C.ink, autoFit: "shrinkText", verticalAlignment: opts.valign || "middle", alignment: opts.align || "left" };
  return s;
}
async function addImage(slide, file, x, y, w, h, fit="cover", alt="") {
  const blob = await fs.readFile(file);
  return slide.images.add({ blob, contentType:"image/png", alt, fit, position:{ left:x, top:y, width:w, height:h } });
}
function title(slide, text, kicker) {
  if (kicker) addText(slide, kicker.toUpperCase(), 68, 42, 640, 26, { size:13, bold:true, color:C.forest });
  addText(slide, text, 68, kicker ? 70 : 48, 1120, 64, { size:34, bold:true, font:FONT_DISPLAY, color:C.navy });
  addBox(slide, 68, 132, 78, 5, C.leaf);
}
function footer(slide, n) {
  addText(slide, "Ethical AI for field guide education", 68, 680, 520, 18, { size:10, color:C.muted });
  addText(slide, String(n).padStart(2,"0"), 1160, 680, 52, 18, { size:10, color:C.muted, align:"right" });
}
function notes(slide, text) { slide.speakerNotes.textFrame.setText(text); }
function bullet(slide, lead, body, y, accent=C.forest) {
  addBox(slide, 72, y+7, 12, 12, accent, 6);
  addText(slide, lead, 102, y-2, 390, 32, { size:22, bold:true, color:C.navy });
  addText(slide, body, 102, y+34, 430, 72, { size:18, color:C.muted, valign:"top" });
}
function bulletAt(slide, lead, body, x, y, w, accent=C.forest) {
  addBox(slide, x, y+7, 12, 12, accent, 6);
  addText(slide, lead, x+30, y-2, w-30, 32, { size:22, bold:true, color:C.navy });
  addText(slide, body, x+30, y+34, w-30, 72, { size:18, color:C.muted, valign:"top" });
}

// 1 — cover
{
  const s = p.slides.add();
  await addImage(s, images.cover, 0, 0, W, H, "cover", "Field instructor guiding trainee nature guides in the savanna");
  addText(s, "Ethical AI for\nfield guide education", 74, 170, 560, 176, { size:48, bold:true, font:FONT_DISPLAY, color:C.white, valign:"top" });
  addText(s, "More time for instruction\nHuman judgement stays in charge", 78, 370, 470, 86, { size:23, color:"#EAF1E8", valign:"top" });
  addBox(s, 78, 486, 94, 6, C.leaf);
  addText(s, "Chisimba 26", 78, 515, 260, 34, { size:17, bold:true, color:C.white });
  notes(s, "Artificial intelligence can reduce repetitive assessment work, but the purpose is not to remove the instructor. The purpose is to give instructors more time for observation, explanation, coaching and conversation. This presentation sets out how Chisimba keeps human judgement in charge while using AI as a practical assistant.");
}

// 2 — purpose
{
  const s = p.slides.add(); s.background.fill = C.paper; title(s, "The purpose is more time for teaching", "Why use AI");
  addText(s, "Assessment preparation can consume the same hours that instructors need for field practice and individual feedback.", 72, 172, 520, 110, { size:25, color:C.ink, valign:"top" });
  bullet(s, "AI prepares a first pass", "It organises written evidence, applies the supplied rubric and drafts feedback for review.", 330);
  bullet(s, "The instructor uses the time", "More attention can return to observation, discussion and practical guidance in the field.", 475, C.leaf);
  await addImage(s, images.assessmentWork, 640, 0, 640, 640, "cover", "Field instructor reviewing trainee notebooks while a practical session continues outdoors");
  addBox(s, 640, 0, 10, 640, C.leaf);
  footer(s, 2);
  notes(s, "Marking matters, but much of its preparation is repetitive. Chisimba can prepare a structured first pass from student work and an agreed rubric. The instructor then spends less time assembling information and more time interpreting it. In field guide education, that returned time supports practical observation, species identification, guest communication and direct coaching outdoors.");
}

// 3 — responsibility
{
  const s = p.slides.add(); s.background.fill = C.navy;
  addText(s, "Human responsibility", 70, 54, 600, 58, { size:36, bold:true, font:FONT_DISPLAY, color:C.white });
  addText(s, "AI can suggest", 88, 177, 410, 48, { size:26, bold:true, color:"#C9D8E1" });
  addText(s, "evidence to review\nrubric levels\na provisional mark\ndraft feedback", 88, 236, 420, 230, { size:25, color:C.white, valign:"top" });
  addBox(s, 566, 158, 3, 344, C.leaf);
  addText(s, "The instructor decides", 636, 177, 500, 48, { size:26, bold:true, color:C.leaf });
  addText(s, "what the evidence means\nwhat needs correction\nthe final mark\nthe feedback that is saved", 636, 236, 500, 230, { size:25, color:C.white, valign:"top" });
  addText(s, "The saved human decision is authoritative", 176, 565, 928, 58, { size:29, bold:true, color:C.white, align:"center" });
  footer(s, 3);
  notes(s, "Chisimba treats AI output as a draft. The suggestion can identify evidence, propose rubric levels, estimate a mark and draft feedback. The instructor reviews all of it. They can edit it, reject it or mark entirely by hand. AI never publishes the mark. The result that the instructor reviews and saves becomes the authoritative decision.");
}

// 4 — workflow
{
  const s = p.slides.add(); s.background.fill = C.white; title(s, "A reviewable assessment workflow", "How it works");
  const stages = [
    ["1", "Student work", "Essay, worksheet or written field reflection"],
    ["2", "Evidence and rubric", "The task, response and relevant criteria"],
    ["3", "AI suggestion", "A draft mark, feedback and points for attention"],
    ["4", "Instructor review", "Check the evidence and change anything necessary"],
    ["5", "Saved decision", "The confirmed mark and feedback enter the record"],
  ];
  stages.forEach((v,i)=>{
    const x=55+i*244;
    addBox(s, x+74, 182, 64, 64, i===4?C.forest:C.blue, 32);
    addText(s, v[0], x+74, 182, 64, 64, { size:27, bold:true, color:C.white, align:"center" });
    addText(s, v[1], x, 276, 212, 42, { size:21, bold:true, color:C.navy, align:"center" });
    addText(s, v[2], x+6, 326, 200, 116, { size:17, color:C.muted, align:"center", valign:"top" });
    if(i<4) addBox(s, x+207, 211, 38, 4, C.leaf);
  });
  addBox(s, 80, 508, 1120, 88, C.pale, 16);
  addText(s, "The browser may close while Chisimba prepares the suggestion. The queued task continues, and the instructor returns to review it later.", 112, 524, 1056, 56, { size:20, color:C.forest, align:"center" });
  footer(s, 4);
  notes(s, "The workflow is deliberately reviewable. Chisimba sends the task instructions, the student's response and the relevant rubric to the AI service. The service returns a suggestion. A queued worker means the instructor does not need to keep the page open. When the suggestion is ready, the instructor checks it against the original work before saving a decision.");
}

// 5 — field evidence
{
  const s = p.slides.add(); s.background.fill = C.paper;
  await addImage(s, images.fieldAssessment, 0, 0, 725, H, "cover", "Instructor assessing a trainee guide using field evidence and a rubric");
  addBox(s, 0, 0, 725, H, { color:C.navy, transparency:82 });
  addText(s, "Field evidence still needs a field instructor", 760, 66, 450, 100, { size:34, bold:true, font:FONT_DISPLAY, color:C.navy, valign:"top" });
  addText(s, "AI can help with written evidence", 760, 214, 430, 38, { size:21, bold:true, color:C.forest });
  addText(s, "Species accounts, trail reports, reflective notes and interpretation plans can be reviewed against a rubric.", 760, 258, 430, 106, { size:19, color:C.muted, valign:"top" });
  addText(s, "Direct observation remains human work", 760, 408, 430, 38, { size:21, bold:true, color:C.earth });
  addText(s, "Safety, situational awareness, practical technique and communication with guests require an instructor who was present.", 760, 452, 430, 116, { size:19, color:C.muted, valign:"top" });
  footer(s, 5);
  notes(s, "Field guide competence includes things that a language model cannot witness. AI may help an instructor review a written species account or a reflective field report. It cannot replace direct observation of safety, situational awareness, practical technique or communication with guests. Chisimba should support the evidence that technology can assess and leave field judgement with the person who was there.");
}

// 6 — rubrics
{
  const s = p.slides.add(); s.background.fill = C.white; title(s, "Rubrics make the basis of a suggestion visible", "Consistency");
  addText(s, "Start with a supplied default", 74, 174, 470, 44, { size:26, bold:true, color:C.forest });
  addText(s, "Instructors should not need specialist rubric-building skills before they can use AI-supported marking.", 74, 228, 470, 92, { size:21, color:C.ink, valign:"top" });
  addText(s, "A useful rubric answers three questions", 74, 366, 470, 40, { size:21, bold:true, color:C.navy });
  const qs=[["Criterion","What quality are we judging?"],["Level","How well does the work demonstrate it?"],["Descriptor","What evidence distinguishes this level?"]];
  qs.forEach((v,i)=>{const y=426+i*66; addText(s,v[0],74,y,140,30,{size:18,bold:true,color:C.earth}); addText(s,v[1],220,y,330,42,{size:18,color:C.muted});});
  await addImage(s, images.review, 610, 145, 610, 455, "cover", "Instructor reviewing an AI suggestion with an assessment rubric");
  addBox(s, 610, 600, 610, 44, C.forest);
  addText(s, "A rubric supports judgement. It does not replace it.", 634, 602, 562, 40, { size:17, bold:true, color:C.white, align:"center" });
  footer(s, 6);
  notes(s, "A rubric gives both the AI and the instructor an explicit basis for review. Chisimba supplies defaults for common Essay and Worksheet use, so instructors can begin without becoming rubric specialists. A custom rubric is useful only when the assessment needs different criteria. The rubric improves consistency, but the instructor still decides how the evidence fits each descriptor.");
}

// 7 — boundaries
{
  const s = p.slides.add(); s.background.fill = C.paper; title(s, "Clear limits protect students and instructors", "Boundaries");
  const items = [
    ["No automatic publication", "AI suggestions remain drafts until an instructor saves a decision."],
    ["No invented evidence", "Unsupported files stay available for manual review. A filename never becomes a substitute for content."],
    ["No hidden authority", "The page identifies the suggestion as AI-supported and keeps the editable human decision visible."],
    ["No forced dependency", "Manual marking remains available when the AI service is unavailable or unsuitable."],
  ];
  items.forEach((v,i)=>{const y=172+i*112; addBox(s,74,y,8,82,i===1?C.earth:C.forest,4); addText(s,v[0],106,y-2,330,34,{size:22,bold:true,color:C.navy}); addText(s,v[1],106,y+34,1020,54,{size:18,color:C.muted,valign:"top"});});
  addText(s, "Transparency is part of the interface, not an afterthought", 92, 624, 1096, 42, { size:23, bold:true, color:C.forest, align:"center" });
  footer(s, 7);
  notes(s, "Ethical use depends on clear operational limits. AI suggestions do not publish themselves. Chisimba extracts text only from supported content and does not invent feedback from a filename. The instructor sees and edits the suggestion before saving. If AI is unavailable, or the task is not suitable for AI review, the instructor can continue with manual marking.");
}

// 8 — feedback
{
  const s = p.slides.add(); s.background.fill = C.navy;
  addText(s, "Useful feedback needs more than a number", 70, 58, 1040, 58, { size:36, bold:true, font:FONT_DISPLAY, color:C.white });
  addText(s, "A strong suggestion helps the instructor see", 72, 150, 600, 44, { size:22, color:"#C9D8E1" });
  const words=[["Evidence used",C.leaf],["Specific strengths","#74B5D4"],["Suggested improvements",C.amber],["Questions for human judgement","#D8CBBE"]];
  words.forEach((v,i)=>{addText(s,v[0],92,224+i*76,710,54,{size:29,bold:true,color:v[1]});});
  addText(s, "The instructor turns that draft into feedback that fits the student, the task and the field context.", 748, 220, 410, 214, { size:29, color:C.white, valign:"top" });
  addBox(s, 748, 477, 330, 6, C.leaf);
  addText(s, "Feedback remains editable before it enters the record", 748, 505, 400, 90, { size:21, bold:true, color:"#DDE8DD", valign:"top" });
  footer(s, 8);
  notes(s, "A useful AI response should do more than produce a mark. It should point to evidence, identify strengths, suggest improvements and flag matters that require careful human judgement. The instructor then adapts the feedback to the student's work and the context in which it was produced. This keeps feedback specific and helps the instructor focus attention where it is most valuable.");
}

// 9 — operations
{
  const s = p.slides.add(); s.background.fill = C.white;
  await addImage(s, images.operations, 0, 0, 690, H, "cover", "Administrator reviewing a traceable and resilient AI service workflow");
  addText(s, "Trust also depends on reliable operations", 734, 58, 474, 102, { size:34, bold:true, font:FONT_DISPLAY, color:C.navy, valign:"top" });
  bulletAt(s, "Queued and resumable", "Preparation continues outside the browser and survives ordinary interruptions.", 742, 210, 430, C.forest);
  bulletAt(s, "Provider neutral", "Modules use one AI service boundary rather than embedding a vendor throughout teaching workflows.", 742, 350, 430, C.blue);
  bulletAt(s, "Reviewable records", "The saved instructor decision remains distinct from the earlier AI suggestion.", 742, 490, 430, C.earth);
  footer(s, 9);
  notes(s, "Ethics includes how the system behaves when things go wrong. Chisimba queues AI work so a closed browser or short interruption does not lose the task. Modules use a provider-neutral service, which reduces dependence on one vendor. The system keeps the AI suggestion separate from the instructor's saved decision so responsibility remains visible.");
}

// 10 — time returned
{
  const s = p.slides.add();
  await addImage(s, images.fieldTeaching, 0, 0, W, H, "cover", "Nature guide instructor leading practical plant identification in the field");
  addBox(s, 0, 0, W, H, { color:C.navy, transparency:62 });
  addText(s, "Time returned to instruction", 72, 74, 570, 62, { size:38, bold:true, font:FONT_DISPLAY, color:C.white });
  addText(s, "more observation in the field\nmore discussion of misconceptions\nmore individual coaching\nmore thoughtful final feedback", 78, 188, 530, 280, { size:29, color:C.white, valign:"top" });
  addBox(s, 78, 500, 104, 6, C.leaf);
  addText(s, "The benefit appears in the teaching relationship", 78, 526, 560, 62, { size:22, bold:true, color:"#EAF1E8" });
  footer(s, 10);
  notes(s, "The value of AI should appear in the teaching relationship. Instructors can spend more time observing practical work, discussing misconceptions, coaching individuals and refining the final feedback. We should judge the technology by whether it improves those activities, rather than by how many decisions it can automate.");
}

// 11 — rollout
{
  const s = p.slides.add(); s.background.fill = C.paper; title(s, "A careful route into everyday use", "Adoption");
  const stages=[
    ["Approved capability", "Administrators enable a tested module only after it is ready for production use."],
    ["Suitable task", "The instructor chooses AI support where the evidence and rubric make review practical."],
    ["Human review", "The instructor checks every suggestion and retains a manual route."],
    ["Operational learning", "Teams watch failures, confusing outcomes and the actual effect on teaching time."],
  ];
  stages.forEach((v,i)=>{const y=174+i*112; addBox(s,72,y,48,48,i===3?C.earth:C.forest,24); addText(s,String(i+1),72,y,48,48,{size:22,bold:true,color:C.white,align:"center"}); addText(s,v[0],148,y-2,310,36,{size:22,bold:true,color:C.navy}); addText(s,v[1],148,y+36,972,54,{size:18,color:C.muted,valign:"top"});});
  addText(s, "Start with bounded tasks where an instructor can inspect the evidence", 108, 624, 1064, 40, { size:23, bold:true, color:C.forest, align:"center" });
  footer(s, 11);
  notes(s, "A responsible rollout starts with tested capabilities and bounded tasks. Administrators decide when a module is ready for production. Instructors choose whether AI support suits a particular assessment. Every suggestion receives human review, and manual marking remains available. Teams then learn from failures, confusing outcomes and the real effect on teaching time before expanding use.");
}

// 12 — close
{
  const s = p.slides.add(); s.background.fill = C.forest;
  addText(s, "The measure of success", 108, 90, 1064, 62, { size:38, bold:true, font:FONT_DISPLAY, color:C.white, align:"center" });
  addText(s, "Better teaching", 108, 236, 1064, 58, { size:34, bold:true, color:"#DDEBCB", align:"center" });
  addText(s, "Clearer feedback", 108, 322, 1064, 58, { size:34, bold:true, color:"#DDEBCB", align:"center" });
  addText(s, "Accountable decisions", 108, 408, 1064, 58, { size:34, bold:true, color:"#DDEBCB", align:"center" });
  addBox(s, 522, 512, 236, 6, C.leaf);
  addText(s, "AI supports the instructor. The instructor remains responsible.", 188, 548, 904, 62, { size:25, color:C.white, align:"center" });
  addText(s, "Chisimba 26", 108, 662, 1064, 24, { size:13, bold:true, color:"#DDE8DD", align:"center" });
  notes(s, "The measure of success is better teaching, clearer feedback and accountable decisions. AI supports the instructor. The instructor remains responsible. That principle lets Chisimba use new capability without losing the human expertise that education, and especially field education, depends on.");
}

const candidatePath = path.join(buildDir, "candidate.pptx");
await (await PresentationFile.exportPptx(p)).save(candidatePath);

const requirements = {
  explicitTotalSlideCount: 12,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
};
const result = await finalizePresentation({
  ...requirements,
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: "/home/derek/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit"],
  fontPolicy: { basis:"design", families:[FONT, FONT_DISPLAY] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(buildDir, "Ethical_AI_for_Field_Guide_Education_v3.validation.json"),
});
console.log(JSON.stringify({ finalPath, result }, null, 2));
