const datatypes = {
  feature: 'CREATE TYPE IF NOT EXISTS feature (feature TEXT, value TEXT)',
  photo: 'CREATE TYPE IF NOT EXISTS photo (thumbnail_url TEXT, url TEXT)',
  sku: 'CREATE TYPE IF NOT EXISTS sku (size TEXT, quantity TEXT)',
};

module.exports = datatypes;
