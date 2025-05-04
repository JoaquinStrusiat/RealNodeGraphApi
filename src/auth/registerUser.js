const UserModel = require('../api/models/UserModel');
const hashPassword = require('../utils/hashString');

const registerUser = async (req, res) => {
  const { path, method, body } = req;
  const { name, last_name, email, password1, password2, image, birthdate, phone, status } = body;
  const response = { path, method };

  try {
    if(!password1 || !password2) throw new Error('The values of password1 and password2 are required');
    if (password1 !== password2) throw new Error('Passwords do not match');

    if (password1.length < 6) throw new Error('Password must be longer than 6 characters');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address');

    const hashedPassword = await hashPassword(password1);

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      last_name,
      image,
      birthdate,
      phone,
      status
    });

    response.ok = { message: 'The user was created successfully' };
    return res.status(201).json(response);
  } catch (error) {
    response.error = { message: error.message };
    return res.status(400).json(response);
  }
};

module.exports = registerUser;