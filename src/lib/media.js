const mediaAssets = import.meta.glob('../../Media/product_images/**/*.{png,jpg,jpeg,webp,gif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const normalizeMediaKey = (value) =>
  String(value || '')
    .replace(/\\/g, '/')
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/^(\.\.\/)+/, '')
    .replace(/^Media\//, '');

const mediaMap = Object.entries(mediaAssets).reduce((map, [path, url]) => {
  map.set(normalizeMediaKey(path), url);
  return map;
}, new Map());

const getMediaFolder = (value) => {
  const key = normalizeMediaKey(value);
  const index = key.lastIndexOf('/');
  return index >= 0 ? key.slice(0, index) : '';
};

const naturalImageSort = (a, b) => {
  const aMatch = a.match(/image-(\d+)/i);
  const bMatch = b.match(/image-(\d+)/i);
  return Number(aMatch?.[1] || 0) - Number(bMatch?.[1] || 0);
};

export const resolveMediaUrl = (value, fallback = '') => {
  if (!value) return fallback;

  const raw = String(value);
  if (/^(https?:|data:|blob:)/i.test(raw)) {
    return raw;
  }

  const key = normalizeMediaKey(raw);
  return mediaMap.get(key) || mediaMap.get(`product_images/${key}`) || raw.replace(/^(\.\.\/)+/, '/');
};

export const resolveProductImage = (product, fallback = '') =>
  resolveMediaUrl(product?.image || product?.image_url, fallback);

export const resolveProductGallery = (product, fallback = '') => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images.map((image) => resolveMediaUrl(image)).filter(Boolean);
  }

  const image = product?.image || product?.image_url;
  const folder = getMediaFolder(image);

  if (!folder) {
    return [resolveProductImage(product, fallback)].filter(Boolean);
  }

  const images = [...mediaMap.entries()]
    .filter(([key]) => key.startsWith(`${folder}/image-`))
    .sort(([a], [b]) => naturalImageSort(a, b))
    .map(([, url]) => url);

  return images.length > 0 ? images : [resolveProductImage(product, fallback)].filter(Boolean);
};
