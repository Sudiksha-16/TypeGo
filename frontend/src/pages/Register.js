import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../styles/Register.css"; // Import the external CSS file

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await register(username, password);
    if (success) {
      navigate('/test');
    } else {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input 
          type="text" 
          placeholder="Username" 
          className="register-input"
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="register-input"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button className="register-button">Register</button>
      </form>
      {error && <p className="register-error">{error}</p>}
    </div>
  );
};

export default Register;
