const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = './database.json';

// Inicializar banco de dados local simples
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        financeiro: [],
        cobrancas: [],
        orcamentos: [],
        equipa: [
            { id: 1, nome: "Funcionária 1", funcao: "Produção", turno: "Manhã" },
            { id: 2, nome: "Funcionária 2", funcao: "Impressão", turno: "Manhã" },
            { id: 3, nome: "Funcionária 3", funcao: "Embalagem", turno: "Tarde" }
        ]
    }, null, 2));
}

function lerDados() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function guardarDados(dados) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));
}

// Rotas da API
app.get('/api/dados', (req, res) => {
    res.json(lerDados());
});

app.post('/api/financeiro', (req, res) => {
    const dados = lerDados();
    dados.financeiro.push(req.body);
    guardarDados(dados);
    res.json({ status: 'ok', dados: dados.financeiro });
});

app.post('/api/cobrancas', (req, res) => {
    const dados = lerDados();
    dados.cobrancas.push(req.body);
    guardarDados(dados);
    res.json({ status: 'ok', dados: dados.cobrancas });
});

app.post('/api/orcamentos', (req, res) => {
    const dados = lerDados();
    dados.orcamentos.push(req.body);
    guardarDados(dados);
    res.json({ status: 'ok', dados: dados.orcamentos });
});

app.delete('/api/:categoria/:index', (req, res) => {
    const { categoria, index } = req.params;
    const dados = lerDados();
    if (dados[categoria]) {
        dados[categoria].splice(index, 1);
        guardarDados(dados);
    }
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Servidor MLS Brindes a rodar na porta ${PORT}`);
});
