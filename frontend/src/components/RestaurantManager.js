import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cuisine: '',
    hours: '',
    rating: '',
    tableNumber: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      console.log('Fetching all restaurants...');
      const response = await api.get('api/restaurants/');
      console.log('Fetched Restaurants:', response.data);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error.response || error.message);
      setMessage('Error fetching restaurants');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting restaurant:', formData);
    try {
      if (editingRestaurant) {
        await api.put(`api/restaurants/${editingRestaurant.restaurantid}`, formData);
        setMessage('Restaurant updated successfully');
      } else {
        console.log('Adding new restaurant with data:', formData);
        await api.post('api/restaurants/add', formData);
        setMessage('Restaurant added successfully');
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (error) {
      console.error('Error submitting restaurant:', error.response || error.message);
      setMessage('Error adding/updating restaurant');
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting restaurant with ID:', id);
      await api.delete(`api/restaurants/${id}`);
      setMessage('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error.response || error.message);
      setMessage('Error deleting restaurant');
    }
  };

  const handleEdit = (restaurant) => {
    console.log('Editing restaurant:', restaurant);
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phonenumber,
      email: restaurant.email,
      cuisine: restaurant.cuisine,
      hours: restaurant.operatinghours,
      rating: restaurant.averagerating,
      tableNumber: restaurant.tablenumber,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    console.log('Adding a new restaurant...');
    setEditingRestaurant(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      cuisine: '',
      hours: '',
      rating: '',
      tableNumber: '',
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Restaurant Manager</h2>
      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      <Button variant="primary" className="mb-3" onClick={handleAdd}>Add Restaurant</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Cuisine</th>
            <th>Hours</th>
            <th>Rating</th>
            <th>Table Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <tr key={restaurant.restaurantid}>
                <td>{restaurant.name}</td>
                <td>{restaurant.address}</td>
                <td>{restaurant.phonenumber}</td>
                <td>{restaurant.email}</td>
                <td>{restaurant.cuisine}</td>
                <td>{restaurant.operatinghours}</td>
                <td>{restaurant.averagerating}</td>
                <td>{restaurant.tablenumber}</td>
                <td>
                    <Button
                    variant="info"
                    className="me-2"
                    onClick={() => navigate(`/reservations/${restaurant.restaurantid}`)}>Make a Reservation</Button>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(restaurant)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(restaurant.restaurantid)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No restaurants available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cuisine</Form.Label>
              <Form.Control
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Operating Hours</Form.Label>
              <Form.Control
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="text"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="text"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {editingRestaurant ? 'Update Restaurant' : 'Add Restaurant'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RestaurantManager;