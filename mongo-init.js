db.createUser({
  user: 'admin',
  pwd: 'password123',
  roles: [
    {
      role: 'readWrite',
      db: 'auto_salon'
    }
  ]
});

db.createCollection('users');
db.createCollection('cars');
db.createCollection('orders');

// Создаем индексы для ускорения поиска
db.cars.createIndex({ brand: 1, model: 1 });
db.cars.createIndex({ price: 1 });
db.cars.createIndex({ year: 1 });
db.cars.createIndex({ status: 1 });
db.cars.createIndex({ createdAt: -1 });

db.orders.createIndex({ user: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });

db.users.createIndex({ email: 1 }, { unique: true });

print('MongoDB initialization completed');