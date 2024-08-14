const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// URL de conexão com MongoDB Atlas
const mongoUri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority';

// Conectar ao MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro de conexão ao MongoDB', err));

// Definir um esquema e modelo para as mensagens
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Configurar middleware e rotas
app.use(express.static('public'));

// Socket.io para comunicação em tempo real
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Enviar mensagens anteriores para o novo cliente
  Message.find().sort('timestamp').exec((err, messages) => {
    if (err) throw err;
    socket.emit('chat history', messages);
  });

  // Receber mensagens do cliente e salvar no banco de dados
  socket.on('chat message', (msg) => {
    const newMessage = new Message(msg);
    newMessage.save((err) => {
      if (err) throw err;
      io.emit('chat message', msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Servidor ouvindo na porta ${port}`));
