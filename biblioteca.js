const express = require('express');
const fs = require('fs').promises;
const router = express.Router();

async function lerArquivoJSON(caminho) {
    const dados = await fs.readFile(caminho, 'utf8');
    return JSON.parse(dados);
}

async function escreverArquivoJSON(caminho, conteudo) {
    const dados = JSON.stringify(conteudo, null, 2);
    await fs.writeFile(caminho, dados, 'utf8');
}

async function obterLivros() {
    return await lerArquivoJSON('./db/livros.json');
}

async function salvarLivros(livros) {
    await escreverArquivoJSON('./db/livros.json', livros);
}

router.get('/', async (req, res) => {
    try {
        const livros = await obterLivros();
        res.json(livros.livros);
    } catch (erro) {
        res.status(500).send('Erro ao ler os livros');
    }
});

router.post('/adicionar', async (req, res) => {
    const { titulo, autor, genero, exemplares, imagem } = req.body;
    try {
        const livros = await obterLivros();
        const novoLivro = { titulo, autor, genero, exemplares, imagem };
        livros.livros.push(novoLivro);
        await salvarLivros(livros);
        res.status(201).send('Livro adicionado com sucesso.');
    } catch (erro) {
        res.status(500).send('Erro ao adicionar o livro');
    }
});

router.post('/comprar', async (req, res) => {
    const { titulo } = req.body;
    try {
        const livros = await obterLivros();
        const livro = livros.livros.find(b => b.titulo === titulo);
        if (livro && livro.exemplares > 0) {
            livro.exemplares -= 1;
            await salvarLivros(livros);
            res.status(200).send('Livro comprado com sucesso.');
        } else {
            res.status(400).send('Livro não disponível.');
        }
    } catch (erro) {
        res.status(500).send('Erro ao comprar o livro');
    }
});

router.post('/repor', async (req, res) => {
    const { titulo, exemplares } = req.body;
    try {
        const livros = await obterLivros();
        const livro = livros.livros.find(b => b.titulo === titulo);
        if (livro) {
            livro.exemplares += exemplares;
            await salvarLivros(livros);
            res.status(200).send('Livro reposto com sucesso.');
        } else {
            res.status(400).send('Livro não encontrado.');
        }
    } catch (erro) {
        res.status(500).send('Erro ao repor o livro');
    }
});

module.exports = router;
