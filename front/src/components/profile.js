// src/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/profile.css';

const apiUrl = process.env.REACT_APP_BACKEND_BASE_URL

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [notification, setNotification] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setFormData({
        username: userData.user_id.username || '',
        email: userData.user_id.email || '',
        full_name: userData.full_name || '',
        bio: userData.bio || ''
      });
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}profile/${JSON.parse(localStorage.getItem('user')).user_id.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setNotification("Update successful")
        // alert('Profile updated successfully');
        navigate('/profile');
      } else {
        setError(data.message || 'Something went wrong, please try again.');
      }
    } catch (err) {
      setError('Network error, please try again.');
    }
    finally{
      setTimeout(()=>{
        setNotification("")
      },5000)
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h1 className="cardheader">Profile</h1>

      <form onSubmit={handleUpdateProfile} className="profile-form">
        {notification && <p className="notif">{notification}</p>}
        <div className="form-group">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.username}
            onChange={handleChange}
            required
            readOnly={true}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            readOnly={true}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Full Name:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea  id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}>

          </textarea>
          {/*<input*/}
          {/*  type="text"*/}
          {/*  id="bio"*/}
          {/*  name="bio"*/}
          {/*  value={formData.bio}*/}
          {/*  onChange={handleChange}*/}
          {/*/>*/}
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Profile;
