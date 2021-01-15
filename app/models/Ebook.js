module.exports = (sequelize, Sequelize) => {
    const Ebook = sequelize.define("ebook", {
      name: {
        type: Sequelize.STRING
      },
      ip: {
        type: Sequelize.STRING
      },
      downlond:{
        type: Sequelize.DATE,
      }
    });
  
    return Ebook;
  };
  