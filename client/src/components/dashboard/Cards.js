import React from 'react';

function Cards() {
  return (
    <div className="dashboard-cards">
      <div className="card">
        <div className="card-inner">
          <h3>Total Users</h3>
          <span className="material-icons">person</span>
        </div>
        <h1>1,500</h1>
        <p>+15% from last week</p>
      </div>
      <div className="card">
        <div className="card-inner">
          <h3>Total Revenue</h3>
          <span className="material-icons">monetization_on</span>
        </div>
        <h1>$25,000</h1>
        <p>+20% from last month</p>
      </div>
      <div className="card">
        <div className="card-inner">
          <h3>Total Orders</h3>
          <span className="material-icons">shopping_cart</span>
        </div>
        <h1>750</h1>
        <p>+12% from last week</p>
      </div>
      <div className="card">
        <div className="card-inner">
          <h3>Visitors</h3>
          <span className="material-icons">visibility</span>
        </div>
        <h1>10,500</h1>
        <p>+18% from last month</p>
      </div>
    </div>
  );
}

export default Cards;