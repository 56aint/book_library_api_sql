const {
  Author, Book, Reader, Genre,
} = require('../models');

const get404Error = (model) => ({ error: `The ${model} could not be found.` });

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    genre: Genre,
    author: Author,
  };
  return models[model];
};

const removePassword = (sentData) => {
  delete sentData.password;

  return sentData;
};

const chooseModelToInclude = (model) => {
  if (model === 'book') return { include: [{ model: Genre }, { model: Author }] };
  if (model === 'genre') return { include: Book };
  if (model === 'author') return { include: Book };

  return {};
};

const getAllItems = (res, model) => {
  const Model = getModel(model);

  Model.findAll({ ...chooseModelToInclude(model) }).then((items) => {
    const itemsWithNoPassword = items.map((item) => removePassword(item.dataValues));
    res.status(200).json(itemsWithNoPassword);
  });
};

const createItem = (res, model, item) => {
  const Model = getModel(model);

  Model.create(item)
    .then((newItemCreated) => {
      const itemPopPassword = newItemCreated;
      delete itemPopPassword.dataValues.password;
      res.status(201).json(newItemCreated);
    })
    .catch((error) => {
      const errorMessages = error.errors.map((e) => e.message);

      res.status(400).json({ errors: errorMessages });
    });
};

const updateItem = (res, model, item, id) => {
  const Model = getModel(model);

  return Model.update(item, { where: { id } }).then(([recordsUpdated]) => {
    if (!recordsUpdated) {
      res.status(404).json(get404Error(model));
    } else {
      Model.findByPk(id).then((updatedItem) => {
        delete updatedItem.dataValues.password;
        res.status(200).json(updatedItem);
      });
    }
  });
};

const getItemById = (res, model, id) => {
  const Model = getModel(model);

  return Model.findByPk(id, { ...chooseModelToInclude(model) }).then((item) => {
    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      delete item.dataValues.password;
      res.status(200).json(item);
    }
  });
};

const deleteItem = (res, model, id) => {
  const Model = getModel(model);

  return Model.findByPk(id).then((foundItem) => {
    if (!foundItem) {
      res.status(404).json(get404Error(model));
    } else {
      Model.destroy({ where: { id } }).then(() => {
        res.status(204).send();
      });
    }
  });
};

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
};
