import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const carrinho = async (fastify, opt) => {
  const connection = opt.connection;
  const carrinho = []; // Initialize carrinho as an empty array

  // Definindo a rota GET para listar roupas
  fastify.get('/api/carrinho/:id', async (req, resp) => {
    const id = parseInt(req.params.id);
  
    console.log(`Recebendo requisição para o item ID: ${id}`);
  
    try {
      const query = `
        SELECT A.ID AS ID, A.DESCRICAO AS DESCRICAO, A.VALOR AS VALOR, A.IMG_URL AS IMAGEM, 
        B.TAMANHO AS TAMANHO, B.QUANTIDADE AS QUANTIDADE      
        FROM roupas A 
        INNER JOIN ESTOQUE_ROUPAS B
        ON A.ID = B.ID_ROUPA
        WHERE A.ID = :id
      `;
  
      const result = await opt.connection.execute(query, { id });
      const results = result.rows;
  
      console.log(`Resultados da consulta: ${JSON.stringify(results)}`);
  
      if (results.length === 0) {
        resp.status(404);
        console.log(`Item com ID ${id} não encontrado`);
        return resp.send({ error: 'Item não encontrado' });
      }
  
      const item = results[0];
      resp.send(item);
      console.log(`Item retornado: ${JSON.stringify(item)}`);
    } catch (err) {
      console.error(`Erro ao buscar item no banco de dados: ${err.message}`);
      resp.status(500);
      resp.send({ error: 'Erro ao buscar item no banco de dados' });
    }
  });

fastify.get('/api/carrinho', async (req, resp) => {
try {
  // Fetch data from database and store it in carrinho array
  const query = `SELECT * FROM roupas`;
  const result = await opt.connection.execute(query);
  const results = result.rows;
  carrinho.push(...results);

  console.log('Carrinho:', carrinho);
  resp.send(carrinho);
} catch (error) {
  console.error('Erro ao obter itens do carrinho:', error);
  resp.status(500).send({ error: 'Erro ao obter itens do carrinho' });
}
});

};

export default carrinho;
