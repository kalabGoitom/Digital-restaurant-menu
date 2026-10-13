import { useState } from "react";
import { signupPlatformAdmin } from "../services/authApi.js";

function PlatformSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    setupSecret: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await signupPlatformAdmin(formData);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <main>
      <h1>Create Platform Admin Account</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="setupSecret">Setup secret</label>
        <input
          id="setupSecret"
          name="setupSecret"
          type="password"
          value={formData.setupSecret}
          onChange={handleChange}
          required
        />

        <button type="submit">Create account</button>
      </form>
    </main>
  );
}

export default PlatformSignup;
