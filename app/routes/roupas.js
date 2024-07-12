import oracledb from "oracledb";
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });
let carrinho = [
    { id: 1, nome: 'Item 1', preco: 10.00 },
    { id: 2, nome: 'Item 2', preco: 20.00 },
    { id: 3, nome: 'Item 3', preco: 15.00 }
];

const listRoupas = async (fastify, opt) => {
    const connection = opt.connection;
    // Definindo a rota GET para listar roupas
    fastify.get("/list-roupas", async (req, resp) => {
        try {
            const result = await opt.connection.execute(`
                SELECT id, descricao, valor, url_img, "TAMANHO P", "TAMANHO M", "TAMANHO G", "TAMANHO GG"
                FROM roupas
            `);
    
            const roupas = result.rows.map(row => ({
                id: row[0],
                descricao: row[1],
                valor: row[2],
                url_img: row[3],
                tamanhos: {
                    P: row[4],
                    M: row[5],
                    G: row[6],
                    GG: row[7]
                }
            }));
    
            resp.send(roupas);
        } catch (err) {
            console.error('Erro ao buscar roupas:', err);
            resp.code(500).send(err.message);
        }
    });
    
    
    

    
 
    // Rota de criação de produtos (POST/Create)
    fastify.post('/roupas', async (req, resp) => {
        const { descricao, valor, url_img } = req.body;
        const roupaQuery = "INSERT INTO roupas (descricao, valor, url_img) VALUES (:descricao, :valor, :url_img) RETURNING id INTO :id";
        const roupaParams = { descricao, valor, url_img, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } };

        try {
            const roupaResult = await opt.connection.execute(roupaQuery, roupaParams, { autoCommit: false });
            const roupaId = roupaResult.outBinds.id[0];

            if (req.body.tamanhos && req.body.tamanhos.length > 0) {
                const estoqueQuery = "INSERT INTO ROUPAS (id, tamanho, quantidade) VALUES (:id, :tamanho, :quantidade)";
                const estoqueParams = req.body.tamanhos.map(t => ({ id: roupaId, tamanho: t.tamanho, quantidade: t.quantidade }));
                
                for (const param of estoqueParams) {
                    await opt.connection.execute(estoqueQuery, param, { autoCommit: false });
                }
            }

            // Commitar a transação
            await opt.connection.commit();
            return resp.send("Produto cadastrado com sucesso!");
        } catch (err) {
            // Rollback em caso de erro
            await opt.connection.rollback();
            console.error('Erro ao cadastrar produto:', err);
            resp.code(500).send({ error: err.message });
        }
    });

    // Rota de atualização (PUT/Update)
    fastify.put('/roupas/:id', async (req, resp) => {
        const { id } = req.params;
        const { descricao, valor, url_img, tamanhos } = req.body;
        const query = 'UPDATE roupas SET descricao = :descricao, valor = :valor, url_img = :url_img WHERE id = :id';
        const params = { descricao, valor, url_img, id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });

            if (tamanhos && tamanhos.length > 0) {
                const deleteQuery = 'DELETE FROM ESTOQUE_ROUPAS WHERE id_roupa = :id_roupa';
                await opt.connection.execute(deleteQuery, { id_roupa: id }, { autoCommit: true });

                const insertQuery = 'INSERT INTO ESTOQUE_ROUPAS (id_roupa, tamanho, quantidade) VALUES (:id_roupa, :tamanho, :quantidade)';
                await Promise.all(tamanhos.map(t => opt.connection.execute(insertQuery, { id_roupa: id, tamanho: t.tamanho, quantidade: t.quantidade }, { autoCommit: true })));
            }

            resp.send("Produto atualizado com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });

    fastify.patch('/roupas/:id', async (request, reply) => {
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
    
   // Rota para atualizar quantidade no estoque
fastify.put('/update-quantidade', async (req, resp) => {
    const { id_roupa, tamanho, quantidade } = req.body;
    console.log('Received:', { id_roupa, tamanho, quantidade }); // Log dos dados recebidos

    if (id_roupa === undefined || tamanho === undefined || quantidade === undefined) {
        console.error('Dados insuficientes fornecidos:', { id_roupa, tamanho, quantidade });
        return resp.code(400).send({ error: 'Dados insuficientes fornecidos' });
    }

    try {
        // Verifique se o produto e o tamanho existem no estoque
        const checkResult = await opt.connection.execute(
            `SELECT COUNT(*) AS count FROM ESTOQUE_ROUPAS WHERE id_roupa = :id_roupa AND tamanho = :tamanho`,
            { id_roupa, tamanho }
        );

        const count = checkResult.rows[0].COUNT;
        if (count === 0) {
            console.error('Produto ou tamanho não encontrado:', { id_roupa, tamanho });
            return resp.code(404).send({ error: 'Produto ou tamanho não encontrado' });
        }

        // Atualize a quantidade do estoque
        const result = await opt.connection.execute(
            `UPDATE ESTOQUE_ROUPAS
            SET quantidade = quantidade - :quantidade
            WHERE id_roupa = :id_roupa AND tamanho = :tamanho`,
            { quantidade, id_roupa, tamanho },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            console.error('Nenhuma linha afetada ao atualizar a quantidade:', { id_roupa, tamanho, quantidade });
            return resp.code(404).send({ error: 'Produto ou tamanho não encontrado' });
        }

        console.log('Quantidade atualizada com sucesso:', { id_roupa, tamanho, quantidade });
        resp.send({ success: 'Quantidade atualizada com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar quantidade:', err);
        resp.code(500).send({ error: 'Erro ao atualizar quantidade: ' + err.message });
    }
});


    
    

    // Rota para adicionar ao carrinho
    fastify.post('/api/carrinho', async (req, resp) => {
        try {
            const { nome, preco, tamanho, quantidade, imagem } = req.body;
            const itemExistente = carrinho.find(item => item.nome === nome && item.tamanho === tamanho);

            if (itemExistente) {
                itemExistente.quantidade += quantidade;
            } else {
                carrinho.push({ nome, preco, tamanho, quantidade, imagem });
            }

            resp.send({ message: 'Item adicionado ao carrinho', carrinho });
        } catch (err) {
            console.error('Erro ao adicionar item ao carrinho:', err);
            resp.code(500).send(err.message);
        }
    });

   

    // Rota para remover item do carrinho
    fastify.delete('/api/carrinho', async (req, resp) => {
        const { nome, tamanho } = req.body;
        carrinho = carrinho.filter(item => !(item.nome === nome && item.tamanho === tamanho));
        resp.send({ message: 'Item removido do carrinho', carrinho });
    });

    // Rota para atualizar quantidade do item no carrinho
 //   fastify.put('/api/carrinho', async (req, resp) => {
 //       const { nome, tamanho, quantidade } = req.body;
 //       const item = carrinho.find(item => item.nome === nome && item.tamanho === tamanho);
//
 //       if (item) {
 //           item.quantidade = quantidade;
 //           resp.send({ message: 'Quantidade atualizada', carrinho });
 //       } else {
 //           resp.status(404).send({ message: 'Item não encontrado' });
 //       }
 //   });

    // Rota de exclusão (DELETE)
    fastify.delete('/roupas/:id', async (req, resp) => {
        const { id } = req.params;
        const deleteEstoqueQuery = 'DELETE FROM ESTOQUE_ROUPAS WHERE id_roupa = :id';
        const deleteRoupasQuery = 'DELETE FROM roupas WHERE id = :id';

        try {
            await opt.connection.execute(deleteEstoqueQuery, { id }, { autoCommit: true });
            await opt.connection.execute(deleteRoupasQuery, { id }, { autoCommit: true });
            resp.send("Produto excluído com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });
};
export default listRoupas;
