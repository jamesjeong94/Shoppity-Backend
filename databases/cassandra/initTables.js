const tables = {
  list:
    'CREATE TABLE IF NOT EXISTS sdc.products_list (product_id INT, name TEXT, slogan TEXT, description TEXT, category TEXT, default_price TEXT, features list<FROZEN <sdc.feature>>,PRIMARY KEY (product_id));',
  styles:
    'CREATE TABLE IF NOT EXISTS sdc.styles (product_id TEXT,style_id INT , name TEXT, original_price TEXT,skus list<FROZEN<sku>>, sale_price TEXT, default_style INT, photos list<FROZEN <sdc.photo>>, PRIMARY KEY(product_id, style_id))',
  related:
    'CREATE TABLE IF NOT EXISTS sdc.related (product_id INT PRIMARY KEY, related_products list<TEXT>)',
  photos:
    'CREATE TABLE IF NOT EXISTS sdc.photos (style_id INT PRIMARY KEY, photos list<FROZEN <sdc.photo>>)',
  skus:
    'CREATE TABLE IF NOT EXISTS sdc.skus (style_id INT PRIMARY KEY, skus list<FROZEN<sdc.sku>>)',
};

module.exports = tables;
