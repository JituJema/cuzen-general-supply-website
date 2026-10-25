# Cuzen General Supply website: structure and plan

## Who the site is for

| Visitor | What they need to decide | Where we send them |
| --- | --- | --- |
| Government procurement officer (MDAs) | Is this supplier registered, PPRA-aligned and able to work on NEST? | Home, For institutions |
| NGO or company buyer | Can they supply my list, and can they install it? | Products, Services, Contact |
| Contractor or facility manager | Do they do wiring, air-conditioning and site work? | Services |

The one job of the whole site: **turn a visit into a quotation request** (WhatsApp, email or call).

## Site map

```
/                 Home
/about            About
/products         Products (with quote list)
/services         Services (installation and air-conditioning)
/institutions     For institutions (procurement)
/contact          Contact and quote request
/404              Not found
```

## What each page accomplishes

### Home (`/`)
Goal: explain what Cuzen does in ten seconds and send people to the right page.
1. **Hero** with a division switcher (stationery, electrical, construction, installation and A/C, PPE). It rotates by itself, pauses on hover, and each tab links to its section.
2. **Trust bar**: BRELA registered, tender-ready (PPRA and NEST), wholesale and retail, TBS-approved cables.
3. **Divisions bento**: five cards, each with a photo or PPE illustration and a link.
4. **Who we supply**: tabs for Government, NGOs and private companies.
5. **Why Cuzen**: four reasons (wholesale and retail, end-to-end installation, pricing, e-tendering).
6. **How ordering works**: three real steps (tell us, quotation, delivery and installation).
7. **Quotation call to action** with a company profile download.

### About (`/about`)
Goal: build trust.
Page header, company story, vision and mission, three values, registration facts (BRELA number and TIN with copy buttons), company profile download, call to action.

### Products (`/products`)
Goal: let buyers see the range and build a list they can send.
Sticky category filter (all, stationery, electrical, construction, PPE). Four product groups with item lists. Every item has a **+ button** that adds it to the **quote list**. The list is saved in the browser, shown in a slide-in panel, and sent by WhatsApp or email with the items pre-written.

### Services (`/services`)
Goal: show that Cuzen also installs, including air-conditioning.
Three service cards (electrical wiring and diagnostics, **air-conditioning works**, hardware assembly and site installation), supply-plus-installation section, FAQ accordion, call to action.

### For institutions (`/institutions`)
Goal: answer a procurement team's questions without a phone call.
Three ways to buy (NEST, direct quotation, wholesale or retail), what we supply, registration details, downloads (company profile and brochure PDFs), standards, procurement FAQ.

### Contact (`/contact`)
Goal: make the quotation request take under a minute.
Contact cards (call, other lines, WhatsApp, email, address with map link, copy buttons) and a form with floating labels and chip choices. Pressing a button opens WhatsApp or the email app with the message already written, including any items from the quote list.

## Design system

| Token | Value |
| --- | --- |
| Navy | `#0B2545`, ink `#06162B`, blue `#15396B` |
| Brass | gold `#C8911A`, light brass `#E8C068` |
| Surfaces | mist `#EDF1F7`, paper `#F8FAFC` |
| Headings | Bricolage Grotesque (self-hosted) |
| Body | Figtree (self-hosted) |
| Concept | Engineering blueprint grid behind the hero, glass panels over photos, brass accents from the logo |

## Motion and micro-interactions (all CSS or tiny vanilla JS)

* One orchestrated page-load sequence in the hero, then the division switcher with a progress bar on each tab.
* Subtle tilt on the glass viewer (mouse devices only).
* Glass cards with a cursor spotlight.
* Gentle reveal on scroll, a drawn line in the ordering steps, sliding nav underline.
* Button shine, add-to-list tick animation, bouncing list counter, toast messages, smooth accordion, floating form labels, WhatsApp button pulse.
* Cross-page fade using the View Transitions API (progressive enhancement).
* `prefers-reduced-motion` turns all of it off. Content never depends on animation.

## Performance and accessibility

* No framework, no third-party scripts. Fonts self-hosted (two WOFF2 files). Images converted to WebP with width and height set, below-the-fold images lazy loaded.
* Static HTML served by Vercel with long-lived caching for fonts and images and security headers (`vercel.json`).
* Skip link, visible focus rings, ARIA for tabs, accordion, drawer and toasts, keyboard support (Esc closes panels, arrow keys move between hero tabs).
* Responsive from phone to wide desktop; mobile menu is a full-screen glass panel.

## Content to confirm with the client

* WhatsApp number used for quotes: **0773 652 494** (first number on the profile).
* Air-conditioning wording (installation, servicing, repair) and the PPE list were written from the brief; check they match what Cuzen supplies.
* The brochure and company profile PDFs in `assets/downloads/` should be replaced when the documents change.
* A domain name, real photos of products and past projects, and client logos or testimonials would make the site stronger.

## Later phases

1. Swahili and English toggle.
2. Projects or gallery page with real site photos.
3. Admin to edit products and prices (the GitHub Contents API pattern used on other projects).
4. Google Business Profile, analytics and a sitemap once the domain is known.

