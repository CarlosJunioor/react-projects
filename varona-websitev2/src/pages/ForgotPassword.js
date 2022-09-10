import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import { Container, Form, FormFeedback, FormGroup, Input, Button, Label } from 'reactstrap';
import { auth } from '../config/firebase';
import banner from '../assets/omnia_full_dark.png';
import { useAuth } from "../config/context"
import { Link, useHistory } from "react-router-dom"

function ForgotPassword () {
    const history = useHistory()
    const [loginCredentials, setLoginCredentials] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth()
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const {id, value} = e.target;
        setLoginCredentials(prevState => ({
            ...prevState,
            [id]: value
        }));

        if(id === 'email') {
            setEmailError('')
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

        if(validation === 1) {
            auth.sendPasswordResetEmail(loginCredentials.email).then(() => {
                setMessage('success')
            })
            .catch((error) => {
                console.log(error)
                setMessage('fail')
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
                        {message === 'success'? <div style={{display:'block',backgroundColor:'mediumspringgreen',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Success!</strong> You should receive an email soon to reset your password! <Link style={{textDecoration:'underline', color:'#000'}} to={"/"}><u>Back Home</u></Link></p></div> : message === 'fail' ? <div style={{display:'block',backgroundColor:'indianred',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Uh oh!</strong> Looks like you have some errors to fix!</p></div> : null}

                        <img src={banner} style={{maxWidth:'100%'}} />
                        <br/>
                        <br/>
                        <p>Enter the email address associated with your Omnia account to reset your password.</p>
                        <Form style={{width:'500px', maxWidth:'100%', marginTop:'20px'}} onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label style={{width:'100%',textAlign:'left'}}>Email Address</Label>
                                <Input type="email" id="email" onChange={handleChange} style={{height:'50px'}} invalid={emailError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{emailError}</FormFeedback>
                            </FormGroup>
                            <Button style={{marginTop:'20px',width:'100%',backgroundColor:'#242425',height:'50px'}}>Reset Password</Button>
                        </Form>
                        <p style={{marginTop:'20px'}}><Link to='/login' style={{color:'#000'}}>Back To Login</Link></p>
                        </center>
                    </div>
                </Container>
            </div>
    </>
  );
}

export default ForgotPassword;
