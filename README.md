# Moss Cave — Nature Cave Booking Platform

Software Version: 0.1.0 (demo)

## Description

A faithful, **buildless vanilla** web implementation of the "Nature" moss-cave booking
platform — an underground sanctuary booked by the day, limited by the cave itself.

It is a single-page app with three switchable surfaces (floating switcher, bottom-right):

- **Landing** — public site: hero (3 switchable variants), drifting-spore canvas, gallery,
  and a full booking flow (month calendar with live availability → slot + party size →
  name/phone → confirm → downloadable PDF receipt). Plus a "Track booking" modal that looks
  up a reservation by phone number.
- **Admin** — dashboard: overview stats, 7-day capacity chart, today-by-slot, bookings list,
  manual POS (walk-in) booking, and settings (daily quota + price per guest).
- **Mobile** — a dedicated phone-framed surface with a guest app and an admin app.

All data is a **frontend demo** persisted in `localStorage` — no backend. Availability is
generated deterministically per date; receipts are produced client-side with jsPDF.

Originally designed in Claude Design (`Nature.dc.html`) and ported to plain HTML/CSS/JS.

## Tech

- Plain HTML + CSS + JavaScript — **no build step**.
- Fonts: Newsreader, Hanken Grotesque, Space Mono (Google Fonts, CDN).
- PDF receipts: jsPDF (CDN).

## Run

No install needed. Either:

1. Open `index.html` directly in a browser, **or**
2. Serve statically (recommended) from the project root:

   ```
   python -m http.server 8000
   ```

   then visit <http://localhost:8000>.

## Demo

- Use the bottom-right switcher to move between **Landing / Admin / Mobile**.
- Book any open day on the calendar, then **Download receipt (PDF)**.
- Track a booking with the demo phone number **(555) 0148**, or any number you just booked with.

## Project layout

```
index.html        markup for all three surfaces + track modal
styles.css        theme, keyframes, shared component styles
js/               store, availability, receipt, effects, surface renderers, app boot
```

> `Project Resources/` holds working references (the original design) and is gitignored.
