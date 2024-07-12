const listProducts = async (fastify, opt) => {
    // fastify: Instância do Fastify, usada para definir rotas
    // opt: Objeto de opções, pode conter coisas como a conexão do banco de dados
    // done: Callback para indicar que a configuração do plugin está completa

    // Definindo as rotas
    fastify.get("/list-products", async (req, resp) => {
        try {
            const result = await opt.connection.execute("SELECT * FROM products");
            resp.send(result.rows);
        } catch (err) {
            resp.code(500).send(err.message);
        }
    });

    // Rota de criação de produtos (POST/Create)
    fastify.post('/products', async (req, resp) => {
        const { title, value, description, url_img } = req.body;
        const query = "INSERT INTO products (title, value, description, url_img) VALUES (:title, :value, :description, :url_img)";
        const params = { title, value, description, url_img };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            return resp.send("Produto cadastrado com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });

    // Rota de atualização (PUT/Update)
    fastify.put('/products/:id', async (req, resp) => {
        const { id } = req.params;
        const { title, value, description, url_img } = req.body;
        const query = 'UPDATE products SET title = :title, value = :value, description = :description, url_img = :url_img WHERE id = :id';
        const params = { title, value, description, url_img, id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            resp.send("Produto atualizado com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });

    // Rota de exclusão (DELETE)
    fastify.delete('/products/:id', async (req, resp) => {
        const { id } = req.params;
        const query = 'DELETE FROM products WHERE id = :id';
        const params = { id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            resp.send("Produto excluído com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });

    
};

export default listProducts;
