export default async function (fastify, opts) {
    const { connection } = opts;

    fastify.post('/v1/admin/login', async (request, reply) => {
        const { adminEmail, adminPassword } = request.body;

        if (!adminEmail || !adminPassword) {
            return reply.status(400).send({ error: 'Email e senha são obrigatórios' });
        }

        try {
            const result = await connection.execute(
                `SELECT id, nome, email FROM administradores WHERE email = :email AND senha = :password`,
                [adminEmail, adminPassword]
            );

            if (result.rows.length === 0) {
                return reply.status(401).send({ error: 'Email ou senha incorretos' });
            }

            const admin = result.rows[0];
            console.log('Dados do administrador retornados:', admin); // Log dos dados retornados
            request.session.adminId = admin[0]; // Armazena o ID do administrador na sessão
            return reply.send({ message: 'Login realizado com sucesso', adminName: admin[1], adminEmail: admin[2] });
        } catch (error) {
            console.error('Erro ao executar a consulta:', error);
            return reply.status(500).send({ error: 'Erro no servidor' });
        }
    });

    fastify.get('/v1/admin/me', async (request, reply) => {
        console.log('Sessão atual:', request.session); // Log da sessão

        const adminId = request.session.adminId;

        if (!adminId) {
            return reply.status(401).send({ error: 'Não autorizado' });
        }

        try {
            const result = await connection.execute(
                `SELECT id, nome, email FROM administradores WHERE id = :id`,
                [adminId]
            );

            if (result.rows.length === 0) {
                return reply.status(404).send({ error: 'Administrador não encontrado' });
            }

            const admin = result.rows[0];
            return reply.send({ adminName: admin[1], adminEmail: admin[2] });
        } catch (error) {
            console.error('Erro ao executar a consulta:', error);
            return reply.status(500).send({ error: 'Erro no servidor' });
        }
    });

    fastify.post('/v1/admin/register', async (request, reply) => {
        const { nome, email, senha } = request.body;

        if (!nome || !email || !senha) {
            return reply.status(400).send({ error: 'Nome, email e senha são obrigatórios' });
        }

        try {
            const result = await connection.execute(
                `INSERT INTO administradores (nome, email, senha) VALUES (:nome, :email, :senha)`,
                [nome, email, senha],
                { autoCommit: true }
            );

            return reply.send({ message: 'Administrador cadastrado com sucesso' });
        } catch (error) {
            console.error('Erro ao executar a consulta:', error);
            return reply.status(500).send({ error: 'Erro no servidor' });
        }
    });
}
