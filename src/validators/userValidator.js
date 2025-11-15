// src/validators/userValidator.js
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


// src/routes/userRoutes.js
// by using this our controllers will be cleaner and focused on business logic

import express from 'express';
import { registerSchema } from '../validators/userValidator.js';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  // req.body is valid, pass it to controller
  registerUser(req, res, next);
});

export default router;


// src/controllers/userController.js
//like this our controllers will be cleaner and focused on business logic\

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Your normal user creation logic here
  res.status(201).json({ message: "User registered successfully" });
};


//Frontend can also use the same zod schema for client-side validation
//like this we ensure consistency between client and server validation

import { registerSchema } from '../shared/userSchema';

const formData = {
  name: 'Alice',
  email: 'alice@example.com',
  password: '123456',
};

const result = registerSchema.safeParse(formData);

if (!result.success) {
  console.log(result.error.errors); // array of errors
} else {
  console.log('Valid data', result.data);
  // You can now send result.data to backend
}
// This approach reduces code duplication and keeps validation logic centralized.
// Tests can also import the same schema to validate test inputs

//like here is how you will do this in frontend 
import { useState } from 'react';
import { registerSchema } from '../shared/userSchema';

function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setErrors([]);
      fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form inputs */}
      {errors.map((err, i) => <p key={i}>{err.message}</p>)}
      <button type="submit">Register</button>
    </form>
  );
}
// This keeps client-side validation consistent with server-side validation
// and reduces duplication of validation logic.