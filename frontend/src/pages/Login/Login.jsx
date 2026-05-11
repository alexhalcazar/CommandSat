import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(`/api/auth/login`, formData);
            const token = response.token;

            sessionStorage.setItem('token', token);

            setMessage('Login successful!');
            setFormData({
                email: '',
                password: '',
            });
            navigate('/dashboard');
        } catch (err) {
            setMessage('Unable to connect to server');
            console.error(err);
            throw err;
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type='submit'>Login</button>
            </form>

            <div>
                <p>
                    Don't have an account? <Link to='/register'>Register</Link>
                </p>
            </div>
            <p>{message}</p>
        </div>
    );
};
