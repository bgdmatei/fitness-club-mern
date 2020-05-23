const User = require("../models/User");

module.exports = {
  async store(req, res) {
    try {
      const { firstName, lastName, password, email } = req.body;
      const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email,
      });
      return res.json(user);
    } catch (error) {
      throw Error(`Error while registering new user: ${error}`);
    }
  },
};
