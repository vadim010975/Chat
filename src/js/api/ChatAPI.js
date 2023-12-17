import createRequest from './createRequest';
const HOST = 'http://localhost:3000/'

export default class ChatAPI {

  create(userName, callback) {
    createRequest({
      requestMethod: "POST",
      url: "new-user",
      host: HOST,
      callback,
      body: { name: userName },
    });
  }

  start(callback) {
    this.ws = new WebSocket('ws://localhost:3000/ws');
    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      callback(data);
    });
  }

  send(message) {
    if (!message) {
      return;
    }
    const jsonMessage = JSON.stringify({
      type: 'send',
      text: message.text,
      name: message.name,
      date: message.date,
    });
    this.ws.send(jsonMessage);
  }

  close(userName) {
    const jsonMessage = JSON.stringify({
      user: {
        name: userName,
      },
      type: 'exit',
    });
    this.ws.send(jsonMessage);
    this.ws.close();
  }
}