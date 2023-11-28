const messages = [];

function saveMessage(message) {
  messages.push(message);
}

function findMessageForUser(userId) {
  return messages.filter(({ from, to }) => from === userId || to === userId);
}

module.exports = {
  saveMessage,
  findMessageForUser,
};
