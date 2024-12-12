import express from 'express';
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições


// Rota para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    try {
        const { email, name, age } = req.body;

        // Validações básicas
        if (!email || !name || !age) {
            return res.status(400).json({ error: 'Todos os campos (email, name, age) são obrigatórios.' });
        }

        const newUser = await prisma.user.create({
            data: { email, name, age },
        });

        res.status(201).json(newUser); // Retorna o usuário criado
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o usuário.' });
    }
});

// Rota para buscar usuários
app.get('/usuarios', async (req, res) => {
    try {
        let users = [];

        if (req.query.name || req.query.email || req.query.age) {
            users = await prisma.user.findMany({
                where: {
                    ...(req.query.name && { name: req.query.name }),
                    ...(req.query.email && { email: req.query.email }),
                    ...(req.query.age && { age: parseInt(req.query.age, 10) }),
                },
            });
        } else {
            users = await prisma.user.findMany();
        }

        res.status(200).json(users); // Retorna os usuários encontrados
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar os usuários.' });
    }
});

// Rota para atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, age } = req.body;

        // Verifica se todos os campos necessários estão presentes
        if (!email && !name && !age) {
            return res.status(400).json({ error: 'Pelo menos um campo (email, name, age) deve ser fornecido.' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: { email, name, age },
        });

        res.status(200).json(updatedUser); // Retorna o usuário atualizado
    } catch (error) {
        console.error(error);

        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        } else {
            res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
        }
    }
});

// Rota para deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: parseInt(id, 10) },
        });

        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        console.error(error);

        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        } else {
            res.status(500).json({ error: 'Erro ao deletar o usuário.' });
        }
    }
});

// Inicializa o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
