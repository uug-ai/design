# UUG.AI Design System

A comprehensive design system website for UUG.AI, built with React, TypeScript, and Vite.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the design system in your browser.

### Build

The production container uses digest-pinned Node and Go builders and a
shellless Chainguard nginx runtime. Both the app and Storybook use the committed
dependency lockfile; no UI or browser configuration is generated at startup.

```bash
npm run build
```

### Build App And Storybook

```bash
npm run build:all
```

This builds the Vite app into `dist/` and Storybook into `dist/storybook/` in one step.

### Production image contract

- Registry: `ghcr.io/uug-ai/design`; release tags and immutable digests are
  published for `linux/amd64` and `linux/arm64`.
- UID/GID: `65532:65532`. Entrypoint `/app/main` replaces itself with nginx;
  static assets and configuration are root-owned and read-only.
- HTTP port: **8080** (previously 80). Keep external service port 80 if desired,
  but change Kubernetes container ports, Service `targetPort`, and probes to
  8080 before deploying this image. No Helm chart is maintained in this repo.
- `/` and app deep links serve the Vite application; `/storybook/`, its iframe,
  JSON story index, and browser assets retain their existing paths and MIME
  types. Existing HTML, inline scripts, and CSP behavior are unchanged.
- Liveness/readiness: `GET /healthz`, port 8080, expected `200` and `ok\n`;
  use a two-second probe timeout. This checks nginx, not external dependencies.
- Run with a read-only root filesystem, all capabilities dropped,
  `no-new-privileges`, and a writable `/tmp` tmpfs (16 MiB, mode 1777,
  `nosuid,noexec`). nginx writes its PID and temporary request files there only.
- No environment variables, secrets, timezone data, outbound connections, or
  runtime CA certificates are required by the server. Browser network requests
  remain those of the existing application.

**Bump release** exposes a `hardened` checkbox, unchecked by default. It reserves
a draft release and normally builds/publishes both native images without the
additional hardening verification, SBOM/provenance publication or signing.
Direct GitHub release creation also uses the standard path. The Dockerfile's
non-root/minimal runtime remains unchanged.

Enable `hardened` to invoke the shared `frontend` profile. Set `publish=false`
to build without a release; enable `hardened` too for full verification.
Use `existing_tag` to retry the same immutable source. PRs and dedicated
security scans keep their hardening profile without publication.
It scans source secrets/configuration and the final image,
extracts `/usr/share/frontend/package{,-lock}.json` from that final image and
**separately scans it**, emits image and browser SPDX SBOMs, retains reports and
provenance, and signs the verified multi-platform digest. Medium, high, and
critical findings block publication under the shared policy.

After successful publication, release notes show **Image hardening: Verified
(security checks, SBOM, provenance and signing)** or **Image hardening: Not
verified (standard build)**. Retries refresh that indicator without deleting
existing notes. Draft finalization and the release-note update precede GitOps.

Storybook addons are build-time dependencies that also ship browser code.
`scripts/image-inventory.mjs` therefore conservatively classifies the entire
locked dependency tree as runtime inventory, including build tools; this avoids
silently omitting Storybook through a scanner's default dev-dependency filter.
The normalized inventory lives outside the web root and does not modify source
manifests or bundle content. The build dependencies and React Router are updated
to patched compatible versions; no components or route definitions are changed.
Findings still require remediation or a centrally
approved exception; inventory does not imply a clean scan.

Hardened CI retains release evidence as `hardened-source`, `hardened-image-amd64`,
`hardened-image-arm64`, and `hardened-release` workflow artifacts. Verify a
published hardened digest using:

```bash
cosign verify \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp '^https://github.com/uug-ai/workflows/.github/workflows/release-create.yml@refs/heads/main$' \
  ghcr.io/uug-ai/design@sha256:<published-digest>
```

The shared workflow must retain its `frontend` inventory scan, generic
`image/smoke-test.sh` hook, provenance, and signing gates. The smoke test checks
the actual app routes, Storybook iframe/index, JS/CSS MIME types, and favicons
under the read-only runtime restrictions.

### Preview App And Storybook

```bash
npm run preview:all
```

This serves the built output locally with the same paths used in production:

- App: `/`
- Storybook: `/storybook/`

### Storybook

```bash
npm run storybook
```

Storybook runs on [http://localhost:6006](http://localhost:6006) and exposes the
production Hub widget library in `src/components/HubWidgets` and the customer
emails in `src/components/Emails`.

### Emails

**Emails** previews the transactional emails we send customers. **Emails / License**
is the license email that uug-ai/hub-license sends when a license pull request is
merged. Its `template.html` and `template.txt` are copies of
`.github/license-email/` in hub-license, which stays the source of truth: change the
template there first, then copy it here. Use the Controls panel to try other
customers, device counts and validity periods.

**Emails / License v2** puts the license email on the Notifications v2 layout and adds
two proposed emails: a reminder a month before a license expires and a notice once it
has expired, each with its own colour and illustration. Their content is in
`Notifications/v2/emails.ts` (`LICENSE_EMAILS`) and uses hub-license's `$placeholders`
plus `$expires`. hub-license only sends the first one today.

**Emails / Notifications** holds the 13 Kerberos Hub emails that
uug-ai/hub-pipeline-notification sends (welcome, password reset, detections, device
status, shared cases and more), filled with sample values. Their `templates/*.html`
and `*.txt` are copies of the `TEMPLATE_*` strings in that repository's
`templates/*.go`, saved under the names the service looks them up by; the Go files
stay the source of truth. Edit `values` in Controls to try other content.

**Emails / Notifications v2** is a proposed redesign of those emails on the license
email layout. Each email has a category colour (Account, Security, Detection, Camera
status, Usage, Sharing, Tasks) and an isometric spot illustration drawn with the
Illustrations kernel (`v2/figures.ts`), so its purpose is clear before the text is
read. The content of all 13 emails lives in `v2/emails.ts`, which generates both the
HTML and the plain-text version with the placeholders the service already fills.
Every illustration is a 16:9 image with its category tint, floor grid and an isometric UUG logo coin
(top right) baked in,
so the header keeps its shape in every email client. Storybook shows them as SVG;
the emails reference 1280 x 720 PNG exports at
`https://uug.ai/email/<template>.png`, which still have to be exported and published
before the templates can replace the current ones.

### Components (Production Design Reference)

**Components** extracts the reusable widget presentations from
[hub-frontend](../hub-frontend/kerberos.ng/src/app/shared/widgets) into React.
Start with **Surfaces / Composition** to see them together. Use the **Hub theme**
toolbar to switch between the production light and dark palettes in Canvas and
Docs. The former marketing/brand component stories have been removed.
**Components** is the sole component catalog, with one top-level group and no
Hub/Widgets nesting.

The site's **Components** navigation links open this Storybook directly; the old
`/components` route redirects there. The Illustrations group shows the isometric
figures from [src/components/IsoIllustration](src/components/IsoIllustration)
(`agent`, `control-tower`, `hub`, `vault`, `factory`); they render plain SVG strings (`renderIsoSvg`) so
non-React apps such as the Angular Hub frontend can reuse the same drawings.
Site layout, branding tools, and foundation-page helpers remain
internal to the documentation site; they are not published as library components.

The implementation is in [src/components/HubWidgets](src/components/HubWidgets).
Wrap these components in `HubTheme` when using them outside Storybook:

```tsx
import { HubButton, HubTheme } from './components/HubWidgets'

<HubTheme theme="dark">
  <HubButton>Add camera</HubButton>
</HubTheme>
```

The reusable-component catalog includes 94 stories in 12 groups:

| Story group | Hub source widgets |
| --- | --- |
| Buttons | `button`, `inlinebutton`, `block-button`, success flash and mobile text states |
| Forms | `input`/textarea, `search`, `colorinput`, `tags`, `checkbox`, `slider` switch, icon/text `multitoggle`, filter sizes |
| Selection | `selectinput`, `radioselect`, `select-overlay`, `multiselect`, `multiselect-overlay`; search, clear, locked options, errors, readonly and loading |
| Date and time | `dateinput`, `datepicker`, `time-spinner`; recordings-toolbar filter, field/button appearances, bounds, available dates, localized calendar labels and keyboard navigation |
| Scheduling | `range-slider`, `weekly-schedule`; pointer/keyboard editing, exact-minute readouts, add/remove and non-overlapping segments |
| Menus | `actions-menu`, `controls-popup`; single/no-action behavior, disabled/hidden/destructive items and keyboard focus |
| Data | `table` with pagination, emphasis/alignment and empty/loading states, plus `loadmore` |
| Navigation | `breadcrumb`, `gridtoggle`, `aspectratiotoggle`, language selection/switcher presentations |
| Notifications | `toast-container`, `label`, `sitebadge`, `groupbadge`, `camerabadge`; actions, dismissal and pausable timers |
| Feedback | `badge`, `status`, `infobox`, `block-status`, `progressbar`, `spinner`, `placeholder` |
| Surfaces | `card`, `block`, `block-header`, `block-body`, `block-footer`, `kpi` |
| Modal | `modal`, `modalheader`, `modalbody`, `modalactions`, `showconfirm`; complete inline preview, full-width/centered/theater, move/resize and dirty-close confirmation |

Colors, shadows, breakpoints, the 4px radius, and the 12px spacing unit come from
[app.variables.scss](../hub-frontend/kerberos.ng/src/scss/_app.variables.scss).
Shared button/field styles come from
[app.scss](../hub-frontend/kerberos.ng/src/scss/app.scss); component-specific values
come from the widget SCSS. CSS and theme variables are scoped to `.hub-widgets`
to keep widget previews isolated from the documentation site's styling. Story
discovery is restricted to that directory so internal site helpers do not
reappear in the catalog. Icons use the library's existing
`iconoir-react` dependency rather than Hub's runtime SVG registry.

Stories include editable controls, disabled/readonly/error/loading/active
states, searchable selection, switches, segmented controls, collapsible blocks,
dismissible messages, card actions, counting/dwell/occupancy KPIs and
modal/confirmation interactions. They use local demo
state only; no Hub API, NgRx, Angular forms, or services are loaded.
Native controls/dialog supply keyboard operation, dialog focus containment and
restoration; reduced-motion users see static loading indicators. These are
intentional accessibility adaptations, not ports of Hub's runtime internals.

The recordings date-filter story and public preview use Hub's left-side calendar/
clear control and dropdown arrow. All picker variants share its 296px calendar,
48px month buttons, square cells, recording dots and selected/today styling.
Popovers use their rendered content height when deciding whether to open above
or below the trigger.
The calendar uses the design system's Hub brand token for primary accents.
Calendar values are local `YYYY-MM-DD` dates (not UTC timestamps). Range-slider
values are minutes in `[0, 1440]`. Weekly schedules use the Hub shape: Sunday=0,
seconds in `[0, 86400]`, `enabled`, and explicit IANA timezones. Editing a day
preserves untouched days, disabled/empty days and their timezones; unsupported
sub-minute data, overlaps, invalid dates or invalid configuration produce
explicit errors rather than silently normalizing data.

On narrow screens, segmented controls scroll within their container without
compressing option buttons, and schedule readouts wrap within the available width.
Popup panels fit the viewport and reposition on scroll/resize. `HubModal inline`
renders the same header, body and footer as an in-flow labelled section, without
an overlay, automatic focus or focus trapping. It still supports controlled
close/save actions; move/resize and viewport positioning are overlay-only.
Storybook's overlay variants start open. Documentation renders each in its own
600px-tall iframe, keeping the complete modal visible and interactive without
covering other examples; closing it reveals its reopen button.
Modal dragging uses the whole header without an extra Move button. Resizing uses
Hub's 6px right/bottom edges and 16px corner grip, with the same muted grip styling.
Both are desktop-only (768px and wider) and disabled in full-width/theater/inline
presentations. The focusable header and resize handles support arrow keys; Shift
uses larger steps. Pointer capture keeps gestures active outside the handle.
Theater mode retains an accessible close/header control. For dirty-close protection,
pass `actions={requestClose => ...}` and use `requestClose` for cancellation;
successful save actions can close directly.

Toast durations are milliseconds; zero keeps a toast until dismissed. Hover and
keyboard focus independently pause the remaining lifetime. Language stories
change local selection only, not the documentation site's translation service.

This completes the **reusable-component pass**, not every Hub application feature.
Camera/media players, timelines/charts, maps/floorplans, drawing/annotation,
API-backed domain pickers/lists, Google address autocomplete, Stripe credit-card
entry and sharing/case workflows remain in Hub. Related domain-specific wrappers
are not claimed as separate ports of their underlying selection primitives.
The React presentations are a manually maintained reference, not a generated package
or a replacement consumed by the Angular application. When Hub's design changes,
update this extraction against the source paths above.

Run `npm run test:widgets` for date/calendar, range-boundary, schedule round-trip
and label-contrast regression tests. The tests use Node's built-in runner and the
existing TypeScript compiler, without adding a test framework.
After `npm run build:all`, run `npm run test:widgets:browser` for production
Storybook smoke tests, native keyboard/pointer interactions and responsive
public-page checks. First-time browser setup is `npx playwright install chromium`.
The browser suite owns a temporary preview server on port 4381 and shuts it down
when finished; it does not reuse or interfere with the developer's servers.

### Build Storybook

```bash
npm run build-storybook
```

Production builds publish Storybook into the same site under `/storybook/`, so it can be linked directly from the existing design system pages.

### Preview Production Build

```bash
npm run preview
```

## Features

- **Landing Page**: Introduction to design systems and their importance
- **Colors**: Complete color palette with CSS variables and usage examples
- **Typography**: Type scale, font families, and text styles
- **Spacing**: Consistent spacing system with visual examples
- **Branding**: Logo guidelines, brand values, voice & tone, and social-banner/logo studios
- **Components**: Interactive previews of the production Hub widgets
- **Storybook**: Hub-only widget states, controls, and source documentation

## Favicons

The browser favicon uses the full white Outfit 700 **UUG** wordmark on the Logo
Studio's **Midnight** background, without the circular brand ring. The same
artwork is used by the marketing website, Learn, this app, and Storybook.
The app manifest names this site **UUG.AI Design**.

The assets in [public/](public/) include 16px and 32px PNG favicons, an ICO with
16px/32px/48px images, a 180px Apple touch icon, and 192px/512px app icons.
The browser icons have 14% rounded corners; touch/app icons are full-bleed
squares so the platform can apply its own crop. Documentation previews use
the 192px artwork to stay sharp at larger display sizes.

In **Branding > Favicon**, use **Download full favicon set (.zip)** for a
drop-in website bundle: all six icon files, a portable `site.webmanifest`,
`head.html` with the link tags, and `README.txt` with installation instructions.
Copy the icons and manifest into your website's public directory, paste the
head snippet into your HTML, and customize the manifest's website name.
Individual ICO and 32px PNG downloads remain available.

`npm run build:favicons` packages the current canonical assets into
`public/brand/uug-favicon-set.zip`. Development and production/Storybook builds
run this automatically; the generated ZIP is ignored by Git. Run
`npm run test:favicons` to check the bundle's artwork, sizes, and portable links.

The artwork was exported from the Logo Studio's 1024px full-square Midnight
variant, with the wordmark enlarged to 352px and centered for small-size
legibility, then downsampled to each target size. Icon URLs carry
`?v=uug-midnight` to refresh previously cached single-letter favicons.

## Brand Toolkit

The **Branding** page at `/branding` embeds two interactive HTML studios from
[public/brand/](public/brand), with controls and PNG downloads available in place.
The same pages remain available full screen. They are owned by this project, not the marketing
website. Vite serves them during development and copies them unchanged into
`dist/brand/` for production. They are also available as static assets in Storybook.
No React runtime is needed inside either studio.
Embedded mode (`?embed=1`) hides duplicate page headers. The Branding page resizes
its same-origin frames to their contents as presets, fonts, errors, and viewport
sizes change, avoiding nested vertical scrolling.
The logo editor sits directly below the **Logo** wordmark preview, followed by
the banner editor. Neither has a duplicate studio heading or full-screen link.

### Social Banner Studio

[banner.html](public/brand/banner.html) is served at `/brand/banner.html`. It
preserves the website hero's dark palette, Outfit/Inter typography, dotted world
map, orbit lines, gradient-ringed markers, and three static shooting-star trails:
two on the left and one over the globe.

| Format | Canvas |
| --- | --- |
| LinkedIn company cover | 4200 x 700 |
| LinkedIn profile cover | 1584 x 396 |
| YouTube channel art | 2560 x 1440 |

The default headline is "Scaling the future" / "of vision AI" in Outfit 800.
Line breaks in the editor are preserved in previews and downloads. The LinkedIn
company headline is slightly larger than the base template, starts at 39% of the
width, and leaves the left 30% clear for the overlapping logo. YouTube's main copy
is vertically centered in the central 1546 x 423 all-device safe area, starting at
25% of the canvas width; the globe and badges sit farther right.

Location cards retain the hero's static illustrative camera counts:
Ghent - Bijlokehof (25 / 25), New York - Midtown (48 / 50), and Cape Town -
Waterfront (12 / 14). They are not live telemetry. Turn off **Include text** for
badges only; **Show crop guides** is preview-only.

Choose **Download PNG** for the exact preset resolution with no controls or crop
guides. Alternatively choose **Open screenshot view**, select `#banner` in browser
developer tools, and use **Capture node screenshot**, rather than capturing the
scaled preview or only the viewport. There are no animations.

Screenshot URLs preserve the preset, copy, and text visibility:
`/brand/banner.html?preset=youtube&capture=1` or add `&text=0` for badges only.

### UUG Logo Studio

[logo.html](public/brand/logo.html), served at `/brand/logo.html`, offers a centered
UUG wordmark in Outfit 700. Appearances include white with a brand ring, midnight
with a brand ring, classic white with a subtle outline, and three banner-matched
backgrounds with white lettering: ambient glow, shooting stars, and dotted globe.

Choose **Circle** for a framed avatar, **Full square** for a full-bleed LinkedIn
upload, or **Rounded square** to preview/export a LinkedIn-style 14% corner radius.
LinkedIn applies its own responsive crop; the rounded preview and banner matching
are approximations, not guaranteed pixel-aligned continuations across devices.
Existing website map-marker PNGs are not replaced by these social-logo templates.

Exports are 400, 800, 1024, or 2048 pixels square. Circle/rounded corners are
transparent unless **Solid square background** is enabled; square mode is always
opaque. Selections persist in URLs such as:
`/brand/logo.html?appearance=shooting&shape=rounded&size=1024`.

Both studios render PNGs entirely in the browser, embedding Google Fonts and,
when needed, the colocated [world-dots.svg](public/brand/world-dots.svg). Export
asset/network and encoding failures are shown next to the controls. Google Fonts
needs network access for branded previews and downloads. Keep the map alongside
the HTML if serving the studios independently. The studios link back to `/branding`.

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tooling
- **React Router**: Client-side routing
- **CSS Modules**: Scoped styling

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx    # Main layout with navigation
│   ├── CodeBlock.tsx # Code display with copy functionality
│   └── ColorSwatch.tsx # Color display component
├── pages/            # Page components
│   ├── Home.tsx      # Landing page
│   ├── Colors.tsx    # Colors documentation
│   ├── Typography.tsx # Typography documentation
│   ├── Spacing.tsx   # Spacing documentation
│   ├── Branding.tsx  # Branding guidelines
│   └── Components.tsx # Component library
├── App.tsx           # Root application component
├── main.tsx          # Application entry point
└── index.css         # Global styles and CSS variables
```

## Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### GitHub Pages Setup

1. Go to your repository Settings > Pages
2. Set Source to "GitHub Actions"
3. The workflow will automatically build and deploy on every push to `main`

The site will be available at the site root configured for your deployment.

### Manual Deployment

To manually trigger a deployment:
1. Go to Actions tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## License

MIT License - see [LICENSE](LICENSE) file for details
