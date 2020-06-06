// src/models/author.js
module.exports = (sequelize, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: [true],
          msg: 'Please give an Author',
        },
        notEmpty: {
          args: [true],
          msg: 'Author field can not be empty',
        },
      },
    },
  };

  return sequelize.define('Author', schema);
};
