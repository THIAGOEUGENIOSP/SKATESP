const dadosPessoais = async (fastify, opt) => {
    fastify.post('/dados_pessoais', async (req, resp) => {
        const { nome, email, senha, telefone, celular, cep, endereco, numero, complemento, bairro, cidade, estado, pais } = req.body;
        const query = "INSERT INTO dados_pessoais (nome,email,senha,telefone,celular,cep,endereco,numero,complemento, bairro, cidade, estado, pais) VALUES (:nome,:email,:senha, :telefone, :celular,:cep,:endereco,:numero,:complemento,:bairro,:cidade,:estado,:pais)";
        const params = { nome, email, senha, telefone, celular, cep, endereco, numero, complemento: complemento || null, bairro, cidade, estado, pais: pais || null };

        try {
            console.log('Tentando executar a consulta no banco de dados...');
            console.log('Dados recebidos:', params); // Adicionando um log para exibir os dados recebidos do formulário
            await opt.connection.execute(query, params, { autoCommit: true });
            console.log('Consulta executada com sucesso!');
            return resp.send("Cadastrado realizado com sucesso!");
        } catch (err) {
            console.error('Erro ao executar a consulta no banco de dados:', err.message);
            resp.code(500).send({ error: err.message });
        }
    });


fastify.put('/dados_pessoais/:id', async(req,resp)=>{
    const { id } = req.params;
    const {nome,email,senha,telefone,celular,cep,endereco,numero,complemento, bairro, cidade, estado, pais } = req.body;
    const query = 'UPDATE dados_pessoais SET nome = :nome, email = :email, senha = :senha,  telefone = :telefone, celular = :celular, cep = :cep, endereco = :endereco, numero = :numero, complemento = :complemento, bairro = :bairro, cidade = :cidade, estado = :estado, pais = :pais WHERE id = :id';
    const params = { nome, email, senha, telefone, celular, cep, endereco, numero, complemento, bairro, cidade, estado, pais, id };

    try{
        await opt.connection.execute(query,params,{autoCommit:true});
        return resp.send("Dados alterados com sucesso!");
        }catch(err){
            resp.code(500).send({ error: err.message });
    }
   
});

fastify.get('/dados_pessoais', async(req,resp)=>{
    try{
    const dados = await opt.connection.execute('SELECT * FROM dados_pessoais');
    resp.send(dados.rows);
    } catch(error){
        console.error('Erro ao buscar Dados:', error);
            res.code(500).send({ error: 'Erro ao buscar usuários' });
    }
});
}

export default dadosPessoais;