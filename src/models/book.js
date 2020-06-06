module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING({ length: 50 }),
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Please provide a good title for your book',
        },
        notNull: {
          args: [true],
          msg: 'Please give your book a title',
        },
      },
    },
    author: {
      type: DataTypes.STRING({ length: 50 }),
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Author field can not be empty',
        },
        notNull: {
          args: [true],
          msg: 'Please give an Author',
        },
      },
    },
    // genre: DataTypes.STRING,
    ISBN: DataTypes.STRING,
  };

  return sequelize.define('Book', schema);
};
