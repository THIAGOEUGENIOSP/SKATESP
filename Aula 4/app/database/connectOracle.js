import oracledb from "oracledb";


const dbConfig = {
    user: 'PROD_JD',
    password: 'Security1',
    connectString: 'localhost/XEPDB1' // Ou o endereço do seu banco de dados
};

oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados Oracle:', err.message);
        return;
    }
    console.log('Conexão com o banco de dados Oracle estabelecida com sucesso!');

    // Execute suas consultas aqui

    connection.close();
});

export default oracledb