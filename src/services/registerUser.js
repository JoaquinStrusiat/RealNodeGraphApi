const hashPasword = require('../utils/hashString.js');

const registerUser = async (req, res) => {
  const { path, method, body } = req;
  const { name, last_name, password1, password2, email, owner } = body;
  
  const response = { path, method };

  // Validate required fields
  const requiredFields = {
    name: "The name is required",
    last_name: "The last_name is required",
    email: "The email is required",
    password1: "The first password is required",
    password2: "The second password is required"
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!body[field]) {
      response.err = message;
      return res.status(400).json(response);
    }
  }

  if (password1 !== password2) {
    response.err = "The passwords are not the same";
    return res.status(400).json(response);
  }

  if (password1.length < 6) {
    response.err = "The password must be longer than 6 characters";
    return res.status(400).json(response);
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response.err = "The email is not valid";
    return res.status(400).json(response);
  }

  try {
    const hashedPassword = await hashPasword(password1);
    
    response.item = {
      name,
      last_name,
      email,
      owner,
      password: hashedPassword
    };
    
    return res.status(201).json(response);
  } catch (error) {
    response.error = "Error processing registration";
    return res.status(500).json(response);
  }
};


module.exports = registerUser;