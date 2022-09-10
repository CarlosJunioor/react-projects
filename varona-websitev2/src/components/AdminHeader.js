import React, { useState } from 'react';
import logo from '../assets/banner-logo.jpg';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import {
  Link, useHistory
} from "react-router-dom";
import { firestore } from '../config/firebase';
import { useAuth } from "../config/context"

const AdminHeader = (props) => {

  const history = useHistory()

  const { currentUser, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout()
    .then(() => {
      history.replace('/login')
    })
  }

  return (
    <>
      <Navbar color="light" light expand="md">
        <Link to="/admin">
          <NavbarBrand><img src={logo} width='50' /></NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          </Nav>
            
            <Link to={'/admin/series'}>
              <NavbarText style={{padding:'8px',fontWeight:'500',color:'#000',display:'block',textAlign:'center',cursor:'pointer'}}>SERIES</NavbarText>
            </Link>
            <Link to={'/admin/events'}>
              <NavbarText style={{padding:'8px',fontWeight:'500',color:'#000',display:'block',textAlign:'center',cursor:'pointer'}}>EVENTS</NavbarText>
            </Link>
            <Link to={'/'}>
              <NavbarText style={{padding:'8px',fontWeight:'500',color:'#000',display:'block',textAlign:'center',cursor:'pointer'}}>USERS</NavbarText>
            </Link>
            <Link to={'/'}>
              <NavbarText style={{padding:'8px',fontWeight:'500',color:'#000',display:'block',textAlign:'center',cursor:'pointer'}}>{'< BACK TO MAIN SITE'}</NavbarText>
            </Link>
        </Collapse>
      </Navbar>
    </>
  );
}

export default AdminHeader;