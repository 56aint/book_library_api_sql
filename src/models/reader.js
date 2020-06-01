module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: [['example@someplace.somewhere']],
          msg: 'Please check your email format and try again.',
        },
      },
    },
    name: {
      type: DataTypes.STRING({ length: 50 }),
      allowNull: false,
      validate: {
        notEmpty: {
          args: [[true]],
          msg: 'Please enter your name',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        passwordLength(value) {
          if (value.length < 8) {
            throw new Error('Your password should not be less than 8 characters');
          }
        },
      // len: [8, 30],
      },

    },
  };

  return sequelize.define('Reader', schema);
};
