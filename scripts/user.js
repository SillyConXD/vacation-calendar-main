const users = [];
const MAX_USERS = 10;

function createUser(name, color) {
  if (!name || typeof name !== 'string') throw new Error('Invalid user name');
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) throw new Error('Invalid color format');
  if (users.some(user => user.name === name)) throw new Error('User already exists');
  if (users.some(user => user.color === color)) throw new Error('Color already in use');
  if (users.length >= MAX_USERS) throw new Error('User limit reached');

  const user = { name, color, history: [] };
  users.push(user);
  return user;
}

function deleteUser(name) {
  const index = users.findIndex(user => user.name === name);
  if (index === -1) throw new Error('User not found');
  users.splice(index, 1);
  return true;
}

function updateUser(name, updates) {
  const user = users.find(user => user.name === name);
  if (!user) throw new Error('User not found');

  Object.keys(updates).forEach(key => {
    user.history.push({ field: key, oldValue: user[key], newValue: updates[key] });
    user[key] = updates[key];
  });

  return user;
}

function getUser(name) {
  return users.find(user => user.name === name);
}

module.exports = { createUser, deleteUser, updateUser, getUser };
