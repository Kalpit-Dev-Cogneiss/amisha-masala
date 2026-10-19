// Optional: sets up store data that a theme push cannot carry (images in Files, collections, pages, menus).
//
//   SHOP=your-store.myshopify.com TOKEN=shpat_xxx node data/setup-store.mjs
//
// TOKEN = Admin API access token of a custom app with scopes:
//   write_files, write_products, write_content, write_online_store_navigation
// Products are imported separately with data/products.csv (Admin > Products > Import).
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const { SHOP, TOKEN, API_VERSION = "2026-07" } = process.env;
if (!SHOP || !TOKEN) throw new Error("Set SHOP and TOKEN env vars");
const here = path.dirname(fileURLToPath(import.meta.url));
const endpoint = `https://${SHOP}/admin/api/${API_VERSION}/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}
const userErrors = (label, node) => {
  const errs = node?.userErrors ?? [];
  if (errs.length) console.warn(`  ! ${label}:`, errs.map((e) => e.message).join("; "));
  return errs.length === 0;
};

// ---------------------------------------------------------------- 1. theme images -> Files
async function uploadFiles() {
  const dir = path.join(here, "shop-files");
  const names = await readdir(dir);
  for (const name of names) {
    const mime = name.endsWith(".png") ? "image/png" : "image/webp";
    const buf = await readFile(path.join(dir, name));
    const staged = await gql(
      `mutation($input:[StagedUploadInput!]!){stagedUploadsCreate(input:$input){stagedTargets{url resourceUrl parameters{name value}} userErrors{message}}}`,
      { input: [{ filename: name, mimeType: mime, httpMethod: "POST", resource: "FILE", fileSize: String(buf.length) }] },
    );
    const t = staged.stagedUploadsCreate.stagedTargets[0];
    const form = new FormData();
    t.parameters.forEach((p) => form.append(p.name, p.value));
    form.append("file", new Blob([buf], { type: mime }), name);
    const up = await fetch(t.url, { method: "POST", body: form });
    if (!up.ok) { console.warn(`  ! upload ${name}: ${up.status}`); continue; }
    const r = await gql(
      `mutation($files:[FileCreateInput!]!){fileCreate(files:$files){files{id} userErrors{message}}}`,
      { files: [{ originalSource: t.resourceUrl, contentType: "IMAGE", filename: name, alt: name.replace(/\.\w+$/, "").replace(/-/g, " ") }] },
    );
    if (userErrors(name, r.fileCreate)) console.log("  file", name);
  }
}

// ---------------------------------------------------------------- 2. collections (smart, by tag)
const collections = [
  ["Plain Spices", "plain-spices", "Single spice powders: chilli, turmeric, coriander, black pepper and more."],
  ["Mixed Spices", "mixed-spices", "Masalas and spice blends for every dish."],
  ["Other Spices", "other-spices", "Kasuri methi, batrisu vasanu and asafoetida (hing)."],
];
async function createCollections() {
  for (const [title, handle, desc] of collections) {
    const r = await gql(
      `mutation($input:CollectionInput!){collectionCreate(input:$input){collection{id} userErrors{message}}}`,
      { input: { title, handle, descriptionHtml: `<p>${desc}</p>`, ruleSet: { appliesDisjunctively: false, rules: [{ column: "TAG", relation: "EQUALS", condition: handle }] } } },
    );
    if (userErrors(title, r.collectionCreate)) console.log("  collection", handle);
  }
}

// ---------------------------------------------------------------- 3. pages (copy from the existing website)
const pages = [
  {
    title: "Owner's Pride", handle: "owners-pride", templateSuffix: "about",
    body: `<h3>Easy Accessibility</h3>
<p>Selecting the finest materials from all over the country, we begin our processing with the best of raw materials. Being centrally located, in Vadodara, (Gujarat) India. Accessible from anywhere in the country enables us to procure and send our material from and to any destination in India at the earliest.</p>
<p>With a vast choice of finely ground spice powders (masalas), J. B. Food Products are able to meet the growing demands in an expanding market with the help of its service oriented high quality production unit. Our principle is to deliver the best to our customer at the most reasonable price! With no compromise in hygiene &amp; quality.</p>`,
  },
  {
    title: "Quality Assurance", handle: "quality", templateSuffix: "",
    body: `<p>The products manufactured by us conform to the stringent International Quality Standards. We have testing facilities for assurances of purity, quality and safety parameters (pesticide residues, aflatoxin, heavy metals like lead, copper, zinc, cadmium, arsenic, mercury etc.). Microbiological tests (like total plate count, Salmonella, Coliform, E.Coli, Yeast &amp; Mould, S. Aureus, etc.), curcumin, capsaicin, Scoville index, pungency, colour value etc. determine the quality. The latest international protocols are adopted as prescribed in ASTA, AOAC, AOCS, EU etc. while the analysis is carried out using the latest sophisticated instruments.</p>
<h3>Nothing but the BEST!</h3>
<p>Amisha comes from a rich vintage of flavor and cuisine - at J. B. Food Products. The principle has always been to deliver the best quality to customers at efficient price. There is no compromise whatsoever on quality or hygiene.</p>
<p>We are equipped with sophisticated equipment for manufacturing and we also have an in-house cold storage, having a capacity of 400 tons. The strong infrastructure is backed by equally efficient management and teams to produce the most authentic high quality flavored spices. Right from the procuring of raw material to the packing and delivery of product, we ensure that our customers are served with only the very best of flavor.</p>`,
  },
  {
    title: "Packaging", handle: "packaging", templateSuffix: "",
    body: `<p>At J. B. Foods, we understand the customers' needs and provide different types of packaging with keeping in mind to preserve the aroma and the freshness of the spices. We have different sizes of pouch, box, jar and bag packaging starting from 7 g pouch up to 10 Kg bag, to satisfy our different customer needs.</p>`,
  },
  { title: "Reach Us", handle: "contact", templateSuffix: "contact", body: "" },
];
async function createPages() {
  for (const p of pages) {
    const r = await gql(
      `mutation($page:PageCreateInput!){pageCreate(page:$page){page{id} userErrors{message}}}`,
      { page: { title: p.title, handle: p.handle, body: p.body, isPublished: true, ...(p.templateSuffix ? { templateSuffix: p.templateSuffix } : {}) } },
    );
    if (userErrors(p.title, r.pageCreate)) console.log("  page", p.handle);
  }
}

// ---------------------------------------------------------------- 4. menus (same structure as the old site)
const item = (title, url, items = []) => ({ title, type: "HTTP", url, items });
const menus = {
  "main-menu": ["Main menu", [
    item("Home", "/"),
    item("Spices", "/collections/all", [
      item("Plain Spices", "/collections/plain-spices"), item("Mixed Spices", "/collections/mixed-spices"), item("Others", "/collections/other-spices")]),
    item("Packaging", "/pages/packaging"), item("Owner's Pride", "/pages/owners-pride"),
    item("Quality", "/pages/quality"), item("Reach Us", "/pages/contact")]],
  "spices-menu": ["Spices", [
    item("Plain Spices", "/collections/plain-spices"), item("Mixed Spices", "/collections/mixed-spices"), item("Others", "/collections/other-spices")]],
  footer: ["Footer menu", [
    item("Packaging", "/pages/packaging"), item("Owner's Pride", "/pages/owners-pride"),
    item("Quality", "/pages/quality"), item("Reach Us", "/pages/contact")]],
};
async function setMenus() {
  const existing = (await gql(`{menus(first:50){nodes{id handle}}}`)).menus.nodes;
  for (const [handle, [title, items]] of Object.entries(menus)) {
    const found = existing.find((m) => m.handle === handle);
    const r = found
      ? await gql(`mutation($id:ID!,$title:String!,$handle:String,$items:[MenuItemUpdateInput!]!){menuUpdate(id:$id,title:$title,handle:$handle,items:$items){menu{id} userErrors{message}}}`,
          { id: found.id, title, handle, items })
      : await gql(`mutation($title:String!,$handle:String!,$items:[MenuItemCreateInput!]!){menuCreate(title:$title,handle:$handle,items:$items){menu{id} userErrors{message}}}`,
          { title, handle, items });
    if (userErrors(handle, r.menuUpdate ?? r.menuCreate)) console.log("  menu", handle);
  }
}

console.log("1/4 theme images -> Files"); await uploadFiles();
console.log("2/4 collections"); await createCollections();
console.log("3/4 pages"); await createPages();
console.log("4/4 menus"); await setMenus();
console.log("done. Now import data/products.csv, then check Online Store > Themes.");
