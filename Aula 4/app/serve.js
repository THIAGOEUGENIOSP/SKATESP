import Fastify from "fastify";
import formbody from '@fastify/formbody';
import oracledb from "oracledb";
import fastifyCors from '@fastify/cors'; 
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyMultipart from '@fastify/multipart';
import listProducts from "./routes/products.js";
import listUser from "./routes/users.js";
import listRoupas from "./routes/roupas.js";
import dadosPessoais from "./routes/cadastro_pessoal.js";
import carrinho from "./routes/carrinho.js";
import listSkate from "./routes/skateProdutos.js";
import listTenis from "./routes/tenis.js"; 
import adminRoutes from "./routes/admin.js";



const dbConfig = {
    user: 'PROD_JD',
    password: 'Security1',
    connectString: 'localhost/XEPDB1'
};

const startServer = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Conexão com o banco de dados Oracle estabelecida com sucesso!');

        // Criar a instância do servidor Fastify
        const fastify = Fastify({
            logger: true
        });

        

        // Registrar o plugin fastify-formbody
        fastify.register(formbody);

        // Registrar o plugin fastify-cors
        fastify.register(fastifyCors, {
            origin: '*' // Permitir solicitações de qualquer origem
        });

        fastify.register(fastifyMultipart, {
            addToBody: true  // Adicionar dados ao corpo da requisição
        });

        fastify.register(fastifyCookie); // Registrar o plugin fastify-cookie
        fastify.register(fastifySession, {
            secret: 'uma-chave-secreta-muito-longa-e-segura-com-mais-de-32-caracteres', // Substitua por uma chave secreta segura
            cookie: { secure: false }  });// Defina como true se estiver usando HTTPS

        // Passar a conexão do banco de dados como opção para os plugins
        fastify.register(listProducts, { connection });
        fastify.register(listUser, { connection});
        fastify.register(listRoupas, { connection});
        fastify.register(dadosPessoais, { connection});
        fastify.register(carrinho, { connection});
        fastify.register(listSkate, { connection});
        fastify.register(listTenis, { connection }); 
        fastify.register(adminRoutes, { connection });

        // Iniciar o servidor Fastify
        await fastify.listen({ port: 3005 });
        console.log('Server is running on http://localhost:3005');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados Oracle:', err.message);
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error('Erro ao fechar a conexão:', closeErr.message);
            }
        }
        process.exit(1);
    }
};

startServer();
