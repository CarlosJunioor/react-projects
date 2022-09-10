import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import { Container, Form, FormFeedback, FormGroup, Input, Button, Label } from 'reactstrap';
import { auth } from '../config/firebase';
import banner from '../assets/banner-logo.jpg';
import { useAuth } from "../config/context"
import { Link, useHistory } from "react-router-dom"

function Login() {
    const history = useHistory()
    const [loginCredentials, setLoginCredentials] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth()
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const {id, value} = e.target;
        setLoginCredentials(prevState => ({
            ...prevState,
            [id]: value
        }));

        if(id === 'email') {
            setEmailError('')
        }

        if(id === 'password') {
            setPasswordError('')
        }

    }

    const handleSubmit = e => {
        e.preventDefault();

        var validation = 0;

        if(loginCredentials.email === "") {
            setEmailError('Email cannot be blank!')
        } else {
            validation++
        }

        if(loginCredentials.password === "") {
            setPasswordError('Password cannot be blank!')
        } else {
            validation++
        }

        if(validation === 2) {
            auth.signInWithEmailAndPassword(loginCredentials.email, loginCredentials.password).then(() => {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const product = urlParams.get('redirect')
                if(product !== null) {
                    history.replace(product)
                } else {
                    history.replace('/')
                }
                
            })
            .catch((error) => {
                console.log(error)
                if(error.code === 'auth/wrong-password') {
                    setPasswordError('That password is incorrect. Try again.')
                }
                if(error.code === 'auth/user-not-found') {
                    setEmailError('A user with that email does not exist.')
                    setPasswordError('')
                }
            })
        }
    }
  return (
    <>
        <Header />
            <div className='select-game' style={{minHeight:'100vh'}}>
                <Container>
                    <div style={{padding:'5% 0px'}}>
                        <center>
                        <img src={banner} style={{maxWidth:'100%'}} />
                        <Form style={{width:'500px', maxWidth:'100%', marginTop:'20px'}} onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label style={{width:'100%',textAlign:'left'}}>Email Address</Label>
                                <Input type="email" id="email" onChange={handleChange} style={{height:'50px'}} invalid={emailError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{emailError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Password</Label>
                                <Input type="password" id="password" onChange={handleChange} style={{height:'50px'}} invalid={passwordError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{passwordError}</FormFeedback>
                            </FormGroup>
                            <Button style={{marginTop:'20px',width:'100%',backgroundColor:'#242425',height:'50px'}}>Login</Button>
                        </Form>
                        <p style={{marginTop:'20px'}}><Link to='/forgot-password' style={{color:'#000'}}>Forgot your password?</Link></p>
                        <p style={{marginTop:'20px'}}>Don't have an account? <Link to='/signup' style={{color:'#000'}}>Create One</Link></p>
                        </center>
                    </div>
                </Container>
            </div>
    </>
  );
}

export default Login;
