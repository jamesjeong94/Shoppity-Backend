const tables = {
  list:
    'CREATE TABLE IF NOT EXISTS products_list (product_id INT, name TEXT, slogan TEXT, description TEXT, category TEXT, default_price TEXT, features list<FROZEN <feature>>,PRIMARY KEY (product_id));',
  styles:
    'CREATE TABLE IF NOT EXISTS styles (product_id TEXT,style_id INT , name TEXT, original_price TEXT, sale_price TEXT, default_style INT,skus skus, photos list<FROZEN <photo>>, PRIMARY KEY(product_id, style_id))',
  related:
    'CREATE TABLE IF NOT EXISTS related (product_id INT PRIMARY KEY, related_products list<TEXT>)',
};

module.exports = tables;
