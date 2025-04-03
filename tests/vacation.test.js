const { addVacation, deleteVacation, getVacations } = require('../scripts/vacation'); // Предполагается, что эти функции реализованы

describe('Vacation Management Tests', () => {
  test('Удаление существующего отпуска', () => {
    addVacation('User1', '2023-01-01', '2023-01-10');
    expect(deleteVacation('User1', '2023-01-01')).toBe(true);
  });

  test('Создание максимального отпуска', () => {
    const vacation = addVacation('User1', '2023-01-01', '2023-12-31');
    expect(vacation).toBeDefined();
  });

  test('Создание минимального отпуска', () => {
    const vacation = addVacation('User1', '2023-01-01', '2023-01-01');
    expect(vacation).toBeDefined();
  });

  test('Попытка удалить несуществующий отпуск', () => {
    expect(() => deleteVacation('User1', '2023-02-01')).toThrow('Vacation not found');
  });

  test('Проверка отпуска с корректными датами', () => {
    const vacation = addVacation('User1', '2023-03-01', '2023-03-10');
    expect(vacation.startDate).toBe('2023-03-01');
    expect(vacation.endDate).toBe('2023-03-10');
  });

  test('Проверка отображения одиночного отпуска', () => {
    addVacation('User1', '2023-04-01', '2023-04-10');
    const vacations = getVacations('User1');
    expect(vacations).toHaveLength(1);
  });

  test('Отображение нескольких пересекающихся отпусков', () => {
    addVacation('User1', '2023-05-01', '2023-05-10');
    addVacation('User1', '2023-05-05', '2023-05-15');
    const vacations = getVacations('User1');
    expect(vacations).toHaveLength(2);
  });

  test('Проверка отображения отпусков разных пользователей', () => {
    addVacation('User1', '2023-06-01', '2023-06-10');
    addVacation('User2', '2023-06-01', '2023-06-10');
    const user1Vacations = getVacations('User1');
    const user2Vacations = getVacations('User2');
    expect(user1Vacations).toHaveLength(1);
    expect(user2Vacations).toHaveLength(1);
  });
});
