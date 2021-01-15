module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("account", {
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    firstname:{
      type: Sequelize.STRING,
    },
    lastname:{
      type: Sequelize.STRING,
      
    },
    
  }
  );

  return Account;
};
