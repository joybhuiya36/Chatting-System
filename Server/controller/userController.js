const userModel = require("../model/userModel");
const { failure, success } = require("../utils/responeMessage");

class User {
  async getAllUser(req, res) {
    try {
      const allUser = await userModel.find({});
      if (allUser.length > 0) {
        return res
          .status(200)
          .send(success("All User Data is Fetched!", allUser));
      } else {
        return res.status(404).send(success("No User Data is Found!"));
      }
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
  async getSelectedUser(req, res) {
    try {
      const { user } = req.params;
      const filter = {
        $or: [{ name: { $regex: user, $options: "i" } }, { email: user }],
      };
      const users = await userModel.find(filter);
      if (users.length > 0) {
        return res
          .status(200)
          .send(success("All Selected Users Data is Fetched!", users));
      } else {
        return res.status(200).send(success("No User Data is Found!"));
      }
    } catch (err) {
      return res.status(500).send(failure("Internal Server Error!"));
    }
  }
}

module.exports = new User();
