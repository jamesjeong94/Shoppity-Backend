const logTimeAndResolve = (timeBefore, table, res) => {
  const timeElasped = new Date() - timeBefore;
  console.log(`==>${table} table has been populated with data`);
  console.log(`Time taken for ${table} ETL: ${timeElasped}ms`);
  res({ [table]: timeElasped });
};

module.exports = { logTimeAndResolve };
