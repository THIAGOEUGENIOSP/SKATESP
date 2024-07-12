const listUser = async (fastify, opt) => {
   
    fastify.get('/users', async (req, res) => {
        try {
            // Lógica para listar usuários
            const users = await opt.connection.execute("SELECT * FROM users"); // Exemplo de uma função fictícia para obter usuários do banco de dados
            res.send(users.rows);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.code(500).send({ error: 'Erro ao buscar usuários' });
        }
    });

   // Rota de exclusão (DELETE) 
    fastify.delete('/users/:id', async (req, resp) => {
        const { id } = req.params;
        const query = 'DELETE FROM users WHERE id = :id';
        const params = { id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            resp.send("Usuário excluído com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });

        // Rota de atualização (PUT/Update)
    fastify.put('/users/:id', async (req, resp) => {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const query = 'UPDATE users SET name = :name, email = :email, password = :password WHERE id = :id';
        const params = { name, email, password, id };

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            resp.send("Usuário atualizado com sucesso!");
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });  


    // Rota para cadastrar usuário (POST)
    fastify.post('/register', async (req, resp) => {
        const { name, email, password, confirm_password } = req.body;
        const query = "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)";
        const params = { name, email, password };

        // Verificar se as senhas coincidem
        if (password !== confirm_password) {
            return resp.code(400).send({ error: 'As senhas não coincidem' });
        }        

        try {
            await opt.connection.execute(query, params, { autoCommit: true });
            return resp.code(201).send({ message: "Usuário cadastrado com sucesso!" });
        } catch (err) {
            resp.code(500).send({ error: err.message });
        }
    });

    
};

export default listUser;
