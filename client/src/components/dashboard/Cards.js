import React from 'react';
import { FaUser, FaMoneyBillWave, FaShoppingCart, FaEye, FaArrowUp } from 'react-icons/fa';

function Cards() {
  return (
    <div className="dashboard-cards">
      <div className="card">
        <div className="card-inner">
          <h3>Total Users</h3>
          <div className="icon-container">
            <FaUser className="card-icon" />
          </div>
        </div>
        <h1>1,500</h1>
        <p><FaArrowUp className="notification-icon" /> 15% from last week</p>
      </div>
      <div className="card">
        <div className="card-inner">
          <h3>Total Revenue</h3>
          <div className="icon-container">
            <FaMoneyBillWave className="card-icon" />
          </div>
        </div>
        <h1>$25,000</h1>
        <p><FaArrowUp className="notification-icon" /> 20% from last month</p>
      </div>
      <div className="card">
        <div className="card-inner">
          <h3>Total Orders</h3>
          <div className="icon-container">
            <FaShoppingCart className="card-icon" />
          </div>
        </div>
        <h1>750</h1>
        <p><FaArrowUp className="notification-icon" /> 12% from last week</p>
      </div>
      <div className="card">
        <div className="card-inner">
          <h3>Visitors</h3>
          <div className="icon-container">
            <FaEye className="card-icon" />
          </div>
        </div>
        <h1>10,500</h1>
        <p><FaArrowUp className="notification-icon" /> 18% from last month</p>
      </div>
    </div>
  );
}

export default Cards;