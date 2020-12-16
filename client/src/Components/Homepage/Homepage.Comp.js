import React from 'react'
import './Homepage.Comp.css'
import { Link } from 'react-router-dom';

function Homepage() {
    return (
        <div className="Homepage">
        <nav>
          <h1>LOGO</h1>
          <a className="nav__link" href="#home">Home</a>
          <a className="nav__link" href="#product">Product</a>
          <div className="nav__button">
            <Link className="btn btn_primary" to="/login">Login</Link>
            <Link className="btn btn_primary" to="/register">Get started</Link>
          </div>          
        </nav>
        <div className="landingPage" id="home">
          <div className="landingPage__content">
            <h1>Easy &amp; lightweight <br /> Project Manager</h1>
            <span>Maximize your workflow today with NAME. Name is a free, easy and lightweight open source project management system</span>
          </div>
        </div>
        <div className="product">
          <div className="product__container">
            <img className="product__image" src={require('./images/productImage.png')} alt="" />
            <div className="product__content" id="product">
              <img src={require('./images/graph.png')} alt="" />
              <h1>Streamline your <br/> workflow get results</h1>
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</span>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Homepage
