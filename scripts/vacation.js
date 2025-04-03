const vacations = {};

function addVacation(user, startDate, endDate) {
  if (!vacations[user]) vacations[user] = [];
  const vacation = { startDate, endDate };
  vacations[user].push(vacation);
  return vacation;
}

function deleteVacation(user, startDate) {
  if (!vacations[user]) throw new Error('User not found');
  const index = vacations[user].findIndex(vac => vac.startDate === startDate);
  if (index === -1) throw new Error('Vacation not found');
  vacations[user].splice(index, 1);
  return true;
}

function getVacations(user) {
  return vacations[user] || [];
}

module.exports = { addVacation, deleteVacation, getVacations };
