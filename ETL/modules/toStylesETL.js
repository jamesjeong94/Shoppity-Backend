const lastProd = 710136;
const cassandraClient = require('../../databases/cassandra');

const addToStyles = async (field) => {
  let query = 'SELECT style_id from sdc.styles where product_id = ?';
  cassandraClient;
  for (let i = 1; i < lastProd; i++) {
    await cassandraClient
      .execute(query, [`${i}`], { prepare: true })
      .then(({ rows }) => {
        return rows;
      })
      .then((rows) => {
        let tableQuery = `SELECT ${field} from sdc.${field} where style_id = ?`;
        rows.forEach((data) => {
          cassandraClient
            .execute(tableQuery, [data.style_id], { prepare: true })
            .then(({ rows }) => {
              if (rows.length > 0) {
                tableInsertion(i, data.style_id, rows[0][field], field);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  console.log(`Done transfering ${field} to table: ${field}`);
  return;
};

const tableInsertion = (prod_id, id, data, field) => {
  if (data) {
    const query = `UPDATE sdc.styles SET ${field} = ? WHERE product_id = ? AND style_id = ?`;
    // console.log(data);
    cassandraClient
      .execute(query, [data, `${prod_id}`, id], { prepare: true })
      .then(() => {
        console.log('updated');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return;
};

module.exports = addToStyles;
