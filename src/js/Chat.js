import ChatAPI from "./api/ChatAPI";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
  }

  init() {
    this.bindToDOM();
    this.renderModalForm();
  }

  bindToDOM() {
    this.modalFormEl = this.container.querySelector('.modal__form');
    this.modalFormGroupEl = this.container.querySelector('.modal__form_group');
    this.onEnterChatHandler = this.onEnterChatHandler.bind(this);
    this.modalFormGroupEl.addEventListener('submit', this.onEnterChatHandler);
    this.modalInputEl = this.container.querySelector('.modal__input');
    this.onFocusModalInputEl = this.onFocusModalInputEl.bind(this);
    this.modalInputEl.addEventListener('focus', this.onFocusModalInputEl);
    this.modalWarningEl = this.container.querySelector('.modal__warning');
    this.btnChatDisconnectEl = this.container.querySelector('.chat__disconnect');
    this.closeChat = this.closeChat.bind(this);
    this.btnChatDisconnectEl.addEventListener('click', this.closeChat);
    this.chatUserListEl = this.container.querySelector('.chat__userlist');
    this.chatMessageContainerEl = this.container.querySelector('.chat__messages-container');
    this.chatMessageFormEl = this.container.querySelector('.chat__messages-form');
    this.sendMessage = this.sendMessage.bind(this);
    this.chatMessageFormEl.addEventListener('submit', this.sendMessage);
    this.chatMessageInputEl = this.container.querySelector('.chat__messages-input');
  }

  renderModalForm() {
    this.modalFormEl.classList.add('active');
  }

  hideModalForm() {
    this.modalFormEl.classList.remove('active');
  }

  onEnterChatHandler(e) {
    e.preventDefault();
    this.hideModalForm();
    this.userName = this.modalInputEl.value;
    this.api.create(this.userName, (res) => {
      if (res.status !== 'ok') {
        this.renderWarning();
        return;
      }
      this.startChat();
    });
  }

  startChat() {
    this.api.start((data) => {
      if (Array.isArray(data)) {
        this.renderUserList(data);
      } else {
        this.renderMessage(data);
      }
    });
  }

  renderUserList(data) {
    this.chatUserListEl.innerHTML = '';
    data.forEach(el => {
      const chatUserEl = document.createElement('div');
      chatUserEl.classList.add('chat__user');
      chatUserEl.textContent = el.name === this.userName ? 'You' : el.name;
      chatUserEl.id = el.id;
      this.chatUserListEl.insertAdjacentElement('afterbegin', chatUserEl);
    });
  }

  onFocusModalInputEl() {
    this.modalWarningEl.classList.add('hidden');
    this.modalInputEl.value = '';
  }

  renderWarning() {
    this.modalWarningEl.classList.remove('hidden');
    this.renderModalForm();
  }

  sendMessage(e) {
    e.preventDefault();
    const message = this.chatMessageInputEl.value;
    this.api.send({
      text: message,
      name: this.userName,
      date: Date.now(),
    });
    this.chatMessageInputEl.value = '';
  }

  renderMessage(data) {
    const messageContainerEl = document.createElement('div');
    messageContainerEl.classList.add('message__container');
    const messageHeader = document.createElement('h4');
    messageHeader.classList.add('message__header');
    const date = new Date(data.date).toLocaleTimeString().slice(0, -3) + ' ' + new Date(data.date).toLocaleDateString();
    if (data.name === this.userName) {
      messageContainerEl.classList.add('message__container-yourself');
      messageHeader.textContent = 'You, ' + date;
    } else {
      messageContainerEl.classList.add('message__container-interlocutor');
      messageHeader.textContent = data.name + ', ' + date;
    }
    messageContainerEl.insertAdjacentElement('beforeend', messageHeader);
    const messageText = document.createElement('div');
    messageText.classList.add('message__text');
    messageText.textContent = data.text;
    messageContainerEl.insertAdjacentElement('beforeend', messageText);
    this.chatMessageContainerEl.insertAdjacentElement('afterbegin', messageContainerEl);
  }

  closeChat() {
    this.api.close(this.userName);
    this.renderModalForm();
  }
}