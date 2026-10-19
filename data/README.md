# Amisha Masala - store data

Theme = repo root (Lafonre v2.3.0, Home 1 as `templates/index.json`). Everything here is content the theme cannot carry.

## Order of setup
1. **Files + collections + pages + menus**: `SHOP=xxx.myshopify.com TOKEN=shpat_xxx node data/setup-store.mjs`
   (custom app scopes: write_files, write_products, write_content, write_online_store_navigation).
   No token? Upload `data/shop-files/*` to Settings > Content > Files (keep file names), create the 3 collections
   (automated, tag equals `plain-spices` / `mixed-spices` / `other-spices`), pages (`owners-pride` template `about`,
   `quality`, `packaging`, `contact` template `contact`) and menus (`main-menu`, `spices-menu`, `footer`) by hand.
2. **Products**: Admin > Products > Import > `data/products.csv`.
   `Image Src` points to `raw.githubusercontent.com/.../data/product-images/`; that only works while the repo is public.
   Private repo: make it public for the import, or upload `data/product-images/*` and re-add images.
3. **Prices are placeholders** (client gave none except Rs 5 / Rs 10 pouches). Every product is tagged `price-tbc`.
