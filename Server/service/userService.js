const UserModel = require("../model/userModel");

class UserService {
  static async isUserExist(userId) {
    const user = await UserModel.findOne({ _id: userId });
    if (user) return true;
    return false;
  }
  static async findUser(userId) {
    return await UserModel.findOne({ _id: userId });
  }
}

module.exports = UserService;
