import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await axios.post(`/api/auth/register`, formData);
            const token = response.data.token;

            sessionStorage.setItem('token', token);

            setMessage('Registration successful!');
            setFormData({
                username: '',
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
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

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

                <button type='submit'>Register</button>
            </form>
            <div>
                <p>
                    Already have an account? <Link to='/login'>Login</Link>
                </p>
            </div>
            <p>{message}</p>
        </div>
    );
};
