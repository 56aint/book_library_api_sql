module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING({ length: 50 }),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING({ length: 50 }),
      allowNull: false,
    },
    genre: DataTypes.STRING,
    ISBN: DataTypes.STRING,
  };

  return sequelize.define('Book', schema);
};
