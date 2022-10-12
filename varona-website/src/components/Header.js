import React, { useState, useEffect } from 'react';
import logo from '../assets/banner-logo.jpg';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncrontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';
import {
    Link,
} from "react-router-dom";

const Header = () => {

    const useHistory = useHistory()
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
        <Navbar color="light" light expand ="md">
            <Link to="/">
                <NavbarBrand><img src={logo} width='50' /></NavbarBrand>
            </Link>
            <NavbarToggler onClick={toggle} />

        </Navbar>
        
        </>
    )
}