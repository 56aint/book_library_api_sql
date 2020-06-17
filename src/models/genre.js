// src/models/genre.js
module.exports = (sequelize, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: [true],
          msg: 'Please provide a genre',
        },
        notEmpty: {
          args: [true],
          msg: 'Genre field can not be empty',
        },
      },
    },
  };

  return sequelize.define('Genre', schema);
};
