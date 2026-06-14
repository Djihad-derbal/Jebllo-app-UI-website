# Jebllo — Admin Dashboard

A static **admin / management web panel** for **Jebllo**, a multi-sided food‑delivery
platform. It is a faithful HTML/CSS/JS rebuild of the Figma design — multi‑page, no
framework, no backend. All data is realistic hardcoded mock data.

> UI language: **French** (Commandes, Drivers, Paiements…), prices in **DZD**,
> locations use **Algerian wilayas**.

---

## Tech stack

- **Plain semantic HTML** — one file per page (multi‑page, no framework).
- **One shared `styles.css`** using CSS custom properties (design tokens in `:root`)
  so the look is identical on every page.
- **Vanilla JS in a shared `app.js`** for: active nav highlighting, mobile sidebar
  drawer, tab switching, toggle switches, client‑side table search/filter, generic
  modals, a confirm dialog, toasts, an activity log, and the notification bell.
- **Google Fonts** — `Inter` for UI text, `Poppins` for the logo wordmark + page titles.
- **Local SVG assets only** (no external image/CDN dependency) so it runs fully offline.

---

## Run it locally

It is a static site — serve the folder with any static server:

```bash
# Python (used during development, port 5050)
python -m http.server 5050 --directory C:/Jebllo
# then open http://localhost:5050
```

```bash
# or Node
npx serve C:/Jebllo
```

Open `http://localhost:5050/` → redirects to the dashboard. Start at
`login.html` for the full flow.

---

## Brand & design tokens

All tokens live in `:root` in `styles.css`.

| Token | Value | Usage |
|-------|-------|-------|
| `--lime` / `--lime-strong` / `--online` | **`#96F007`** | Official Jebllo green — logo, buttons, toggles, status dots, online states, accents |
| `--lime-soft` | `#EBFAC9` | Pale green tint for soft fills |
| `--navy` | **`#0F172A`** | Official dark blue — active nav pill, dark "Driver" card, login panel |
| `--bg` / `--surface-muted` / `--border` | `#FFFFFF` / `#F8FAFC` / `#E8ECF2` | Surfaces |
| `--text` / `--text-muted` / `--text-faint` | `#0F172A` / `#64748B` / `#94A3B8` | Text |
| success ("Fini") | bg `#DCFCE7`, text `#16A34A` | Completed status badge |
| info ("En Cours" / "Retour") | bg `#DBEAFE`, text `#2563EB` | In‑progress / returning client |
| danger | `#EF4444` | Offline / delete |

**Note:** `#96F007` is a very light green, so it is unreadable as text on white/pale.
Green‑on‑light chips and icon tiles (`.badge--lime`, `.badge--online`, `.stat__ic--lime`,
`.notif-ic--new`, `.flag--new`) therefore use a **solid `#96F007` background with navy
text** for both brand fidelity and readability.

- **Radii:** cards 14–16px, inputs/search fully pill‑shaped, nav active item a rounded
  pill, badges fully rounded.
- Soft, subtle card shadows; generous white space; light, airy feel.
- The brand logo is `assets/logo.svg` (green chameleon mark) shown in every sidebar
  + the login screen.

---

## File structure

```
/index.html              redirect → dashboard
/login.html              split brand/form auth screen
/dashboard.html          overview: stat cards, charts, available drivers, recent orders
/commandes.html          orders table + order-detail slide-over
/drivers.html            drivers table (CRUD) + availability
/members.html            members table (CRUD)
/restaurant.html         restaurant card grid (CRUD, image upload)
/restaurant-detail.html  MENU tab (product/category CRUD) + Command Client tab
/paiements.html          payouts/tracking for restaurants & drivers
/logs.html               activity timeline
/settings.html           admin profile
/styles.css              all design tokens + shell + components
/app.js                  shared behaviour + Jebllo.* helpers
/assets/                 logo.svg, food-1..9.svg, av-1..12 + av-anima.svg
```

---

## Global shell (shared on every page)

- **Left sidebar** (white, sticky): Jebllo logo, nav — Dashboard, Commandes, Drivers,
  Restaurant, Members, Logs, Paiements, Settings; Logout pinned at the bottom. The
  active item is a **dark‑navy rounded pill** with white text/icon.
- **Top header** (white, thin border): page context title, notification bell (with
  dropdown), and the "Anima Agrawal" admin chip with avatar.
- **Responsive:** under 1024px the sidebar collapses into a drawer with a hamburger.

---

## Pages

1. **Login** — split layout: navy brand panel (logo, pitch, live stats) + sign‑in form;
   submitting goes to the dashboard.
2. **Dashboard** — 4 stat cards (orders, drivers, revenue DZD, online restaurants), a
   bar‑chart + donut, a **"Drivers disponibles"** card (online drivers *not* in a
   delivery), and a recent‑orders mini‑table.
3. **Commandes (Orders)** — search + Driver/Prix/Date/Status filters; table with Order ID,
   Restaurant, Driver (one row shows a lime dot + "Searching…"), Customer (with a lime
   **"First Order"** or blue **"Retour"** badge), Price, **Date & heure** (date + exact
   time), and Statut ("En Cours"/"Fini"). Clicking a row opens a **slide‑over** with the
   delivery address, recipient, itemised order (struck‑through promo prices), totals,
   and a dark "Driver" card with a lime star rating. A banner flags first‑time vs
   returning clients.
4. **Drivers** — search + Date/Status filters (incl. **Disponible / En livraison**); table
   with Client, Numéro, Email, JoinDate, Wilaya, **Status + availability badge**, and
   edit/delete actions. Full CRUD via a modal.
5. **Members** — same table style: Client, Numéro, JoinDate, Wilaya, Status + actions. CRUD.
6. **Restaurant** — responsive 3‑column card grid (food image, Online/Offline pill, name,
   cuisine tags, lime star rating). Full CRUD via a modal with an **image upload + live
   preview**.
7. **Restaurant detail** — header + two tabs:
   - **MENU**: "+ Add Category" → category pills + sections; each product has a lime
     on/off toggle, description, price, thumbnail, "Edit Product" + delete. Add/Edit via
     modal; Add Category creates a new pill + section.
   - **Command Client**: split live‑orders view — left "Active Orders" with a "12 LIVE"
     badge, search and order cards (status chip + time ago); right panel shows the
     selected order (summary, items, customer note). Selecting a card updates the panel.
8. **Paiements (Payouts)** — summary stat cards + tabs **Restaurants / Drivers**. Per row:
   orders count, sales/earnings, 15% commission (restaurants), amount to pay, status, and
   a **Payer** button. Clicking a row opens a payout slide‑over (period orders + totals +
   pay). Paying flips status to "Payé", recomputes totals, logs the action and toasts.
9. **Logs** — activity timeline (relative timestamps, colored dots), persisted, with a
   clear‑all.
10. **Settings** — admin Profil card.

---

## Shared components & helpers

Reusable, consistently styled: **tables**, **badges/pills**, **cards**, **toggle
switches**, **tabs**, **search/filters**, **modals**, **confirm dialog**, **toasts**,
**slide‑overs**, **stat cards**, and the **notification dropdown**.

`app.js` exposes a small API on `window.Jebllo`:

| Helper | Purpose |
|--------|---------|
| `Jebllo.openModal(sel)` / `closeModal(el)` | Show/hide any `.modal`; also auto‑wired via `[data-modal-open="#id"]` / `[data-modal-close]` |
| `Jebllo.confirm({title, message, confirmLabel, onConfirm})` | Centered confirm dialog (used for deletes & payments) |
| `Jebllo.toast(msg, type)` | Transient bottom‑right toast (`type:"danger"` for destructive) |
| `Jebllo.log(type, title, sub)` / `getLogs()` | Append to / read the activity log |

Other conventions:
- `[data-confirm-delete]` on a button → delegated delete with confirm + log + toast
  (auto‑derives the label from the row name when the attribute is empty).
- `[data-search="#table"]`, `[data-filter-search="#list"]`, `[data-status-filter="#table"]`
  wire client‑side filtering.
- `[data-tabs]` + `[data-tab]` / `[data-panel]` wire tab switching.

---

## Features summary

- **CRUD** on Drivers, Members, Restaurants, and restaurant menu products/categories
  (add/edit via modal, delete with confirm). Restaurant visual is an **uploaded image**.
- **Activity Logs** — every create/update/delete/payment is recorded (localStorage),
  shown on `logs.html`.
- **Notifications** — bell dropdown with first‑time / returning‑client alerts.
- **First‑time vs returning clients** — badges in the orders table + a banner and toast
  in the order detail.
- **Order time** — exact `HH:MM` on each order, in the table and slide‑over.
- **Driver availability** — distinguishes online drivers that are free vs in a delivery,
  surfaced on the dashboard and filterable on the Drivers page.
- **Payments** — track and pay restaurants (sales − 15% commission) and drivers (delivery
  fees), with per‑entity order breakdowns.

---

## Notes & limitations

- **No backend.** All data is mock. CRUD edits and payment statuses live in memory and
  reset on a hard reload; the **activity log** and **notifications** persist via
  `localStorage` (`jebllo_logs`, `jebllo_notifs`).
- The shell (sidebar + header) is duplicated per page (static multi‑page site). A small
  JS include or build step could single‑source it later.
- `dashboard.html` uses a multi‑line nav format — bulk single‑line nav edits skip it, so
  edit its nav by hand.
