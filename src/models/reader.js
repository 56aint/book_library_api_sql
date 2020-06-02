module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: [['example@someplace.somewhere']],
          msg: 'Please check your email format and try again.',
        },

        notNull: {
          args: [true],
          msg: 'Email field cannot be empty.',
        },
      },
    },
    name: {
      type: DataTypes.STRING({ length: 50 }),
      allowNull: false,
      validate: {
        nameIsNull(value) {
          if (!Boolean(value)) {
            throw new Error('Please enter your name');
          }
        },
        notNull: {
          args: [true],
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
        notNull: {
          args: [true],
          msg: 'Please enter your password',
        },
      },
    },
  };

  return sequelize.define('Reader', schema);
};
