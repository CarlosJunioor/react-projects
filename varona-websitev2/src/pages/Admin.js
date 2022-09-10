import React, {useState, useEffect} from 'react';
import AdminHeader from '../components/AdminHeader';
import Footer from '../components/SmallFooter';
import { Container, Row, Col } from 'reactstrap';
import { firestore, auth } from '../config/firebase';
import { useHistory } from "react-router-dom";
import { useAuth } from "../config/context";

function Admin() {

    const history = useHistory();
    const { currentUser } = useAuth();

    useEffect(() => {
        if(currentUser) {
            auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                if (!!idTokenResult.claims.admin) {
                    console.log('Admin')
                } else {
                    console.log('Not Admin')
                    history.replace('/')
                }
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            history.replace('/')
        }
    },[])

  return (
    <>
        <AdminHeader />
        <div className='select-game'>
            <Container>
                <div className='section'>
                    <Row>
                        <h3 style={{fontWeight:'800'}}>Admin Panel</h3>
                    </Row>
                </div>
            </Container>
        </div>
        <Footer />
    </>
  );
}

export default Admin;
