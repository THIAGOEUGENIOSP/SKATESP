import sqlite3 from "sqlite3"

const db = new sqlite3.Database('.app/database/SQLite.db', (err) =>{
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
      } else {
        console.log('Conexão com o banco de dados SQLite estabelecida com sucesso!');
      }
    });


