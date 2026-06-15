# Your Portfolio Website — How to Edit & Publish

A plain-English guide. No coding experience needed for the everyday changes.

---

## 1. The files (what's what)

| File | What it is |
|------|------------|
| `index.html` | Home page |
| `work.html` | Your portfolio grid (with the Product / UI·UX / 3D / Interior filters) |
| `case-study.html` | A full project write-up. **Copy this file** for each real case study. |
| `about.html` | Your bio + what you offer |
| `contact.html` | Contact form + your links |
| `assets/` | Shared styling & scripts — **edit your colours here** (see §4) |
| `images/` | The picture placeholders you'll swap for your real work |
| `_raw/` | The original Stitch design files, kept for reference. Safe to delete. |

---

## 2. Preview it on your computer

**Easiest:** double-click `index.html` — it opens in your browser. Click around; all the links work.

*(Inside Claude Code you can also use the Launch preview — it's already set up.)*

---

## 3. Swap in your real images

Every placeholder is a file in the `images/` folder (e.g. `ph-3d.svg`). To replace one:

1. Put your real picture in the `images/` folder (a `.jpg` or `.png`).
2. In the page, find the line with that placeholder, e.g.
   `<img ... src="images/ph-3d.svg" ...>`
3. Change `images/ph-3d.svg` to your file, e.g. `images/my-render.jpg`.

Tip: landscape project images look best around **1200×900**; your About photo is portrait.
Every replaceable image has a `<!-- REPLACE: ... -->` note next to it in the code.

---

## 4. Change text & colours

- **Text:** open any `.html` file and type over the words between the tags. The sample copy is marked *(Sample.)* — that's your cue to replace it.
- **Colours:** open `assets/tailwind.config.js`. Change `primary` (the indigo `#4648d4`) to your brand colour and the whole site updates. Everything is labelled.

---

## 5. Make the contact form actually send

The form needs a free helper to email you the messages (a plain web page can't send email by itself).

1. Go to **https://formspree.io** and sign in with Google (free, no card).
2. Create a form — it gives you a link like `https://formspree.io/f/abcdwxyz`.
3. In `contact.html`, find `action="https://formspree.io/f/your-form-id"` and paste your link in.

Also: in `contact.html` (and the footers), replace `you@example.com` with your real email.
Until then, your **LinkedIn** link already works as a contact route.

---

## 6. Put it online — free, no card

Your site is plain files, so hosting is free and easy:

- **Netlify Drop** — go to **app.netlify.com/drop** and drag this whole folder onto the page. It's live in seconds with a free `yourname.netlify.app` address. *(Free, no card.)*
- **GitHub Pages** or **Cloudflare Pages** also host static sites for free.

You can connect your own domain name later if you buy one.

---

## 7. Good to know

- The site styles itself using **Tailwind via the internet** (the `cdn.tailwindcss.com` line). It needs an internet connection to look right, and your browser may show a small "production" console note — harmless for a portfolio. If you ever want it fully self-contained, that's a later upgrade.
- Keep the `assets/` and `images/` folders next to the HTML files — they belong together.

---

Built from your **Strategic Product Design Portfolio** (Stitch) design. Enjoy! 🎨
