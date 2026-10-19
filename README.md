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

```bash
npm run build
```

### Build App And Storybook

```bash
npm run build:all
```

This builds the Vite app into `dist/` and Storybook into `dist/storybook/` in one step.

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

Storybook runs on [http://localhost:6006](http://localhost:6006) and exposes isolated stories for the shared components in `src/components`.

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
- **Branding**: Logo guidelines, brand values, and voice & tone
- **Components**: Reusable UI components with interactive examples and copy-able code
- **Storybook**: Isolated component previews and documentation for shared UI pieces
- **Native HTML/CSS recipes**: Framework-neutral source, standalone demos,
  accessibility contracts and optional vanilla JavaScript in the Components catalogue

## Framework-Neutral Components

The [Components catalogue](src/pages/Components.tsx) starts with the current Hub
application-layout reference and six extracted widgets. Their visual baseline is
`hub-frontend/kerberos.ng`, not the marketing website. They are components,
not a separate product-specific category. `/hub-patterns` redirects to `/components`
and preserves component anchors.

| HTML/CSS component | Existing Angular widget | Scope |
| --- | --- | --- |
| [ApplicationLayout](src/components/ApplicationLayout) | Home shell, `Block`, shared widgets | Representative in-context device-management composition |
| [StatusBadge](src/components/StatusBadge) | `Badge` | Status pill; unboxed `Status`, count/ratio and gold variants are not extracted |
| [EmptyState](src/components/EmptyState) | `Placeholder` | First-use, no-results and recoverable error states |
| [MetricCard](src/components/MetricCard) | `KPI` | Label/value, units, comparisons and explicit loading |
| [SegmentedControl](src/components/SegmentedControl) | `MultiToggle` | Accessible controlled view switching |
| [SearchField](src/components/SearchField) | `SearchField` | Borderless query; clearing is an explicit opt-in extension |
| [Notice](src/components/Notice) | `InfoBox` | Inline feedback with explicit announcement policy |

Each component has a canonical `example.html` and `component.css`. The website
and Storybook's **HTML And CSS** story render that exact HTML, not a JSX
translation. Both documentation surfaces show copyable markup and CSS. React
adapters remain optional for typed controls and integration examples; exported
HTML pages contain no Angular/React runtime or bundler imports.

### Visual baseline, not a redesign

[hub-tokens.css](src/hub-tokens.css) mirrors Hub's `_app.variables.scss`, with
namespaced variables so the documentation website retains its own theme.
The recipes use Hub's original self-hosted Inter variable font, original search
and InfoBox SVG glyphs, `#84569f` accent,
12px spacing rhythm, 4px corners, neutral grey surfaces, shadows and breakpoints.
The unchanged font is redistributed with its [SIL Open Font License](src/fonts/Inter-LICENSE.txt).

KPI tiles have centered values in 150px cards with captions below them. MultiToggle
uses joined borders and the existing purple active tint, not inset rounded pills.
Search retains its transparent toolbar appearance and has no clear button by
default. InfoBox retains its inline hierarchy and original variant treatments.
The layout composes those same styles rather than reimplementing them. Isolated
previews use Hub's card surface, just like the real toolbar/block context; placing
transparent controls directly on the page-grey background changes their appearance
and contrast.

Intentional differences are documented per component: badge labels remain visible
on mobile; search gets a real accessible label and focus indicator; optional
clearing is in `clearable.html` / React `showClear`; buttons, announcement policy,
zero/loading semantics and reduced-motion support are accessible native contracts.
The shell uses container breakpoints for embedding. It is a representative visual
fixture, not a working Hub: navigation, Add device, filtering, routing, permissions,
and the mobile overlay menu are not implemented.

Existing Hub feedback/trend contrast limitations are **not silently recolored**.
MetricCard, Notice and the composition keep accessibility results visible with
`a11y.test: 'todo'`; other extracted widgets retain blocking checks. These are
known source limitations, not an accessibility certification. Older marketing-style
component explorations remain later in the catalogue and are labeled as such.

### Use without a framework

`npm run build:html` generates `public/ui/` from those sources. Development,
website builds and Storybook builds run it automatically. Vite publishes it at
`/ui/`; integrated Storybook also includes its own `/storybook/ui/` assets.
For example, `/ui/search-field/` is a standalone page, while its `example.html`
and `component.css` are directly downloadable. Generated assets are ignored by
git; edit the sources and regenerate after changes during a running dev session.

1. Load [hub-tokens.css](src/hub-tokens.css), its `fonts/` assets, and the component stylesheet.
   The application layout also needs the six widget stylesheets listed in its example.
2. Copy the HTML recipe, keeping IDs unique and preserving semantic/ARIA markup.
3. Translate text and bind application state/events in Angular, React or your
   existing stack. CSS and HTML do not perform business actions.
4. Alternatively, import [the optional native helper](src/components/html/behaviors.js)
   for search clearing, segmented selection and example notice dismissal:

```html
<link rel="stylesheet" href="/ui/hub-tokens.css">
<link rel="stylesheet" href="/ui/search-field/component.css">
<!-- Insert search-field/clearable.html to opt into clearing. -->
<script type="module">
  import { enhanceComponents } from '/ui/behaviors.js'
  const cleanup = enhanceComponents(document)
  // Call cleanup() before replacing the enhanced host.
</script>
```

Use either native enhancement or framework event bindings for a component, not
both. The helper is idempotent for an already enhanced element and returns
listener cleanup. The default Hub search needs no JavaScript helper. Optional
search clearing dispatches bubbling `input`; segmented
selection dispatches `ui:change` with `detail.value`; notice dismissal dispatches
`ui:dismiss`. The example restore button demonstrates focus restoration, not a
required product UI. Mirror disabled state on search input and clear button;
dispatch `input` after programmatic query updates.

Set `data-theme="dark"` on the document or an ancestor to select dark tokens.
The font is self-hosted; native pages make no third-party font requests. Applications
can override the namespaced tokens. Hub keeps its existing Angular
widgets/styles until deliberately adopting these contracts; no runtime restyling
or migration is implicit. Data fetching, translation, routing, permissions and
tenant ownership remain in applications.

### Documentation and validation

Storybook groups the layout and all six widgets under **Components**.
Each starts with the native **HTML And CSS** story, then optional React adapter
controls and relevant light/dark, narrow, loading/zero/error/disabled cases.
Accessibility checks remain visible, with the source contrast exceptions described above. To inspect:

1. Run `npm run storybook`.
2. Open **Components → Search Field → HTML And CSS** (or another native story).
3. Confirm typing/clearing, keyboard activation, callback values and disabled
   behavior. Play functions run when the relevant stories render; they are not
   executed by `build-storybook` alone.
4. Review `/components` and the standalone `/ui/` demos at narrow widths and in
   both themes. Serve pages over HTTP for ES module behavior.

`npm run test:html` checks export completeness, exact source parity, token
dependencies, layout styles, optional clearing, font/license assets and absence
of framework bundles. When Hub source is present, it also compares the original
light/dark token values and font bytes; a standalone design checkout explicitly
skips that cross-repository check. `npm run build:all` type-checks
adapters/stories and builds the website, native assets and Storybook.
The catalogue retains Hub provenance and documents deferred candidates: page
headers, dialogs, tables and pickers need dedicated behavior contracts; media
players, timelines and annotation remain domain-owned.

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tooling
- **React Router**: Client-side routing
- **Plain CSS**: Shared component classes and CSS custom-property tokens

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
