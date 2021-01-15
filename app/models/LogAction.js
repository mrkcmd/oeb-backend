module.exports = (sequelize, Sequelize) => {
    const LogAction = sequelize.define("logs", {
      msg: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      }
      
    }
    );
  
    return LogAction;
  };
