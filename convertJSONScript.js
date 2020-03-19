const { Client } = require('pg');
const createData = require('./lib/createData');

const parse = async (id,parsed,client,company_name)=> {
  try {
    if(parsed.length>2) {
      let json = JSON.parse(parsed);
      const { fields, sql_values, values } = createData(json);
      if(!company_name) {
        const fields_array = fields.split(', ');
        await Promise.all(Object.keys(sql_values).map(async (key, index) => {
          if (key.includes('unchecked') || key.includes('power_supplies _') || key.includes('m_specialism')) {
          } else {
            const SQL = `UPDATE companies SET ${fields_array[index]}=$1 WHERE id=${id};`;
            const query = {
              text: SQL,
              values: values.slice(index, index + 1),
            }
            await client.query(query);
          }
        }));
      }
      else {
        console.log('skipping row for id', id);
      }
    }
  }
  catch(err){
    console.log('Error parsing JSON into columns;', err.toString());
  }
}
const getRows = async ()=>{
  try {
    const client = new Client({
      connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    const SQL = 'SELECT * from companies;'
    let rows = await client.query(SQL);
    console.log('Converting ',rows.rows.length,' rows',process.env.DATABASE_URL);
    await Promise.all(rows.rows.map(async (row)=>{
      await parse(row.id,JSON.stringify(row.info),client,row.company_name);
    }));
    client.end();
  }
  catch(err){
    console.log('Error retrieving rows from database;', err.toString());
  }
}
getRows();
