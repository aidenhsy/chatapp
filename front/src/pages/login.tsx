import React, { useState } from 'react';
import axios from 'axios';
import { setCookie } from 'cookies-next';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async () => {
    try {
      const { data } = await axios.post('http://localhost:6001/login', {
        username,
        password,
      });
      setCookie('token', `Bearer ${data}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-[100vh] bg-blue-300 grid place-content-center space-y-5">
      <input
        placeholder="username"
        className="border px-3 "
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="password"
        className="border px-3 "
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-white" onClick={loginHandler}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
