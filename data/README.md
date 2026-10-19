# Amisha Masala - store data

Theme = repo root (Lafonre v2.3.0, Home 1 as `templates/index.json`).
No prices: all variants are 0, the theme hides prices and the cart and shows an **Order Now** popup enquiry form
(sent through Shopify's contact form: set the store email in Settings > Notifications > Sender email / Customer email).

## One command setup
`SHOP=amisha-masala.myshopify.com TOKEN=shpat_xxx node data/setup-store.mjs`
Custom app scopes: write_files, write_products, write_content, write_online_store_navigation.
It uploads theme images to Files, creates 28 products, 3 collections, pages (Owner's Pride, Quality, Packaging, Reach Us) and menus.

`products.csv` is an alternative product import (Admin > Products > Import); images load from this public repo.
