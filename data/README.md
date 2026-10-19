# Amisha Masala - store data

Theme = repo root (Lafonre v2.3.0, Home 1 as `templates/index.json`).
Pages: Home, About Us (theme About design), Spices (collection pages), Contact Us (theme Contact design).
No prices: variants are 0, the theme hides prices and shows an **Order Now** popup enquiry form
(sent through Shopify's contact form; set the store email in Settings > Notifications).

`SHOP=amisha-masala.myshopify.com CLIENT_ID=xxx CLIENT_SECRET=xxx node data/setup-store.mjs` (see header of the script;
`STEPS=pages,menus` etc. runs only some steps, `STEPS=publish` publishes products and collections to the Online Store).
`products.csv` is an alternative product import.
