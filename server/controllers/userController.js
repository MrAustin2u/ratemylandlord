const db = require('../models/model.js');
const bcrypt = require('bcryptjs');

const userController = {};

userController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  const userQuery = {
    text: '',
    values: ''
  };
  db.query();
};

userController.createUser = (req, res, next) => {
  const SALT_ROUNDS = 10;
  //deconstruct username and password from request body
  let { username, password } = req.body;

  //if user input field for username and password
  if (
    req.body.username !== null &&
    typeof req.body.username === 'string' &&
    req.body.password !== null &&
    typeof req.body.password === 'string'
  ) {
    //hash user inputted password
    bcrypt
      .hash(password, SALT_ROUNDS)
      .then((err, result) => {
        password = result;
      })
      .catch((err) => {
        return next(err);
      });
    const userQuery = {
      text: `INSERT INTO "user" 
      (username, password)
      VALUES
      ($1, $2)`,
      values: [username, password]
    };
    db.query(userQuery)
      .then((user) => {
        /*this console is only for debugging*/
        console.log(user);
        return next();
      })
      .catch((err) => {
        return next(`Error logging in: ${err}`);
      });
  } else {
    return `Error in inside createUser middleware`;
  }
};

userController.createLandLord = (req, res, next) => {
  const { name, address } = req.body;
  if (
    (req.body.name !== null && typeof req.body.name === 'string') ||
    (req.body.address !== null && typeof req.body.address === 'string')
  ) {
    const userQuery = {
      text: `
    INSERT INTO "property"
    (name, address)
    VALUES
    ($1, $2)
    `,
      values: [name, address]
    };
    db.query(userQuery)
      .then((landLord) => {
        res.locals.name = landLord.name;
        res.locals.address = landLord.address;
        return next();
      })
      .catch((err) => {
        return next(`Error inside createLandLord: ${err}`);
      });
  }
};
module.exports = userController;