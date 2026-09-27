import rawProducts from "../data/boutique-products.json";
export type ShopProduct = (typeof rawProducts)[number];
export const products = rawProducts.filter(p => p.active);
export const categories = ["Bornes", "Caisses & POS", "Affichage", "Imprimantes", "Accessoires", "Robotique"];
export const productUrl = (p: ShopProduct) => `/boutique/${p.slug}/`;
