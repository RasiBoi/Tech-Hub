const textOf = (product) =>
  `${product?.title || ''} ${product?.description || ''} ${product?.spec || ''}`.toLowerCase();

export const getProductCategoryName = (product) =>
  product?.category?.name || product?.category || '';

export const getProductBrandName = (product) =>
  product?.brand || product?.vendor?.store_name || product?.vendor?.name || 'Premium Brand';

export const getProductSubcategory = (product) => {
  if (product?.subcategory) return product.subcategory;

  const category = getProductCategoryName(product).toLowerCase();
  const text = textOf(product);

  if (category.includes('stands') || category.includes('holders')) {
    if (text.includes('laptop')) return 'Laptop Stands';
    if (text.includes('book')) return 'Book Holders';
    if (text.includes('tablet') || text.includes('ipad') || text.includes('phone')) return 'Mobile & Tablet Stands';
    if (text.includes('headphone') || text.includes('headset')) return 'Headphone Stands';
    if (text.includes('arm')) return 'Monitor Arms';
    return 'Mobile & Tablet Stands';
  }

  if (category.includes('organizer')) {
    if (text.includes('drawer')) return 'Desk Drawers';
    if (text.includes('walnut') || text.includes('wood')) return 'Wood Organizers';
    if (text.includes('clear') || text.includes('tray')) return 'Drawer Organizers';
    return 'Wood Organizers';
  }

  if (category.includes('mat')) {
    if (text.includes('felt')) return 'Felt Desk Mats';
    if (text.includes('leather')) return 'Leather Desk Mats';
    if (text.includes('cork')) return 'Cork Desk Mats';
    return 'Leather Desk Mats';
  }

  if (category.includes('lighting')) {
    if (text.includes('monitor') || text.includes('light bar')) return 'Monitor Light Bars';
    if (text.includes('ambient') || text.includes('hexagon')) return 'Ambient Lighting';
    return 'Desk Lamps';
  }

  if (category.includes('clock') || category.includes('timer')) {
    if (text.includes('pixel') || text.includes('retro')) return 'Retro Pixel Clocks';
    return 'Digital Timers';
  }

  if (category.includes('charging')) {
    if (text.includes('dock') || text.includes('station') || text.includes('3-in-1')) return 'Multi-device Docks';
    return 'Wireless Chargers';
  }

  if (category.includes('monitor raiser')) {
    if (text.includes('dual') || text.includes('arm')) return 'Dual Monitor Mounts';
    if (text.includes('walnut') || text.includes('wood')) return 'Walnut Raisers';
    return 'Monitor Risers';
  }

  if (category.includes('standing desk')) return 'Electric standing desks';
  if (category.includes('chair')) return 'Mesh Task Chairs';
  if (category.includes('stress')) return 'Kinetic Toys';
  if (category.includes('cable')) return 'Cable Boxes';

  return product?.category?.name || product?.category || 'Desk Accessory';
};

export const enrichProductMeta = (product) => ({
  ...product,
  brand: getProductBrandName(product),
  subcategory: getProductSubcategory(product),
});
