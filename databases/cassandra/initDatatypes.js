const datatypes = {
  feature: 'CREATE TYPE IF NOT EXISTS sdc.feature (feature TEXT, value TEXT)',
  photo: 'CREATE TYPE IF NOT EXISTS sdc.photo (thumbnail_url TEXT, url TEXT)',
  sku: 'CREATE TYPE IF NOT EXISTS sdc.sku (size TEXT, quantity TEXT)',
};

module.exports = datatypes;
