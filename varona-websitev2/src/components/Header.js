import React, { useState, useEffect } from 'react';
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
import { firestore, auth } from '../config/firebase';
import { useAuth } from "../config/context"

const Header = () => {

  const history = useHistory()
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout()
    .then(() => {
      history.replace('/login')
    })
  }

  const handleProfile = () => {
    firestore.collection('player_accounts').doc(currentUser.uid).get()
    .then((docSnapshot) => {
      if(docSnapshot.exists) {
        history.replace('/profile/' + currentUser.displayName)
      } else {
        history.replace('/create-profile')
      }
    })
  }

  useEffect( async () => {
    if(currentUser) {
      await auth.currentUser.getIdTokenResult()
      .then((idTokenResult) => {
          if (!!idTokenResult.claims.admin) {
            setIsAdmin(true)
          }
        })
      }
  },[])

  return (
    <>
      <Navbar color="light" light expand="md">
        <Link to="/">
          <NavbarBrand><img src={logo} width='50' /></NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          </Nav>
            <UncontrolledDropdown style={{display:"block",textAlign:'center'}}>
              <DropdownToggle nav caret style={{padding:'8px'}}>
                <div style={{display:'inline-block',alignItems:'center'}}>
                  <h6 style={{display:'inline', color:'#000'}}>Varona NFT'S</h6>
                </div>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Varona MEDALS
                </DropdownItem>
                <DropdownItem>
                  PLAYER CARDS
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavbarText style={{padding:'8px',fontWeight:'500',color:'#000',display:'block',textAlign:'center',cursor:'pointer'}}>ABOUT</NavbarText>
            {currentUser !== null ? 
            <UncontrolledDropdown style={{display:"block",textAlign:'center'}}>
            <DropdownToggle nav caret style={{padding:'8px'}}>
              <div style={{display:'inline-block',alignItems:'center'}}>
                <h6 style={{display:'inline', color:'#000'}}>{currentUser.displayName !== null ? currentUser.displayName.toUpperCase() : localStorage.getItem('userName')}</h6>
              </div>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={handleProfile}>
                ATHLETE PROFILE
              </DropdownItem>
              <Link to={'/teams'}>
                <DropdownItem>
                  TEAMS
                </DropdownItem>
              </Link>
              <Link to={'/account-settings'}>
                <DropdownItem>
                  ACCOUNT SETTINGS
                </DropdownItem>
              </Link>
              {isAdmin === true && 
              <Link to={'/admin'}>
                <DropdownItem>
                  ADMIN
                </DropdownItem>
              </Link>}
              <DropdownItem onClick={handleLogout}>
                LOGOUT
              </DropdownItem>
            </DropdownMenu>
            </UncontrolledDropdown>
            : <Link to="/login">
              <NavbarText style={{padding:'8px',fontWeight:'500',color:'#000',display:'block',textAlign:'center',cursor:'pointer'}}>LOGIN</NavbarText>
            </Link> }            
        </Collapse>

        <Link to="/events/test">
        <NavbarText style={{padding:'8px',fontWeight:'500',color:'#000',display:'block',textAlign:'center',cursor:'pointer'}}>CONTACT</NavbarText>
        </Link>

      </Navbar>
    </>
  );
}

export default Header;