module.exports = (sequelize, Sequelize) => {
    const Ebook = sequelize.define("ebook", {
      name: {
        type: Sequelize.STRING
      },
      purchased: {
        type: Sequelize.STRING
      }
    });
  
    return Ebook;
  };
  