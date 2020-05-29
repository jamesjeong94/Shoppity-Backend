const init = {
  list:
    'CREATE TABLE IF NOT EXISTS products_list (product_id TEXT PRIMARY KEY, name TEXT, slogan TEXT, description TEXT, category TEXT, default_price TEXT)',
  styles:
    'CREATE TABLE IF NOT EXISTS styles (product_id TEXT,id TEXT PRIMARY KEY, name TEXT, original_price TEXT, sale_price TEXT, default TEXT, photos frozen<photos>)',
  related:
    'CREATE TABLE IF NOT EXISTS related (product_id TEXT, related_products frozen<related_products>)',
};

module.exports = init;
