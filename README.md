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

The production container uses a maintained, digest-pinned Nginx/Alpine base and
upgrades its runtime packages for distro security fixes. Both the app and
Storybook continue to use the existing Node builder and dependency lockfile.

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
- **Branding**: Logo guidelines, brand values, voice & tone, and social-banner/logo studios
- **Components**: Reusable UI components with interactive examples and copy-able code
- **Storybook**: Isolated component previews and documentation for shared UI pieces

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
