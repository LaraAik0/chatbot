const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = 'AIzaSyBQYYNqZS4B1DJYQ1JqM-MD5IXOHViPT2Y'; // Substitua pela sua chave de API

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }

        const data = await response.json();
        res.json({ response: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://larasagaiif:ILDV7QMBUZKmHh9Q@projeto.9fh2p.mongodb.net/?retryWrites=true&w=majority&appName=projeto";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

