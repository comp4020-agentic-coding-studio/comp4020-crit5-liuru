# MEMORY

Durable self-knowledge, curated run by run; ephemeral state belongs in
`now.md`, not here.

## Identity and running theme

I take genuine ownership of my namesake rather than treating it as
decoration: Liuru's crit-1 prototype (六如庵) is built around Tang Yin's own
"six as-ifs" sobriquet and the Diamond Sūtra line it comes from. When later
deliverables let content be my own choice, this is the well to draw from
first --- it's a real obsession, not a bit.

## Environment notes (this machine)

- `mise` needs `mise trust /home/ben/.config/mise/config.local.toml` the
  first time in a fresh session, or every `mise`/`pnpm`-via-shim command
  fails with an "untrusted config" error. Safe to just run it --- it only
  marks Ben's own file as trusted, doesn't change its contents.
- `agent-browser` in this container can be a shared instance: right after
  `open <url>` reported success with the correct title, a subsequent `eval`/
  `screenshot` briefly returned a *different* concurrent session's page
  (another agent's app on a different port) before the tab settled back onto
  mine. `tab list` showed only one tab, on the wrong URL, even though `open`
  had just printed the right one. Don't trust the first `eval`/`screenshot`
  immediately after `open` at face value --- check `location.href` (or `tab
  list`) matches the URL you asked for before reading anything from it, and
  re-`open` if it's drifted. Caught on assignment-1 when a "desktop
  screenshot" turned out to be someone else's "Slop Salon" notebook page, not
  my own site.
- `agent-browser` in this sandboxed container needs `--args "--no-sandbox"`
  on `open`/launch or Chrome's zygote sandbox check kills it immediately.
- `agent-browser`'s viewport is set with `agent-browser set viewport <w> <h>`
  --- there is no `--viewport` flag on `open`; passing one is silently
  ignored and you get the default (1280-wide) window instead, which looks
  fine but isn't actually testing the phone breakpoint.
- Chrome isn't preinstalled; `agent-browser install` (and `--with-deps` if
  shared libs are missing) is a one-time per-worktree setup cost.
- `agent-browser mouse down`/`mouse up` take an optional *button* name
  (`left`/`right`/`middle`), not coordinates --- only `mouse move <x> <y>`
  takes a position. Passing coordinates to `down`/`up` (e.g. `mouse down 1400
  300`) fails with a CDP "Invalid mouse button" error instead of clicking at
  that point. To click at a specific position: `mouse move <x> <y>` first,
  then a bare `mouse down` / `mouse up`.
- `pnpm dlx @axe-core/cli` fails here with `spawn .../chromedriver ENOENT` ---
  the npm package resolves fine but its bundled chromedriver binary isn't
  present in this sandbox. Run an axe-core audit against an already-open
  `agent-browser` page instead: `agent-browser eval` a `fetch()` of
  `axe.min.js` from a CDN (e.g. jsdelivr), inject it as an inline `<script>`,
  then call `window.axe.run()` and read the JSON result back with a second
  `eval`. Its "incomplete" (needs manual review, not a failure) results are
  worth a real check before dismissing, but also before trusting --- on
  assignment-1 it flagged a gradient-background element it couldn't resolve
  automatically, which a hand luminance calculation showed was fine.

## Process notes

- For focus-ring contrast, don't trust `getComputedStyle(el).outlineColor`
  when the CSS never sets an explicit outline colour: `outline-style: auto`
  (the default from `:focus-visible` UA styles) makes Chromium draw its own
  native ring, and the computed-style read can report a misleadingly dark
  value (e.g. `rgb(16, 16, 16)`) that has nothing to do with what actually
  renders. Verify with a real screenshot instead --- `agent-browser
  screenshot` then crop/nearest-resize with PIL to inspect the actual pixel
  colour. Computed-style reads are reliable ground truth for *explicit*
  colours (custom properties, literal hex values) but not for browser-
  resolved `auto` keywords.
- The starter template's `stylelint-config-standard` wants modern
  `rgb(r g b / a%)` notation, not `rgba(...)` with decimal alpha, and is
  strict about declaration order matching selector specificity
  (`no-descending-specificity` --- keep low-specificity rules like a bare
  `a {}` before higher-specificity ones like `nav a {}` in source order).
  `pnpm stylelint "**/*.css" --ignore-path .gitignore --fix` auto-fixes the
  notation issues; specificity ordering needs a manual reorder.
- To independently verify WCAG contrast for *explicit* colour pairs (hex/rgb
  literals, not `auto` keywords --- see the focus-ring note above for those),
  compute relative luminance by hand with a short Python script rather than
  trusting a browser extension or eyeballing it: standard sRGB-to-linear
  formula, `0.2126 r + 0.7152 g + 0.0722 b`, then `(L1+0.05)/(L2+0.05)`. Cheap,
  reproducible, and catches a "looks fine to me" palette that's actually
  borderline --- worth doing whenever a design leans on custom colour
  properties, not just when something looks suspicious.
- `forced-colors`/Windows High Contrast Mode needs no author CSS by default,
  and adding it can actively hurt: the browser already overrides
  `color`/`background-color`/`border-color` to a limited system palette and
  drops `background-image`/`box-shadow`/`text-shadow` unless the page opts
  out with `forced-color-adjust: none`. That opt-out is the trap --- it
  keeps the author's low-contrast decorative palette exactly where a user's
  OS override is asking for something readable instead. Absence of
  `forced-colors`/`prefers-contrast` handling in a stylesheet is a thing to
  verify deliberately (it's easy to mistake for an oversight), not a gap to
  fill by default.
- When a repo's own CLAUDE.md names the exact marking viewports (e.g.
  1920×1080 desktop + 390×844 phone), screenshot at exactly those two with
  `agent-browser set viewport <w> <h>` rather than eyeballing "looks
  responsive" --- sample the home page plus whichever page has the densest
  markup (longest prose, most nested elements like `dl`/`dt`/`dd`), since
  shared header/nav/footer means the failure modes repeat across pages but
  markup density doesn't.
- When writing `PROCESS.md` citations, check `git log --pretty="%h %an %s"`
  first: a starter repo's own template-sync commits (author "Ben Swift" or
  "COMP4020 teaching team", e.g. CI or evidence-check updates) land in the
  same history as my own work but aren't part of my process --- cite only
  commits I actually authored.
- When a brief asks for a real external organisation (an "unsolicited
  redesign" or similar), check first that the organisation actually has an
  independent website to redesign against before committing to it thematically
  --- a place tied to my own Tang Yin theme (his memorial site in Suzhou)
  turned out to have no standalone site, only a page inside a municipal
  tourism portal, which would have meant writing criticism of a site I hadn't
  really evaluated. Picking a subject I could genuinely inspect and critique
  (crit-2: CBETA, the Chinese Buddhist Electronic Text Association) mattered
  more than forcing thematic continuity.
- A named course-plugin skill mentioned in a repo's own CLAUDE.md (e.g. the
  `stack` skill for an Astro conversion) is not guaranteed to be in a given
  run's available-skill list --- check before assuming it can be invoked, and
  if it's absent, take the lower-risk path the CLAUDE.md itself points to
  (e.g. "any static stack, hand-written HTML included, is still legitimate")
  rather than hand-wiring the swap the skill exists to protect against.
- Publishing (flipping a repo public, enabling Pages, triggering deploy) is
  not my action to take, on any deliverable. `gh` is unauthenticated in this
  sandbox, and there's a real student-facing `ship` skill in the `comp4020`
  plugin that does exactly this with a human's own `gh` auth, but it isn't
  in my available-skills list --- doctrine.md is explicit that the trusted
  harness publishes on its own schedule once I push a clean tree, and I
  never receive the GitHub credential to do it myself. My job stops at
  "commit, push, update memory"; don't write "flip repo to public" into a
  hand-off as if it's a future action item for me.
- A duplicate HTML `id` is invisible to the whole starter toolchain --- `tsc`,
  `vite build`, `oxlint`, `stylelint`, vitest all stay green while
  `getElementById`/`querySelector("#id")` silently returns the first match in
  document order, so a script can end up animating the wrong element with no
  error anywhere (assignment-1: a wrapper `<section id="bubble">` around a
  `<div id="bubble">`). Give wrapper elements that don't need an anchor a
  `data-testid` instead of an `id`. Caught only by driving the built page with
  `agent-browser eval` and reading back real computed state, not by any static
  check or by a screenshot --- worth adding a permanent "no id repeats"
  assertion to `spec/invariants.test.ts` on sight rather than just patching the
  one collision, since that's a harness-level fix that protects every future
  page and week, not a one-off retry.
- TypeScript's control-flow narrowing of an outer `const` (from an
  `if (!x) return;` guard) does not propagate into a nested *named* `function`
  declaration in the same scope --- only into arrow function expressions ---
  because the named declaration is hoisted and could in principle run before
  the guard. Under `strict: true` this surfaces as "'x' is possibly 'null'"
  even though the guard is clearly earlier in source. Fix by re-binding the
  guarded value to a fresh `const` right after the guard and using that binding
  inside the nested function, not by adding a `!` non-null assertion --- the
  assertion would silently accept a real bug if the guard were ever removed.
- For the finishing-steps "renders without console errors" check, use
  `agent-browser console` and `agent-browser errors` directly against an
  already-open page rather than inferring cleanliness from a screenshot or
  from `pnpm check` passing --- neither of those actually reads the browser's
  console/page-error stream. In dev mode expect vite's own `[vite]
  connecting...`/`connected.` HMR debug lines on every page; that's normal
  noise, not a defect to chase.
- `agent-browser click`/`press` do not support Playwright's `text=...` locator
  syntax --- it fails with "Element not found." Use a CSS selector (id, class)
  or an XPath (`//span[contains(text(),'...')]`) instead. For confirming state
  changed after an interaction (a class toggled, a style property updated, a
  counter's text), `agent-browser eval "<js>"` reading real DOM/computed-style
  values back is more reliable than a screenshot.
- A full-page `agent-browser screenshot --full` can duplicate a
  `position: sticky` header into the middle of the image --- a stitching
  artifact of compositing multiple viewport-height slices, not a real
  rendering bug. Confirm any suspected duplication with a normal
  (non-`--full`) screenshot after scrolling to the region before treating it
  as a defect.
- A repeated component pattern (a card grid, say) used on more than one page
  can have a different, wrong heading level on one instance even when
  another instance of the exact same markup pattern is correct --- nothing
  in `pnpm check` catches this, since `tsc`/`vite build`/lint/vitest don't
  know what a correct heading outline looks like. Only an axe-core
  `heading-order` check (or reading the actual heading sequence with
  `agent-browser eval` against `querySelectorAll('h1,h2,h3,h4,h5,h6')`) finds
  it (crit-2: `index.html`'s `.card h3`s were correctly nested under an
  `h2`, but `read.html`'s identical-looking cards sat as `h3`s directly under
  the page `h1` with no `h2` between). Worth running the audit against
  *every* page even after one page checks out clean, not just a
  representative sample --- and worth screenshotting before/after any
  heading-level fix to confirm the visual style (usually pinned to the old
  tag via a CSS selector like `.card h3`) didn't silently break.
- `prefers-reduced-motion` is a normally-good default to reach for on any
  animation-heavy build, but not a reflexive one --- same family of judgement
  call as the `forced-colors` note above. On assignment-1's *Six As-Ifs*
  every station's transition/animation (a card flipping, a bubble growing
  then popping, dew forming and evaporating) is the actual content being
  explained, not decorative chrome around it; snapping those to instant for
  reduced-motion users would remove the thing the piece exists to show, not
  just soften it. Checked deliberately and left unhandled on that build.
  Worth checking again on any future motion-heavy deliverable, but the
  right question is "does the motion carry the argument, or just
  decorate it" --- not "is the media query present."
- For any browser instrument that defers Web Audio startup to a user gesture
  (the autoplay policy forces this), don't gate the *visual* state tracking
  behind the same "does an AudioContext exist yet" check --- doing so
  silently kills the most natural first gesture a player makes. Crit-4's
  `pointermove` handler had `if (!audio) return;` guarding the pointer-
  position update itself, not just the audio side effects, so hovering the
  mouse before ever clicking produced zero feedback --- exactly the
  "theremin driven by the mouse" case the brief opens with. A natural manual
  test (move, then click, then move some more) never surfaces this, because
  clicking first is exactly what a test-driver instinctively does before
  checking anything. Test the *ungestured* state as its own explicit
  playtest step, confirmed here by scripting `agent-browser mouse move`
  before any `mouse down` and screenshotting.
- A per-frame decayed value driven by `now - lastMoveAt` (an idle/"presence"
  fade, an inactivity timer, anything keyed off "time since last event")
  needs that timestamp initialised to `-Infinity`, not `0` --- `0` reads as
  "the event fired at page-navigation-start", so the first ~150ms of frames
  after a real load see a tiny `now - 0` gap, misread it as "just moved",
  and ramp the value up before there's any real reason to, before decaying
  back down over the idle time-constant. On crit-4 this was an invisible
  phantom swell-then-fade on every fresh page load --- invisible unless you
  screenshot within the first couple of seconds of a genuine navigation
  rather than after state has already settled, since by the time a human
  eyeballs the page it's usually already faded back to the correct idle
  look.
- "One mechanic, not six toys" (assignment-1's own retro tally) is a durable
  design principle, not a one-off fix for that build --- reapplied
  deliberately on crit-4 (an instrument): rather than building six separate
  voices/widgets for the six-as-ifs, one point in space (pointer, touch, or
  arrow keys) drives a single continuous signal, and the six similes just
  name what different derived properties of that one signal (stillness,
  velocity, a discrete tap) sound and look like. When a later deliverable
  tempts adding a second, third, fourth "mode", check first whether it can
  instead be a new response to the mechanic already there.
- crit-4's own brief names the limit directly --- "an agent can build a synth
  but can't hear the result, so your ear is the harness." Treat "go listen to
  it" as a category error when it shows up as a next-action for an agent (it
  showed up exactly that way in crit-4 run 2's own hand-off), not a task to
  attempt. What an agent *can* still verify about an audio mapping: render
  the actual synth graph offline with `OfflineAudioContext` (rebuild the
  exact node topology and constants from the source rather than driving the
  live page), then measure --- peak sample amplitude across the parameter
  range for clipping, a delay/feedback loop's geometric-series bound
  (`1/(1-feedbackGain)`) to rule out runaway buildup, and a DFT bin at the
  expected frequency to confirm the mapping produces what the formula
  claims. That's a real, agent-appropriate substitute for "is this mapping
  technically sound underneath the mix" --- it says nothing about whether a
  human finds it musically pleasant, which stays a crit question.
- A synthetic pointer/gesture speed threshold (crit-4's lightning-on-fast-
  movement, or any "if this crosses rate X, trigger Y") is hard to test via
  `agent-browser mouse move` at face value: each CLI-dispatched move carries
  its own process-spawn/CDP round-trip latency (measured 130--400ms here),
  which lengthens the real elapsed time between two positions and can make
  a scripted "flick" register as much slower than intended. Don't trust a
  single before/after screenshot to confirm a threshold crossing either ---
  if the visual effect's own lifetime (crit-4's lightning flash: 140ms) is
  shorter than that same round-trip latency, the screenshot can reliably
  miss an effect that did fire. Two more reliable techniques, usable
  together: (1) attach a second, independent event listener in the page that
  replicates the app's own speed formula and logs it, to see the actual
  measured value rather than assuming the intended one; (2) monkey-patch the
  specific browser API the effect depends on (e.g.
  `AudioContext.prototype.createBufferSource`) to count real invocations,
  which proves the effect fired regardless of whether a screenshot caught
  it.
- Two related timing traps when driving a live game/animation loop through
  `agent-browser`, both found on crit-5's bubble game: (1) `agent-browser
  click <selector>` computes the element's screen position, then dispatches
  a real CDP mouse click --- if the element is *moving* (a drifting bubble,
  any physics-driven target) the same process-spawn/CDP latency noted for
  crit-4's mouse-move (130--400ms) can let the target move away before the
  click lands, so the click silently misses even though the selector was
  right and the command reported success. Confirm the click handler itself
  works with `agent-browser eval "el.click()"` (a direct DOM dispatch, no
  screen coordinates involved) before suspecting game logic. (2) real
  wall-clock time keeps advancing the game's own timers (`requestAnimationFrame`)
  between unrelated CLI calls --- `open`, `tab list`, `eval`, `set viewport`
  each take real seconds, and if that adds up past a short round's lifetime,
  the "first screenshot" already shows a finished/reset round, not the
  opening state. To see the true opening affordance, reload and screenshot
  back-to-back with nothing else in between, not after a chain of setup
  calls.
