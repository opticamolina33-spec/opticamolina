// Helpers para mostrar los productos de la API con el formato del rediseño.

export const STORE = {
  address: 'Av. Castro Barros 485',
  city: 'Córdoba',
  phone: '351 679 7785',
  phoneHref: 'tel:+543516797785',
  hoursLong: 'Lunes a viernes · 9 a 13 h y 16 a 20 h',
  hoursShort: 'Lun a vie · 9–13 / 16–20 h',
  mapsUrl: 'https://maps.app.goo.gl/witpKBazKWnxEsLz9',
  whatsapp: '5493516797785',
};

export const whatsappUrl = (message = 'Hola! Me encontraba viendo la página y quiero más información') =>
  `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;

export const formatPrice = (value) =>
  value == null ? '[PRECIO]' : `$${Math.round(Number(value)).toLocaleString('es-AR')}`;

const titleCase = (str) =>
  str
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const sentenceCase = (str) => {
  const lower = str.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

// "VULK - LEVOL" -> { brand: "Vulk", model: "Levol" }
export const splitName = (product) => {
  const nombre = (product?.nombre || '').trim();
  if (product?.marca) {
    return { brand: titleCase(product.marca), model: nombre.replace(new RegExp(`^${product.marca}\\s*-?\\s*`, 'i'), '') || nombre };
  }
  if (nombre.includes('-')) {
    const [brand, ...rest] = nombre.split('-');
    return { brand: titleCase(brand), model: titleCase(rest.join('-').trim()) || nombre };
  }
  const [brand, ...rest] = nombre.split(' ');
  return { brand: titleCase(brand || 'Óptica Molina'), model: rest.length ? titleCase(rest.join(' ')) : nombre };
};

// Descripción multilínea -> "Polarizado · Armazón y patillas G-Flex"
export const specsLine = (product) =>
  (product?.descripcion || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    // Las líneas con códigos (ej: "S-BLACK/DRT4 POL") se dejan como vienen
    .map((l) => (/\d/.test(l) ? l : sentenceCase(l)))
    .map((l) => l.replace(/g-flex/gi, 'G-Flex').replace(/armazon/gi, 'Armazón'))
    .join(' · ');

export const firstImage = (product) => {
  const img = product?.imagenUrl;
  if (Array.isArray(img) && img.length) return img[0];
  if (typeof img === 'string' && img) return img;
  return null;
};

const text = (product) => `${product?.nombre || ''} ${product?.descripcion || ''} ${product?.material || ''}`.toLowerCase();

export const isPolarized = (p) => text(p).includes('polariz');
export const isAcetate = (p) => text(p).includes('acetato');
export const isGFlex = (p) => text(p).includes('g-flex') || text(p).includes('gflex');

export const productBadge = (product) => {
  if (product?.tieneDescuento && product?.porcentajeDescuento) return { label: `${product.porcentajeDescuento}% OFF`, accent: true };
  if (isPolarized(product)) return { label: 'Polarizado' };
  return null;
};

// Marcas ordenadas por cantidad de modelos (Vulk, Rusty, Tascani...)
export const brandsOf = (products) => {
  const counts = {};
  products.forEach((p) => {
    const { brand } = splitName(p);
    counts[brand] = (counts[brand] || 0) + 1;
  });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
};

// Título de promo con emojis y segmentos ("🔥 LIQUIDACIÓN ...  Hasta 40% OFF  Desde $39.900")
export const parsePromoTitle = (titulo = '') => {
  const clean = titulo.replace(/[\p{Extended_Pictographic}️]/gu, '').trim();
  const parts = clean.split(/\s{2,}|\n/).map((s) => s.trim()).filter(Boolean);
  const [title = '', ...rest] = parts;
  return {
    title: sentenceCase(title),
    subtitle: rest.filter((s) => !/^desde/i.test(s)).join(' · '),
  };
};
