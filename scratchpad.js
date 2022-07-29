import pg from "pg";

const pool = new pg.Pool({
//   user: 'samchav',
  password: 'oppji',
  database: 'petshop',  
  host: 'localhost',
  port: 5432
});


pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end();
});