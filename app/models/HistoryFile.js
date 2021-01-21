module.exports = (sequelize, Sequelize) => {
    const Historyfile = sequelize.define("historyfile", {
      name: {
        type: Sequelize.STRING
      },
      ip: {
        type: Sequelize.STRING
      },
      date:{
        type: Sequelize.STRING,
      }
    });
  
    return Historyfile;
  };
  