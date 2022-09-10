import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { firestore } from '../config/firebase';
import defaultLogo from '../assets/default-team-logo.png';
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../config/context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading';

function AccountSettings () {

    const history = useHistory();
    const { currentUser } = useAuth();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(currentUser === null) {
            history.replace('/login')
        } else {
            firestore.collection("users")
            .doc(currentUser.uid).get().then((doc) => {
                setUser(doc.data())
                setLoading(false)
            });
        }
    }, [])

  return (
    <>
        <Header />
        <div style={{backgroundColor:'#000',padding:'20px',display:'flex',justifyContent:'center'}}><h1 style={{color:'#fff',fontWeight:'800',margin:'0'}}>ACCOUNT SETTINGS</h1></div>
        <div>
            <Container>
            {loading === true ? <Loading /> : user && <div className='section'>
                <Row style={{display:'flex',alignItems:'center'}}>
                    <Col md="6" style={{display:'flex',justifyContent:'center'}}>
                        <Form style={{width:'500px', maxWidth:'100%', marginTop:'20px'}}>
                            <FormGroup>
                                <Label style={{width:'100%',textAlign:'left'}}>Full Name</Label>
                                <Input type="text" id="firstName" value={user.name} style={{height:'50px'}}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}></FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Username</Label>
                                <Input type="text" id="firstName" value={user.username} style={{height:'50px'}}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}></FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Phone Number</Label>
                                <Input type="text" id="firstName" style={{height:'50px'}}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}></FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Account Email</Label>
                                <Input type="text" id="firstName" value={user.email} style={{height:'50px'}} readOnly></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}></FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>PayPal Email</Label>
                                <Input type="text" id="firstName" style={{height:'50px'}}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}></FormFeedback>
                            </FormGroup>
                        </Form>
                    </Col>
                    <Col md="6" style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                        <Button style={{backgroundColor:'#121212',color:'#fff',padding:'10px 40px',marginTop:'20px',fontWeight:'800', width:'300px'}} size='lg'>CHANGE EMAIL</Button><br/>
                        <Button style={{backgroundColor:'#121212',color:'#fff',padding:'10px 40px',marginTop:'20px',fontWeight:'800', width:'300px'}} size='lg'>CHANGE PASSWORD</Button>
                    </Col>
                </Row>
                <center>
                    <Link to={'/teams/create'}>
                        <Button style={{backgroundColor:'#121212',color:'#fff',padding:'10px 40px',marginTop:'20px',fontWeight:'800'}} size='lg'>SAVE CHANGES</Button>
                    </Link>
                </center>
            </div>
            }
            </Container>
        </div>
        <Footer />
    </>
  );
}

export default AccountSettings;
