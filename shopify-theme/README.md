# Beads & Pieces — Shopify theme

Matches the original Next.js site: **black background**, **gold (#D4AF37)**, **Cormorant Garamond** headings, **Inter** body, hero box with shimmer, About Me, product cards with gold borders.

## Install on Shopify

1. **Create a Shopify store** (free trial): [shopify.com](https://www.shopify.com) → start trial, choose store name.
2. Zip this folder:
   ```bash
   cd shopify-theme
   zip -r ../beads-pieces-shopify-theme.zip .
   ```
3. In Shopify admin: **Online Store → Themes → Add theme → Upload zip file** → upload `beads-pieces-shopify-theme.zip`.
4. Click **Customize** on the new theme, then:
   - **Home page**: open **Featured collection** section → choose the collection that holds Mel’s products (create collection first if needed).
   - **Theme settings** (paintbrush icon, left): set **Instagram URL** and designer credit if different.
5. **Navigation**: **Online Store → Navigation** → edit **Main menu** (or create **Main menu** if missing). Add:
   - Home → `/`
   - Shop → `/collections/all` (or a specific collection URL)
6. **Header section**: In theme editor, select **Header** → assign **Main menu** to the menu you created.
7. **Publish** the theme when happy.

## Mel’s day-to-day

- **Products**: Shopify admin → **Products** (photos, prices, descriptions).
- **Homepage text**: **Online Store → Customize** → edit **Home hero** and **About me** sections.
- **Orders & payments**: Shopify handles checkout, emails, and payouts (after she completes Shopify Payments / bank setup).

## Optional: Shopify CLI (for developers)

```bash
npm install -g @shopify/cli @shopify/theme
cd shopify-theme
shopify theme dev --store your-store.myshopify.com
```

Links the folder to the store for live preview and push.

## Files overview

| Path | Purpose |
|------|---------|
| `layout/theme.liquid` | HTML shell, fonts, CSS |
| `assets/base.css` | All styling |
| `sections/header.liquid` | Sticky header + nav + cart |
| `sections/footer.liquid` | Made by Mel, Instagram, credit |
| `sections/hero-home.liquid` | Gold border hero |
| `sections/about-me.liquid` | About block |
| `sections/featured-collection.liquid` | Product grid on home |
| `sections/main-collection.liquid` | Collection page |
| `sections/main-product.liquid` | Product detail + add to cart |
| `sections/main-cart.liquid` | Cart |
| `sections/main-page.liquid` | Static pages (policies) |
| `templates/*.json` | Which sections appear on each template |

## Relationship to the Next.js app

This theme lives **beside** your existing `beads-and-pieces-mel` site. You can:

- Run **only Shopify** for Mel (simplest), or  
- Keep the Next.js site as a **landing page** that links to `https://her-store.myshopify.com` or a custom domain pointed at Shopify.
