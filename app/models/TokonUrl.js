module.exports = (sequelize, Sequelize) => {
    const TokenUrl = sequelize.define("tokenurl", {
      token: {
        type: Sequelize.STRING
      },
    });
  
    return TokenUrl;
  };
  