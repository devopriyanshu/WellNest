import bcrypt from "bcryptjs";

export const hashpassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparepassword = async (password, hashedpassword) => {
  return await bcrypt.compare(password, hashedpassword);
};
