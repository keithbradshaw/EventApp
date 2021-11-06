import React from 'react'
import { NavLink } from 'react-router-dom'


const mainNavigation = (props) => {
    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item" >
                            <NavLink className="nav-link" to="/user">Authenticate</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/events">Events</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/bookings">Bookings</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>



    )
}

export default mainNavigation;

