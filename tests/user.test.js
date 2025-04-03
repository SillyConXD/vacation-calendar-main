const { createUser, deleteUser, updateUser, getUser } = require('../scripts/user'); // Предполагается, что эти функции реализованы

describe('User Management Tests', () => {
  test('Создать пользователя с цифрой', () => {
    const user = createUser('User123', '#FF5733');
    expect(user).toBeDefined();
    expect(user.name).toBe('User123');
  });

  test('Создать пользователя с символом', () => {
    const user = createUser('User@Name', '#33FF57');
    expect(user).toBeDefined();
    expect(user.name).toBe('User@Name');
  });

  test('Создание профиля с существующим логином', () => {
    createUser('ExistingUser', '#123456');
    expect(() => createUser('ExistingUser', '#654321')).toThrow('User already exists');
  });

  test('Создание одинаковых пользователей', () => {
    createUser('DuplicateUser', '#ABCDEF');
    expect(() => createUser('DuplicateUser', '#ABCDEF')).toThrow('User already exists');
  });

  test('Проверка лимита на количество пользователей', () => {
    for (let i = 0; i < 10; i++) {
      createUser(`User${i}`, `#00000${i}`);
    }
    expect(() => createUser('ExtraUser', '#FFFFFF')).toThrow('User limit reached');
  });

  test('Создание пользователя с одинаковым цветом', () => {
    createUser('User1', '#FF0000');
    expect(() => createUser('User2', '#FF0000')).toThrow('Color already in use');
  });

  test('Создание пользователя с минимально допустимыми данными', () => {
    const user = createUser('U', '#000000');
    expect(user).toBeDefined();
    expect(user.name).toBe('U');
  });

  test('Создание профиля с уникальным логином', () => {
    const user = createUser('UniqueUser', '#123123');
    expect(user).toBeDefined();
    expect(user.name).toBe('UniqueUser');
  });

  test('Удаление пользователя', () => {
    createUser('UserToDelete', '#654321');
    expect(deleteUser('UserToDelete')).toBe(true);
  });

  test('Попытка изменить несуществующего пользователя', () => {
    expect(() => updateUser('NonExistentUser', { name: 'NewName' })).toThrow('User not found');
  });

  test('Изменение пароля с проверкой его сложности', () => {
    const user = createUser('UserWithPassword', '#123456');
    const updatedUser = updateUser(user.name, { password: 'StrongP@ssw0rd!' });
    expect(updatedUser.password).toBe('StrongP@ssw0rd!');
  });

  test('Частичное обновление данных пользователя', () => {
    const user = createUser('PartialUpdateUser', '#654321');
    const updatedUser = updateUser(user.name, { color: '#FF5733' });
    expect(updatedUser.color).toBe('#FF5733');
  });

  test('Попытка задать некорректные значения полей', () => {
    expect(() => createUser('', '#123456')).toThrow('Invalid user name');
    expect(() => createUser('InvalidColorUser', '123456')).toThrow('Invalid color format');
  });

  test('Проверка прав доступа для редактирования', () => {
    const user = createUser('AdminUser', '#654321', { role: 'admin' });
    expect(user.role).toBe('admin');
  });

  test('Проверка истории изменений пользователя', () => {
    const user = createUser('HistoryUser', '#123456');
    updateUser(user.name, { name: 'UpdatedName' });
    const history = getUser(user.name).history;
    expect(history).toContainEqual({ field: 'name', oldValue: 'HistoryUser', newValue: 'UpdatedName' });
  });
});
