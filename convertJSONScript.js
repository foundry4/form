const { Client } = require('pg');
const createData = require('./lib/createData');
const parse = async (id,parsed)=> {
  try {
    let SQL = '';
    const { fieldNames, values } = createData(parsed);
    for (let i = 0; i < fieldNames.length; i++) {
      SQL = SQL + `UPDATE companies SET ${fieldNames[i]}='${values[i]}' WHERE id=${id};`;
    }
    const client = new Client({
      connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
      ssl: true,
    });
    await client.query(SQL);
    client.end();
  }
  catch(err){
    console.log(err.toString())
  }
}
const getRows = async ()=>{
  //
  try {
    const client = new Client({
      connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    const SQL = 'SELECT * from companies;'
    let rows = await client.query(SQL);
    console.log('Converting ',rows.rows.length,' rows');
    await Promise.all(rows.rows.slice(1,2).map(async (row)=>{
      parse(row.id,JSON.stringify(row.info),client)
    }));
    client.end();
  }
  catch(err){
    console.log(err.toString())
  }
}
getRows();
