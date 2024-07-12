

const listTenis = async (fastify, opt) => {
    // fastify: Instância do Fastify, usada para definir rotas
    // opt: Objeto de opções, pode conter coisas como a conexão do banco de dados
    // done: Callback para indicar que a configuração do plugin está completa

    // Definindo as rotas
    fastify.get("/list-tenis", async (req, resp) => {
        try {
            const result = await opt.connection.execute("SELECT * FROM estoque_tenis");
            const formatarResultado = result.rows.map(row => ({
                id: row[0],
                descricao: row[1],
                valor: row[2],
                url_img: row[3],
                tamanhos: {
                    37: row[4],
                    38: row[5],
                    39: row[6],
                    40: row[7],
                    41: row[8],
                    42: row[9],
                    43: row[10],
                    44: row[11]
                }
            }));
            resp.send(formatarResultado);
        } catch (err) {
            resp.code(500).send(err.message);
        }
    });

    // Rota de criação de produtos (POST/Create)
     
    fastify.post('/tenis', async (req, resp) => {
        const { descricao, valor, url_img } = req.body;
        const query = `INSERT INTO estoque_tenis (descricao, valor, url_img)
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
    fastify.put('/tenis/:id', async (req, resp) => {
        const { id } = req.params;
        const { descricao, valor, url_img } = req.body;
        const query = 'UPDATE estoque_tenis SET descricao = :descricao, valor = :valor, url_img = :url_img WHERE id = :id';
        const params = { descricao, valor, url_img, id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            resp.send("Produto atualizado com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });
    
    // Rota de atualização parcial (PATCH)
    fastify.patch('/tenis/:id', async (request, reply) => {
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
    fastify.delete('/tenis/:id', async (req, resp) => {
        const { id } = req.params;
        const query = 'DELETE FROM estoque_tenis WHERE id = :id';
        const params = { id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            resp.send("Produto excluído com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });

    
};

export default listTenis;
