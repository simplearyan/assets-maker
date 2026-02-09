# Kenichi Assets Maker

> **Create Anything.**  
> A robust suite of local-first creative tools for rapid asset generation. No uploads, no limits.

![Kenichi Assets Maker](public/assets/logos/png/logo-512.png)

## 🚀 Overview

**Kenichi Assets Maker** is a modern, browser-based creative suite designed for developers and designers who need quick, high-quality assets without the overhead of heavy software. Built with performance and privacy in mind, all processing happens locally on your device.

The suite includes:
- **Logo Studio**: Design SVG logos with parametric controls.
- **Vector Pro**: Trace bitmaps to SVGs efficiently.
- **Batch Converter**: Process thousands of images instantly.
- **Thumbnail Lab**: Generate social media assets from presets.
- **Image Editor**: Quick adjustments, crops, and filters.

## ✨ Key Features

- **Local-First Architecture**: Your files never leave your device.
- **PWA (Progressive Web App)**: Installable on desktop and mobile for offline use.
- **Responsive Design**: precise Glassmorphism UI that adapts to any screen.
- **Dark Mode**: Native support for system preferences.
- **High Performance**: Powered by Vite and React for instant interactions.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4 (Custom Design System)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **PWA**: vite-plugin-pwa

## 📦 Installation

This project uses `npm`. To get started:

1. **Clone the repository**
   ```bash
   git clone https://github.com/simplearyan/assets-maker.git
   cd kenichi-assets-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🚢 Deployment

The project is configured for automatic deployment to **GitHub Pages** via GitHub Actions.
Any push to the `master` branch triggers the build and deploy workflow defined in `.github/workflows/deploy.yml`.

## 📜 License

MIT License.

---
Part of the **Kenichi Studio** ecosystem.
