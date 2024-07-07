

const listSkate = async (fastify, opt) => {
    // fastify: Instância do Fastify, usada para definir rotas
    // opt: Objeto de opções, pode conter coisas como a conexão do banco de dados
    // done: Callback para indicar que a configuração do plugin está completa

    // Definindo as rotas
    fastify.get("/list-skate", async (req, resp) => {
        try {
            const result = await opt.connection.execute("SELECT * FROM skate");
            const formatarResultado = result.rows.map(row => ({
                id: row[0],
                descricao: row[1],
                valor: row[2],
                url_img: row[3]
            }));
            resp.send(formatarResultado);
        } catch (err) {
            resp.code(500).send(err.message);
        }
    });

    // Rota de criação de produtos (POST/Create)
     
    fastify.post('/skate', async (req, resp) => {
        const { descricao, valor, url_img } = req.body;
        const query = `INSERT INTO skate (descricao, valor, url_img)
                VALUES (:descricao, :valor, :url_img)`;
        const params = { descricao, valor, url_img };
        
        // Verifica se foi enviado um arquivo de imagem
        if (!url_img) {
            return resp.code(400).send({ error: 'Nenhuma imagem enviada' });
        }

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            return resp.send("Produto cadastrado com sucesso!");
        } catch (err) {
            console.error('Erro ao cadastrar produto:', err);
            resp.code(500).send({ error: err.message });
        }
    });
            

    // Rota de atualização (PUT/Update)
    fastify.put('/skate/:id', async (req, resp) => {
        const { id } = req.params;
        const { descricao, valor, url_img } = req.body;
        const query = 'UPDATE skate SET descricao = :descricao, valor = :valor, url_img = :url_img WHERE id = :id';
        const params = { descricao, valor, url_img, id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            resp.send("Produto atualizado com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });
     // Rota de atualização parcial (PATCH)
     fastify.patch('/skate/:id', async (request, reply) => {
        const produtoId = request.params.id;
        const updates = request.body;

        try {
            const produtoAtualizado = await atualizarProduto(produtoId, updates);
            if (!produtoAtualizado) {
                return reply.status(404).send('Produto não encontrado');
            }
            return reply.send(produtoAtualizado);
        } catch (err) {
            reply.code(500).send({ error: err.message });
        }
    });

    // Rota de exclusão (DELETE)
    fastify.delete('/skate/:id', async (req, resp) => {
        const { id } = req.params;
        const query = 'DELETE FROM skate WHERE id = :id';
        const params = { id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            resp.send("Produto excluído com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });

    
};

export default listSkate;
