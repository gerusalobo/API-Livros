const basicAuth = require('basic-auth');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name || !credentials.pass) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Access denied');
  }

  try {
    const user = await User.findOne({ username: credentials.name, password: credentials.pass });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = authenticate;
