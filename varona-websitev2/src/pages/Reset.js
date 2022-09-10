import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import { Container, Form, FormFeedback, FormGroup, Input, Button, Label } from 'reactstrap';
import { auth } from '../config/firebase';
import banner from '../assets/omnia_full_dark.png';
import { useAuth } from "../config/context"
import { Link, useHistory } from "react-router-dom"

function ResetPassword () {
    const history = useHistory()
    const [loginCredentials, setLoginCredentials] = useState({});
    const { login } = useAuth()
    const [passwordError, setPasswordError] = useState('');
    const [code, setCode] = useState('')
    const [message, setMessage] = useState('');
    const [valid, setValid] = useState(false);

    const handleChange = (e) => {
        const {id, value} = e.target;
        setLoginCredentials(prevState => ({
            ...prevState,
            [id]: value
        }));

        setPasswordError('')

    }

    const handleSubmit = e => {
        e.preventDefault();

        var validation = 0;

        if(loginCredentials.password === "" || loginCredentials.password === undefined ) {
            setPasswordError('Password cannot be blank!')
        } else {
            validation++
        }

        if(loginCredentials.passwordConfirm === "" || loginCredentials.passwordConfirm === undefined) {
            setPasswordError('Password cannot be blank!')
        } else {
            validation++
        }

        if(loginCredentials.password !== loginCredentials.passwordConfirm) {
            setPasswordError('Passwords must match!')
        } else {
            validation++
        }

        if(validation === 3) {
            auth.confirmPasswordReset(code, loginCredentials.passwordConfirm)
            .then(() => {
                setMessage('success')
            })
            .catch((error) => {
                console.log(error.code)
                setMessage('fail')
                setPasswordError('Password must be at least 6 characters')
            })
        }
    }

    useEffect(() => {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get('oobCode');

        auth.verifyPasswordResetCode(code)
        .then(() => {
            setCode(code)
            setValid(true)
        })
        .catch((error) => {
            console.log(error.code)
        })

    }, [])

  return (
    <>
        <Header />
            <div className='select-game' style={{minHeight:'100vh'}}>
                <Container>
                    <div style={{padding:'5% 0px'}}>
                        <center>
                        {message === 'success'? <div style={{display:'block',backgroundColor:'mediumspringgreen',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Success!</strong> Your password has been reset! <Link style={{textDecoration:'underline', color:'#000'}} to={"/login"}><u>Login Here</u></Link></p></div> : message === 'fail' ? <div style={{display:'block',backgroundColor:'indianred',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Uh oh!</strong> Looks like you have some errors to fix!</p></div> : null}

                        <img src={banner} style={{maxWidth:'100%'}} />
                        <br/>
                        <br/>
                        {valid === true ? <>
                        <p>Enter a new password.</p>
                        <Form style={{width:'500px', maxWidth:'100%', marginTop:'20px'}} onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label style={{width:'100%',textAlign:'left'}}>New Password</Label>
                                <Input type="password" id="password" onChange={handleChange} style={{height:'50px'}} invalid={passwordError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{passwordError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Confirm New Password</Label>
                                <Input type="password" id="passwordConfirm" onChange={handleChange} style={{height:'50px'}} invalid={passwordError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{passwordError}</FormFeedback>
                            </FormGroup>
                            <Button style={{marginTop:'20px',width:'100%',backgroundColor:'#242425',height:'50px'}}  disabled={message === 'success'? true : false}>Reset Password</Button>
                        </Form>
                        </> : <>
                            <p>Please make sure the link you followed from your email is correct. If you are still having trouble resetting your password, please contact an Omnia admin.</p>
                            <Link to='/'><Button style={{marginTop:'20px',backgroundColor:'#242425',height:'50px'}} onClick={handleSubmit}>Return Home</Button></Link>
                        </>}
                        </center>
                    </div>
                </Container>
            </div>
    </>
  );
}

export default ResetPassword;
