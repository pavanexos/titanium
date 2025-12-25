# GlassSuite Template — Project Spec

## Goal
Create a premium, enterprise-ready React dashboard template with a **glassmorphism** aesthetic:
- High performance (virtualized lists/grids)
- Accessibility (keyboard navigation, proper aria labels, focus states)
- Responsive layout (mobile → xl)
- Professional, commercial look

## Layout and visual rules
- The app uses a 3-part shell: **Header**, **Sidebar**, and **Main content**.
- **Header and Sidebar use the same dark, glassy material** and appear seamless (no visible border between them).
- **Main content is lighter** than the header/sidebar and sits “under” the glass.
- A high-definition backdrop image highlights the glass effect and supports large and extra-large screens.

## Header spec
- Left: Logo + product name
- Middle: Primary navigation for modules (mega menu)
- Right: Language selector (round), theme selector (mega menu), notifications (mega menu), user avatar
- User menu includes: **Profile**, **Settings**, **Logout**

Interaction consistency:
- Menus use a consistent trigger style (click-based) and consistent z-index layering.

## Sidebar spec
- Expandable/collapsible with **Framer Motion**.
- When minimized: show **icons only** (no labels).
- Tooltips appear only when collapsed.
- Contains top-level navigation and extra items:
  - Dashboard
  - Queries
  - Reports

## Pages
### Dashboard
- Overview cards and activity panel with glass styling.

### Queries
- Query builder to create queries based on entities.
- Saved queries list.
- Results shown below using a pluggable grid engine.

### Reports
- Searchable list of reports.
- Report preview panel.
- Report data shown below using the same pluggable grid engine.

## Data grids
Two engines are provided and switchable:
1. **TanStack Table + React Virtual** (virtualized table)
2. **AG Grid Community**

Grid expectations:
- Sorting, filtering, quick search
- Responsive layout and consistent typography with the rest of the site
- Glass-styled container and theme variables for light/dark modes

## Internationalization (i18n)
- All user-facing strings should be driven through the internal translation dictionary.
- Language toggle updates visible UI text.

## Theme system
- Light and dark modes are visually distinct.
- Dark palette inspired by modern “developer” themes (Discord/Turbo/GitHub Next/Tailwind dark blue-gray).
- Theme selector supports multiple theme presets.

## AI assistant
- Floating AI button at bottom-right.
- Works in both light and dark themes (icon + content always visible and readable).
- Uses a glass popover UI.

## Quality bar
- TypeScript strict build (no unused imports/vars)
- Accessible components (Radix primitives)
- Smooth motion and no layout shifts (Framer Motion)
- No border overflow; consistent radii and rings
