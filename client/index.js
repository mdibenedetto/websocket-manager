const WEBSOCKET_URL = 'ws://localhost:7071/my-ws';
document.addEventListener('DOMContentLoaded', async () => {
  const wsOutput = document.querySelector('#ws-output');
  const txtMessage = document.querySelector('#txt-message');
  const btnSend = document.querySelector('#btn-send');

  btnSend.addEventListener('click', () => {
    btnSend.setAttribute('disabled', '');
    wsOutput.className = 'alert alert-warning';
    wsOutput.innerHTML = 'Server is processing the message';
    // you do not need the `setTimeout`, this is just to simulate a server delay
    setTimeout(() => {
      ws.send(txtMessage.value);
    }, 1500);
  });
  // connect to the websocket
  const ws = await connectToServer();

  ws.onmessage = (message) => {
    btnSend.removeAttribute('disabled');

    wsOutput.className = 'alert alert-success';
    wsOutput.innerText = message.data;
    txtMessage.focus();
  };

  async function connectToServer() {
    const ws = new WebSocket(WEBSOCKET_URL);

    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (ws.readyState === 1) {
          clearInterval(timer);
          resolve(ws);
        }
      }, 10);
    });
  }
});
