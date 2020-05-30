const datatypes = {
  feature: 'CREATE TYPE IF NOT EXISTS feature (feature TEXT, value TEXT)',
  photo: 'CREATE TYPE IF NOT EXISTS photo (thumbnail_url TEXT, url TEXT)',
  skus_list:
    'CREATE TYPE IF NOT EXISTS skus (XS TEXT, S TEXT, M TEXT, L TEXT, XL TEXT)',
};

module.exports = datatypes;
