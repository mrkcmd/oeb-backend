module.exports = (sequelize, Sequelize) => {
    const LogDownload = sequelize.define("logdownload", {
      ebook: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      ip: {
          type: Sequelize.STRING
      },

    }
    );
    return LogDownload;
  };
