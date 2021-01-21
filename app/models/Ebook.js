module.exports = (sequelize, Sequelize) => {
    const Ebook = sequelize.define("ebook", {
      name: {
        type: Sequelize.STRING
      },
      purchased: {
        type: Sequelize.DATE
      }
    });
  
    return Ebook;
  };
  