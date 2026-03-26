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

The site will be available at: `https://uug-ai.github.io/design/`

### Manual Deployment

To manually trigger a deployment:
1. Go to Actions tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## License

MIT License - see [LICENSE](LICENSE) file for details
