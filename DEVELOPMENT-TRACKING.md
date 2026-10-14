# Development Tracking

## 2026-08-30 — Agentic Hackathon Submission (branch: agentic-hackathon)

Scope: transform the pre-existing La Bàn platform (snapshot commit `4c5ac25`)
into a micro1 Agentic Workflows Hackathon submission. Plan:
`docs/superpowers/plans/2026-08-30-agentic-hackathon-submission.md` (18 tasks,
all completed). Spec:
`docs/superpowers/specs/2026-08-30-agentic-hackathon-submission-design.md`.

### What was built

- **4-agent pipeline** (`src/agents/`): Profiler -> Evidence Gatherer
  (function-calling over 3 deterministic tools) -> Analyst (cite-only-from-pack)
  -> Verifier (schema + guardrail + citation grounding + LLM judge) with repair
  loop (max 2) and parse-error recovery. Orchestrator with ablation flags and
  full trajectory logging.
- **Shared Gemini client** (`src/agents/geminiClient.ts`) extracted from
  server.ts; key rotation and model fallback chain preserved.
- **Frozen baseline** (`src/agents/baseline.ts`) — verbatim legacy prompt.
- **Endpoints**: `/api/agent/career-analyze`, `/api/eval/baseline`,
  `/api/agent/health` (honest 500s, no mock fallbacks).
- **Eval harness** (`eval/`): 12 personas incl. watch-repairer challenging
  case; shared scoring with independent temperature-0 judge; HTTP runner.
- **Firebase removed** (guest mode + localStorage via `src/lib/localData.ts`).
- **UI**: suggestion flow on agent endpoint + AgentTransparencyPanel.
- **Deliverables**: README, IMPROVEMENT_CHANGELOG, REPRODUCTION_GUIDE,
  EVALUATION, TRAJECTORIES, VIDEO_SCRIPT (all English).

### Verification results (final pass, 2026-08-30)

- `npm run lint` (tsc --noEmit): 0 errors
- `npx vitest run`: 58/58 tests pass (12 files)
- `npm run build`: production build succeeds
- Server start: clean (`La Bàn Server running on http://0.0.0.0:3000`), no
  ERROR-level startup lines
- Live agent call: HTTP 200, verdict pass
- Published eval run `2026-08-30T10-53-20`: baseline 91.7% grounding /
  2 hallucinated citations vs final agent 100% / 0; 12/12 ok runs in all
  configs; cost $0.0024 -> $0.0040 per task
- Final independent code review: Ready to submit (no critical issues)

### Notable decisions

- Frozen baseline duplicated verbatim (not imported) so the legacy endpoint
  stays untouched and the comparison is provably fair.
- Verifier checks citations against the GLOBAL corpus (shared checker with
  eval) so runtime verification and measurement cannot drift.
- Parse-retry added (commit `a9e5b2e`) after an exploratory run showed
  malformed JSON killing long outputs; unit-tested, kept within the same
  repair budget.
- Firebase removed rather than isolated to a new project: no value for
  scoring, and the old project had public-write rules.
- Model note: `gemini-3.7-flash` is primary but was unavailable with our key;
  all published calls ran on fallback `gemini-3.5-flash-lite` (recorded
  per-call in trajectories).

## 2026-10-13 — Social-impact upgrade (branch: social-impact-upgrade)

Scope: extend the agent from "verifiably grounded text" to "sound, actionable
direction for exposed workers". Plan:
`docs/superpowers/plans/2026-10-13-social-impact-upgrade.md` (15 tasks,
all completed). Spec:
`docs/superpowers/specs/2026-10-13-social-impact-upgrade-design.md`.

### What was built

- **Decision-coherence checks** (`src/agents/coherence.ts`): the verifier
  rejects a top recommendation whose resilience is below the user's
  current-occupation floor (55 when unmatched) or supported by a 'declining'
  Vietnam demand signal; failures feed the repair loop.
- **Registry-grounded budget-aware resources** (`src/data/learningResources.ts`,
  16 HTTP-verified URLs; `searchLearningResources` tool): every suggestion's
  resource URLs must exact-match the registry; milestones carry costTier +
  estimatedCostVND; at least one milestone must fit the monthly budget.
- **Equity segmentation**: 16 personas across 5 worker segments
  (knowledge_worker, wage_worker, rural_agricultural, student, craft_trade);
  per-segment scoring in the eval report.
- **3-rep stability protocol**: `npm run eval` defaults to 3 repetitions and
  emits `STABILITY.md` (mean ± sd); `--reps N` and `--render-only <baseStamp>`
  flags.
- **Counselor-review gate** (human in the loop) demonstrated in the UI;
  EN-primary output localization with VND/USD dual display at a fixed rate
  (1 USD = 26,000 VND, computed in `src/agents/usd.ts`).

### Published evaluation (2026-10-13T05-05-07, 16 personas x 3 reps = 144 runs)

- Stability (mean ± sd, baseline → final): grounding 89.5% ±1.5% → 99.0%
  ±1.5%; coherence 100.0% (weaker baseline floor) → 95.8% ±5.9% (ablation
  stage1 87.5% ±5.1); actionable-path 0.0% → 93.8% ±0.0%; personalization
  86 ±2 → 80 ±3.
- Honest failures documented: r3 golden-2 and r2 accountant/student ended in
  visible `repair` verdicts; garment/farmer actionable misses remain open.
- Per-segment (r1, final): grounding and coherence 100% in all segments;
  rural_agricultural actionable 50% is the open equity gap.

### Verification results (docs pass, 2026-10-13)

- `npm test`: 93/93 pass; `npm run lint`: 0 errors
- Docs-only change; all numbers cross-checked against
  `eval/results/runs/2026-10-13T05-05-07-stability/STABILITY.md` and the
  r1/r2/r3 EVALUATION.md files.

### 2026-10-13 (final) — Demo-safety guard

- Analysis button disabled with a bilingual hint when the intake form has
  no current role (the agent step rejects empty roles with a 400; verified
  in-browser: disabled initially, enabled after filling the role).

## 2026-10-14 — i18n macro-panel fix + dead citation URLs (branch: main)

Bug fixes reported against the EN UI:

1. **AI Era SWOT panel showed Vietnamese in EN mode**: the macro-analysis
   endpoint returned Vietnamese-only data (both `DEFAULT_MACRO_DATA` and the
   Gemini prompt), so the frontend's `*En` fallback always missed. Fix in
   `server.ts`: added `strengthsEn/weaknessesEn/opportunitiesEn/threatsEn`
   and per-row `nameEn` to `DEFAULT_MACRO_DATA`; prompt now requires English
   mirrors; responses without them fail validation and fall back to the
   bilingual baseline. Verified live: `gemini_direct` returned all 8 SWOT
   keys + `nameEn` on all 10 shift-share rows.
2. **Shift-Share chart industry names in Vietnamese in EN mode**: same root
   cause and same fix (`nameEn` now served and rendered via
   `localizedShiftShareData`).
3. **404 citation URLs** (ILO site revamp + dead TopCV path): replaced
   `ilo.org/publications/generative-ai-and-jobs...` with the stable DOI
   `https://doi.org/10.54394/FHEM8239` (verified 302 -> ILO Research
   Repository, 200) and `topcv.vn/bao-cao-thi-truong-tuyen-dung` with
   `https://insights.topcv.vn/recruitment-report-2025-2026-vie` (verified
   live) across `researchLibrary.ts`, `defaultCareerAnalysis.ts`,
   `dynamicCareerGenerator.ts`, `vietnamOccupations.ts`, `goldenProfiles.ts`.

Verification: `tsc --noEmit` 0 errors; vitest 93/93 pass; server boots clean
on :3000; `/api/gemini/macro-analysis` 200 with bilingual payload; no
occurrences of the dead URLs remain under `src/` or `server.ts`.

## 2026-10-14 (later) — Citation de-hallucination pass + job-security video section (branch: main)

External fact-check found 2 wrong / 1 unverifiable claim among the 5 headline
citations; a full sweep found more fabricated attributions. All replaced with
verified findings; every cited URL re-validated (200/302).

### Citation fixes (user-supplied fact-check + own sweep)

1. **GPTs are GPTs**: dropped invented "beta-exposure = 64%"; now the paper's
   real 80% (>=10% tasks) / 19% (>=50% tasks) findings.
2. **WEF FOJ 2023**: fixed misattributed "14M admin decline" -> net -14M
   global (69M created / 83M displaced, 2% of employment), admin &
   record-keeping -26M by 2027; "44% skills disrupted" scoped to 2023-2027.
3. **ILO WP96**: dropped invented "75% augmentation"; now augmentation
   conclusion + clerical 24% high / 58% medium exposure.
4. **Stanford AI Index (BCG/Harvard)**: added the frontier caveat
   (12.2% more / 25.1% faster / 40% quality inside; -19pp outside).
5. **Vietnam report**: replaced the nonexistent "GSO+MOLISA+TopCV" joint
   report with TopCV's real Recruitment Market Report 2024-2025 (5th annual
   edition, 11 Dec 2024, ~300,000 postings analyzed;
   insights.topcv.vn/recruitment-report-2024-2025, verified 200).
6. **Sweep**: removed fabricated org-attributed stats from
   vietnamOccupations.ts (71.4%, 48% YoY, 115%, 180%, 88%, "100% exposure",
   "43% faster", "45% time-to-hire", "+32% deals", "+10% education"),
   goldenProfiles.ts (71.4%, 35-50% salaries, 43%), researchLibrary.ts
   (72%/65%/28-35% TopCV claims, "35-50% cycle time"), and mockData news
   (invented "WEF 2026"/"Stanford+ILO 2026 study"/"Vietnam survey 2026" ->
   real WEF FOJ 2025 [170M/92M/net +78M by 2030, 39% skills, 63% gap],
   TopCV 2024-2025, ILO WP96; MOLISA news link -> baochinhphu.vn, verified).
   JobSecurityNewsView Top-20 chips relabeled "La Bàn Index" (internal model
   scores, previously mislabeled WEF/Gartner/McKinsey/O*NET/WHO).
   URL checks: WEF publication pages bot-block curl (403) but official PDFs
   on reports.weforum.org return 200; HBS/BCG links 200; DOI 200.

### New feature: AI job-security video section

- `src/components/AiJobSecurityVideos.tsx`: two verified-live VTV24 YouTube
  embeds ("A.I đang tái cấu trúc thị trường lao động như thế nào?",
  "Giới trẻ đối mặt áp lực trên thị trường lao động"), flex row ->
  column on mobile, rendered above CurrentRoleOverviewSection (homepage
  'suggest' tab). Embeds use youtube-nocookie.com; both oEmbed-verified.

### Known leftover (not rendered, left untouched)

- `mockData.ts` INITIAL_PROOF_* `trendingList`/`vulnerableList` carry
  invented `primarySource` names + one 35-50% claim, but ProofDashboard
  renders only top-level counters — dead data, flagged for later cleanup.

### Verification

- `tsc --noEmit` 0 errors; vitest 93/93 pass; live dev server: home 200,
  new module compiles, macro endpoint bilingual (gemini_direct with En
  mirrors).

## 2026-10-14 (final) — Second fact-check round + 20 career-card citation audit (branch: main)

Follow-up external fact-check confirmed round 1; two corrections requested
plus a full audit of the "International Research Evidence" blocks in the
20 career cards.

- **WEF title**: removed "- 2025 Outlook" / "& 2025" suffixes everywhere
  (defaultCareerAnalysis, dynamicCareerGenerator, researchLibrary,
  goldenProfiles) -> "The Future of Jobs Report 2023"; researchLibrary date
  now "May 2023 (forecasts for 2023-2027)".
- **19pp attribution**: headline citation #4 now cites the real source —
  Dell'Acqua et al., "Navigating the Jagged Technological Frontier" (HBS &
  BCG, RCT with 758 consultants; 12.2%/25.1%/40% inside frontier, -19pp
  outside), noted as cited by Stanford AI Index 2024; URL -> verified HBS
  PDF. Same numbers also power the trend-2 card.
- **TopCV enrichment**: methodology now includes the verified ~3,000
  surveyed enterprises/workers alongside ~300,000 postings.
- **20 career-card citations** (trendingCareers + vulnerableCareers): all
  fabricated titles/quotes replaced with real, verifiable papers — GPTs are
  GPTs (80%/19%, design/translation/writing exposure), Jagged Frontier,
  HELM (multi-metric evaluation), RAG (Lewis et al. 2020), Topol Nature
  Medicine 2019 ("gift of time"), McKinsey "Unlocking success in digital
  transformations" 2018 (70% fail), ILO "ASEAN in Transformation" 2016 (86%
  Vietnam TCF automation risk), ILO WESO 2018 "Greening with Jobs" (24M
  jobs by 2030), GitHub Copilot study (55.8% faster), WEF 2023 (bookkeeping
  decline, -26M admin), ILO WP96 (clerical/booking 24%/58%), "GPT-4 Passes
  the Bar Exam" (75th percentile UBE), MGI "A Future That Works" 2017
  (~50% activities automatable, finance high). Removed invented figures
  (96%, 80% bookkeeping time, 70% creative time, 65% test cases, 60% calls/
  review time, 55%/50% market shrink, 45% FDI, 1.2M green jobs, BLEU 85%).

### Verification (second round)

- `tsc --noEmit` 0 errors; vitest 93/93 pass; live dev server home 200 and
  serving the updated data module; leftover-pattern grep clean.

## 2026-10-14 (final pass) — Full citation-URL audit (branch: main)

Swept every external URL under `src/` and `server.ts`; verified each with
curl (200/301) or, for bot-blocked domains (gartner.com, pwc.com,
career.fpt-software.com, weforum.org), via browser rendering and
publisher/Google-index evidence. Fixed or replaced everything dead or
stale:

- **mockData.ts applyUrls**: fptsoftware.com/careers ->
  career.fpt-software.com; tiki.vn/careers -> tuyendung.tiki.vn;
  mindx.edu.vn/careers -> mindx.edu.vn; enclave.vn/careers ->
  enclave.vn/career (all verified live).
- **researchLibrary.ts**:
  - Gartner: dead 2024-06-17 newsroom URL -> live report document page
    gartner.com/en/documents/5505695 (Hype Cycle for AI, 2024, Afraz
    Jaffri; "past the Peak of Inflated Expectations" wording confirmed
    via licensed report reprints).
  - PwC: entry updated from the stale 2024 figures (25% wage premium /
    4.8x, no longer on the live page) to the live 2026 AI Jobs Barometer
    (40% productivity lead, skills changing 2x faster, professionalised
    jobs growing 2x with 42% faster wage growth since 2021, junior roles
    7x more likely to demand senior skills; canonical /services/ai/
    URL; every figure verified verbatim on the rendered page).
  - Deloitte: www2 404 URL -> live state-of-ai-in-the-enterprise page.
  - Accenture: 404 insights URL -> live gen-ai-talent insight.
  - VSCO (Quyet dinh 34/2020/QD-TTg): bot-blocked thuvienphapluat page
    (which also carried the wrong doc id 458925) -> official government
    portal vanban.chinhphu.vn (docid=201721, HTTP 200).
  - IMF SDN 2024/001: author corrected "Mauro Cesa" -> "Mauro Cazzaniga"
    (verified on the IMF publication page, now fully rendered).
  - Upwork "AI and the Freelance Economy Report" entry REMOVED: all
    Upwork domains (incl. investor relations) are Cloudflare-blocked and
    the "40% increase in project completion rates" claim could not be
    verified from any source — fails the project's zero-hallucination
    bar. (The 1000% YoY genAI-posts stat is real but belongs to other
    Upwork publications; not reused.)
- Leftover-pattern grep across src/ + server.ts: no occurrences of any
  replaced URL remain.

### Verification (final pass)

- `npx tsc --noEmit`: 0 errors; `npx vitest run`: 93/93 pass;
  `npm run build`: succeeds.
- Dev server (after killing stale :3000 process): clean boot, home 200,
  0 ERROR-level log lines; server stopped after verification.
- Also included: user's own edit to ComprehensiveCareerRadarView.tsx
  (shortened scatter chart title).
