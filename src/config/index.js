const config = {
  development: {
    username: "root",
    password: "Nguyenvansang1997!@",
    database: "database_movie",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  AUTH: {
    SECRET_KEY: "nodejs-20",
  },
  SYSTEM: {
    PORT: 3000,
    HOST: "",
    DOMAIN: "http://localhost",
  },
};

module.exports = config;
