const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const dbPassword = process.env.MONGODB_PASSWORD;

const dbURI =
  `mongodb+srv://lsk02290331_db_user:${dbPassword}@cluster0.gec3sw7.mongodb.net/Loc8r`;

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close().then(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// nodemon restart
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// App termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// Render app termination
process.on('SIGTERM', () => {
  gracefulShutdown('app shutdown', () => {
    process.exit(0);
  });
});

// Location 스키마와 모델 등록
require('./locations');