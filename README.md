# Jebllo — Admin Dashboard

A static **admin / management web panel** for **Jebllo**, a multi‑sided food‑delivery
platform. It is a faithful HTML/CSS/JS rebuild of the Figma design — multi‑page, no
framework, no backend. All data is realistic hardcoded mock data, intended as a complete
**UI prototype to hand off to a developer** who will wire the real backend.

> UI language: **French** (Commandes, Drivers, Paiements…), prices in **DZD**,
> locations use **Algerian wilayas**.

**Live demo:** https://jebllo.vercel.app · **Repo:** https://github.com/Djihad-derbal/Jebllo-app-UI-website

---

## Tech stack

- **Plain semantic HTML** — one file per page (multi‑page, no framework).
- **One shared `styles.css`** using CSS custom properties (design tokens in `:root`)
  so the look is identical on every page.
- **Vanilla JS in a shared `app.js`** for: active nav highlighting, mobile sidebar
  drawer, tab switching, toggle switches, client‑side table search/filter, generic
  modals, a confirm dialog, toasts, an activity log, and the notification bell.
  Page‑specific behaviour (drag‑and‑drop order board, dispatch map linking, peak‑hours
  heatmap, per‑page CRUD) lives in inline `<script>`s on each page.
- **Google Fonts** — `Inter` for UI text, `Poppins` for the logo wordmark + page titles.
- **Local SVG assets only** (no external image/CDN dependency) so it runs fully offline —
  including the stylized dispatch **map** on Live Ops, which is hand‑built SVG.

---

## Run it locally

It is a static site — serve the folder with any static server:

```bash
# Python (used during development, port 5050)
python -m http.server 5050 --directory C:/projects/Jebllo
# then open http://localhost:5050
```

```bash
# or Node
npx serve C:/projects/Jebllo
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
/analytics.html          reports: KPIs, charts, peak-hours heatmap, top lists, export
/live.html               Live Ops: dispatch map + drag-and-drop order board (2 tabs)
/commandes.html          orders table (full CRUD) + order-detail slide-over
/drivers.html            drivers table (CRUD) + availability
/verifications.html      driver onboarding / verification queue (approve / reject)
/restaurant.html         restaurant card grid (CRUD, image upload)
/restaurant-detail.html  MENU tab (product/category CRUD) + Command Client tab
/promotions.html         promo codes / coupons manager (CRUD, activate/deactivate)
/members.html            members table (CRUD); rows open the customer 360 page
/member-detail.html      Customer 360: profile, stats, order history, addresses, litiges
/support.html            reviews moderation + disputes/refunds (2 tabs)
/paiements.html          payouts/tracking for restaurants & drivers
/logs.html               activity timeline
/settings.html           admin profile
/styles.css              all design tokens + shell + components
/app.js                  shared behaviour + Jebllo.* helpers
/assets/                 logo.svg, food-1..9.svg, av-1..12 + av-anima.svg
```

---

## Global shell (shared on every page)

- **Left sidebar** (white, sticky): Jebllo logo + a nav grouped into **labeled sections**:
  - **Général** — Dashboard, Analytics
  - **Opérations** — Live Ops, Commandes, Drivers, Vérifications *(pending‑count badge)*
  - **Catalogue** — Restaurant, Promotions
  - **Clients** — Members, Support
  - **Finance** — Paiements, Logs
  - **Système** — Settings

  Logout is pinned at the bottom. The active item is a **dark‑navy rounded pill** with
  white text/icon (set by filename via `data-page`). The whole `<nav>` block is identical
  on every page, so a nav change is one find‑replace per file.
- **Top header** (white, thin border): page context title, notification bell (with
  dropdown), and the "Anima Agrawal" admin chip with avatar.
- **Responsive:** under 1024px the sidebar collapses into a drawer with a hamburger; the
  sidebar scrolls if the nav is taller than the viewport.

---

## Pages

1. **Login** — split layout: navy brand panel (logo, pitch, live stats) + sign‑in form;
   submitting goes to the dashboard.
2. **Dashboard** — 4 stat cards (orders, drivers, revenue DZD, online restaurants), a
   bar‑chart + donut, a **"Drivers disponibles"** card (online drivers *not* in a
   delivery), and a recent‑orders mini‑table.
3. **Analytics** — date‑range segmented control (7/30/90 j) + **CSV export**; KPI cards
   (revenue, orders, avg basket, cancel rate); a 14‑bar revenue chart + status donut; a
   **peak‑hours heatmap** (days × hours, lime‑intensity cells); Top restaurants + Top
   drivers tables (medal ranks); and a revenue‑by‑wilaya bar list.
4. **Live Ops** — a live operations console with two tabs:
   - **Carte (Dispatch)** — a stylized SVG map (restaurant / driver / customer pins,
     dashed delivery routes) beside a list of active deliveries. Clicking a delivery (or
     its map pin) cross‑highlights the matching pin + route; the waiting order has an
     **Assigner** button. A live clock ticks every second.
   - **Tableau** — a 5‑column **drag‑and‑drop order board** (Nouvelles → Acceptées → En
     préparation → En route → Livrées); moving a card updates the column counts and
     logs + toasts the status change.
5. **Commandes (Orders)** — search + Driver/Prix/Date/Status filters; table with Order ID,
   Restaurant, Driver (one row shows a lime dot + "Searching…"), Customer (with a lime
   **"First Order"** or blue **"Retour"** badge), Price, **Date & heure** (date + exact
   time), Statut ("En Cours"/"Fini"), and row actions. **Full CRUD**: a "Nouvelle
   commande" button + add/edit modal, per‑row edit, and per‑row delete (confirm). Clicking
   a row opens a **slide‑over** with the delivery address, recipient, itemised order
   (struck‑through promo prices), totals, and a dark "Driver" card with a lime star
   rating — working for created/edited orders too. A banner flags first‑time vs returning
   clients.
6. **Drivers** — search + Date/Status filters (incl. **Disponible / En livraison**); table
   with Client, Numéro, Email, JoinDate, Wilaya, **Status + availability badge**, and
   edit/delete actions. Full CRUD via a modal.
7. **Vérifications** — driver onboarding/verification queue mirroring the mobile "become a
   delivery driver" form. Tabs (En attente / Approuvés / Rejetés) filter applicants into a
   master‑detail dossier: personal info, vehicle, **uploaded documents** (ID / licence /
   carte grise, each with a "vérifié" toggle + click‑to‑open viewer), selfie, and payment
   info. Pending dossiers get **Approuver / Rejeter** (with a reason); the nav badge shows
   the pending count.
8. **Restaurant** — responsive 3‑column card grid (food image, Online/Offline pill, name,
   cuisine tags, lime star rating). Full CRUD via a modal with an **image upload + live
   preview**.
9. **Restaurant detail** — header + two tabs:
   - **MENU**: "+ Add Category" → category pills + sections; each product has a lime
     on/off toggle, description, price, thumbnail, "Edit Product" + delete. Add/Edit via
     modal; Add Category creates a new pill + section.
   - **Command Client**: split live‑orders view — left "Active Orders" with a "12 LIVE"
     badge, search and order cards (status chip + time ago); right panel shows the
     selected order (summary, items, customer note).
10. **Promotions** — KPI cards + a grid of ticket‑style **promo cards** (code, % / fixed
    DZD / free‑delivery value, min order, scope, validity, usage bar). Each has an
    Active/Inactive toggle and edit/delete; a "Créer une promo" modal builds new ones.
11. **Members** — table: Client, Numéro, JoinDate, Wilaya, Status + actions. Full CRUD;
    **clicking a row opens the Customer 360 page** for that member.
12. **Member detail (Customer 360)** — opened from a Members row. Profile header
    (avatar, loyalty badge, contact, status) + stat cards (total orders, total spend,
    avg basket, avg rating given), order‑history table, saved addresses, favorite
    restaurants, and open disputes. Contacter / Suspendre actions.
13. **Support** — two tabs:
    - **Avis (reviews moderation)** — review cards (flagged ones highlighted); Garder
      (clear flag), Répondre (publish a reply), Masquer (hide, with confirm).
    - **Litiges & remboursements (disputes/refunds)** — disputes table → detail
      slide‑over with **Rembourser** (confirm) / **Rejeter**, updating status + counts.
14. **Paiements (Payouts)** — summary stat cards + tabs **Restaurants / Drivers**. Per row:
    orders count, sales/earnings, 15% commission (restaurants), amount to pay, status, and
    a **Payer** button. Clicking a row opens a payout slide‑over (period orders + totals +
    pay). Paying flips status to "Payé", recomputes totals, logs the action and toasts.
15. **Logs** — activity timeline (relative timestamps, colored dots), persisted, with a
    clear‑all.
16. **Settings** — admin Profil card.

---

## Shared components & helpers

Reusable, consistently styled: **tables**, **badges/pills**, **cards**, **toggle
switches**, **tabs**, **search/filters**, **modals**, **confirm dialog**, **toasts**,
**slide‑overs**, **stat cards**, the **notification dropdown**, plus feature components
(dispatch map + pins, kanban board, heatmap, promo tickets, review cards).

`app.js` exposes a small API on `window.Jebllo`:

| Helper | Purpose |
|--------|---------|
| `Jebllo.openModal(sel)` / `closeModal(el)` | Show/hide any `.modal`; also auto‑wired via `[data-modal-open="#id"]` / `[data-modal-close]` |
| `Jebllo.confirm({title, message, confirmLabel, onConfirm})` | Centered confirm dialog (used for deletes, payments, refunds, verdicts) |
| `Jebllo.toast(msg, type)` | Transient bottom‑right toast (`type:"danger"` for destructive) |
| `Jebllo.log(type, title, sub)` / `getLogs()` | Append to / read the activity log |

Other conventions:
- `[data-confirm-delete]` on a button → delegated delete with confirm + log + toast
  (uses the attribute value as the label, or auto‑derives it from the row name).
- `[data-search="#table"]`, `[data-filter-search="#list"]`, `[data-status-filter="#table"]`
  wire client‑side filtering.
- `[data-tabs]` + `[data-tab]` / `[data-panel]` wire tab switching.

---

## Features summary

- **CRUD** on Commandes, Drivers, Members, Restaurants, restaurant menu products/categories,
  and Promotions (add/edit via modal, delete with confirm). Restaurant visual is an
  **uploaded image**.
- **Live operations** — dispatch map with linked deliveries + a drag‑and‑drop order board.
- **Analytics** — KPI reports, a peak‑hours heatmap, top‑performer lists, CSV export.
- **Driver verification** — onboarding queue with document review and approve/reject.
- **Promotions** — promo‑code manager with activate/deactivate and usage tracking.
- **Support** — review moderation + disputes/refunds workflow.
- **Customer 360** — per‑member profile with order history, spend, addresses, disputes.
- **Activity Logs** — every create/update/delete/payment/verdict is recorded (localStorage),
  shown on `logs.html`.
- **Notifications** — bell dropdown with first‑time / returning‑client alerts.
- **First‑time vs returning clients** — badges in the orders table + a banner and toast
  in the order detail.
- **Driver availability** — distinguishes online drivers that are free vs in a delivery,
  surfaced on the dashboard and filterable on the Drivers page.
- **Payments** — track and pay restaurants (sales − 15% commission) and drivers (delivery
  fees), with per‑entity order breakdowns.

---

## Deployment

- **GitHub:** https://github.com/Djihad-derbal/Jebllo-app-UI-website (branch `main`).
- **Vercel:** deployed as a zero‑config static site → https://jebllo.vercel.app.
  Redeploy with `vercel deploy --prod` from the project root.

---

## Notes & limitations

- **No backend.** All data is mock. CRUD edits, payment/verification/dispute statuses, and
  promo state live in memory and reset on a hard reload; the **activity log** and
  **notifications** persist via `localStorage` (`jebllo_logs`, `jebllo_notifs`).
- The shell (sidebar + header) is duplicated per page (static multi‑page site). The nav
  block is now identical on every page, so it can be changed with one find‑replace per
  file — a small JS include or build step could single‑source it later.
- **Next step for a real app:** externalize the inline mock data (orders, drivers, promos,
  applicants, etc.) into `/data/*.json` so each file maps to an API response shape, and add
  a short data‑model / endpoint spec for the backend developer.
