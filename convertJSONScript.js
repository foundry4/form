const { Client } = require('pg');
const createData = require('./lib/createData');

const parse = async (id,parsed,client)=> {
  try {
    let SQL = '';
    const { sql_values } = createData(JSON.parse(parsed));
    Object.keys(sql_values).map((key)=> {
      if (key === 'info'|| key.includes('unchecked') || key.includes('power_supplies _')|| key.includes('m_specialism')) {
      }
      else {
        SQL = SQL + `UPDATE companies SET ${key}='${fix_quote(sql_values[key])}' WHERE id=${id} ;`;
      }
    });
    await client.query(SQL);
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
      await parse(row.id,JSON.stringify(row.info),client);
    }));
    client.end();
  }
  catch(err){
    console.log('Error retrieving rows from database;', err.toString());
  }
}
const fix_quote = (string) => {
  if (typeof string === 'string'){
    return string.replace("'" , "''");
  }
  else {
    return string;
  }
}
getRows();
