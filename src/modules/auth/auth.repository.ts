import User, { UserDocument } from "../../models/user.model";

async function createUser(data: UserDocument) {
  return await User.create(data);
}

async function updateUserById(id: string, data: Partial<UserDocument>) {
  return await User.findByIdAndUpdate(id, data);
}

async function findUserById(id: string) {
  return await User.findById(id);
}

async function findUserByEmail(email: string) {
  return await User.findOne({ email });
}

export default { updateUserById, findUserByEmail, findUserById, createUser };
