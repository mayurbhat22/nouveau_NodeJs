const sessions = new Map();

function findSession(id) {
  return sessions.get(id);
}

function saveSession(id, session) {
  sessions.set(id, session);
}

function findAllSessions() {
  return [...sessions.values()];
}

module.exports = {
  findSession,
  saveSession,
  findAllSessions,
};
