# Kenichi Assets Maker - Design Guide

## 1. Typography

### Fonts
- **Primary (Body)**: `Inter`
  - Usage: UI text, paragraphs, buttons.
  - Class: `font-sans`
- **Brand (Headings)**: `Plus Jakarta Sans`
  - Usage: Headings (`h1`-`h6`), impactful labels.
  - Class: `font-brand`

### Scale
- **Display**: `text-5xl md:text-7xl font-bold` (Hero titles)
- **Heading 1**: `text-4xl font-bold`
- **Heading 2**: `text-2xl font-bold`
- **Body**: `text-base text-text-muted`
- **Small**: `text-sm text-text-muted`

---

## 2. Color System (Theme-Aware)

The application uses CSS variables for theming. Use these semantic names instead of raw hex values.

| Token | Dark Mode (Default) | Light Mode | Usage |
|-------|---------------------|------------|-------|
| `bg` | `#09090b` | `#FAFAFA` | Main page background |
| `surface` | `rgba(24, 24, 27, 0.6)` | `rgba(255, 255, 255, 0.85)` | Glass panels, modals |
| `surface-card` | `rgba(39, 39, 42, 0.4)` | `rgba(244, 244, 245, 0.5)` | Secondary cards |
| `border` | `white/8` | `black/6` | Borders, dividers |
| `border-hover` | `white/15` | `black/12` | Interactive borders |
| `text-main` | `#ffffff` | `#09090b` | Primary text |
| `text-muted` | `#a1a1aa` | `#52525b` | Secondary text |
| `accent` | `#3b82f6` | `#2563eb` | Primary actions, highlights |
| `accent-glow` | `blue/40` | `blue/20` | Ambient glows |

### Usage Example
```tsx
<div className="bg-surface text-text-main border border-border">
  <h1 className="text-accent">Hello</h1>
</div>
```

---

## 3. Layout & Structure

### Main Layout (`Layout.tsx`)
- **Container**: `max-w-7xl mx-auto px-4 md:px-8`
- **Spacing**: `pt-24 pb-12` (accounts for fixed nav)
- **Background**: Dynamic `bg-bg` with `bg-mesh` radial gradient overlay.

### Responsive Breakpoints
- **Mobile**: Default (stack flex cols)
- **Tablet**: `md:` (grid layouts usually switch to 2 cols)
- **Desktop**: `lg:` or `xl:` (max widths apply)

---

## 4. Components

### Buttons
Reusable `Button` component supporting variants and sizes.

- **Primary**: Solid accent color.
  - `<Button variant="primary">Action</Button>`
- **Glass**: Glassmorphic effect, borders.
  - `<Button variant="glass">Secondary</Button>`
- **Ghost**: Transparent, hover effects only.
  - `<Button variant="ghost">Tertiary</Button>`

### GlassCard
The core container for content.
- Applies `glass-panel` utility: `bg-surface backdrop-blur-xl border border-border`.
- **Props**: `hoverEffect` (adds lift and shadow on hover).

### Navigation (`NavPill`)
- Floating pill design.
- **Positioning**: `fixed top-8 inset-x-0 mx-auto w-fit z-50`.
- **Glass Effect**: `bg-surface/50 backdrop-blur-xl`.

---

## 5. Effects & Animations

### Transitions
- Global: `transition-colors duration-500 ease-in-out` (Theme switching).
- Hover: `duration-300`.

### Animations (`framer-motion`)
- **Fade In Up**:
  ```tsx
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  ```
- **Hero Float**: Custom CSS animation `animate-heroFloat`.

---

## 6. Iconography
- Library: `lucide-react`
- Sizing: Usually `size={18}` for buttons, `size={24}` for feature icons.

## 7. Critical Design Rules
1. **Never hardcode hex colors**. Always use semantic classes (`bg-surface`, `text-text-main`) to support Dark/Light mode.
2. **Glassmorphism requires borders**. Glass panels on light mode need a subtle border (`border-black/5`) to be visible against the white background.
3. **Canvas Visibility**: Ensure canvas-based tools (like Logo Studio) define explicitly visible default colors (e.g., black text on white canvas).
