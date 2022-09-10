import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import { Container, Form, FormFeedback, FormGroup, Input, Button, Label } from 'reactstrap';
import banner from '../assets/banner-logo.jpg';
import { firestore, auth } from '../config/firebase';
import { Link, useHistory } from "react-router-dom"
import { useAuth } from "../config/context";

function SignUp () {
    const { currentUser } = useAuth();
    const history = useHistory()
    const [credentials, setCredentials] = useState({
        firstName: '',
        lastName: '',
        region: '',
        birthday: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [regionError, setRegionError] = useState('');
    const [birthdayError, setBirthdayError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
    const [users, setUsers] = useState([]);

    const handleChange = (e) => {
        const {id, value} = e.target
        setCredentials({
            ...credentials,
            [id]: value
        });

        if(id === 'firstName') {
            setFirstNameError('')
        }

        if(id === 'lastName') {
            setLastNameError('')
        }

        if(id === 'region') {
            setRegionError('')
        }

        if(id === 'birthday') {
            setBirthdayError('')
        }

        if(id === 'username') {
            setUsernameError('')
        }

        if(id === 'email') {
            setEmailError('')
        }

        if(id === 'password') {
            setPasswordError('')
            setPasswordConfirmError('')
        }

        if(id === 'passwordConfirmation') {
            setPasswordConfirmError('')
            setPasswordError('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        var validation = 0;

        if(credentials.firstName.trim() === '') {
            setFirstNameError('First Name is required')
        } else {
            validation++
        }

        if(credentials.lastName.trim() === '') {
            setLastNameError('Last Name is required')
        } else {
            validation++
        }

        if(credentials.region !== "North America" && credentials.region !== "Europe") {
            setRegionError('Region can only be North America or Europe')
        } else {
            validation++
        }

        if(credentials.birthday.trim() === '') {
            setBirthdayError('Date of Birth is required')
        } else {
            var today = new Date();
            var subtraction = today.setFullYear(today.getFullYear()-13);
            var birthday = new Date(credentials.birthday);
            var cutOff = new Date(today.toISOString().substr(0,10))
            
            if(birthday.getTime() / 1000 > cutOff.getTime() / 1000) {
                setBirthdayError('You must be over 13 years of age')
            } else {
                validation++
            }
        }

        if(credentials.username.trim() === '') {
            setUsernameError('Username is required')
        } else {
            if (users.includes(credentials.username.toLowerCase())) {
                setUsernameError('That username is taken')
            }
            else {
                validation++
            }
            
            
        }

        if(credentials.email.trim() === '') {
            setEmailError('Email Address is required')
        } else {
            validation++
        }

        if(credentials.password.trim() === '') {
            setPasswordError('Password is required')
        } else {
            if(credentials.password.length < 6) {
                setPasswordError('Password must be at least 6 characters')
            } else {
                validation++
            }
        }

        if(credentials.passwordConfirmation.trim() === '') {
            setPasswordConfirmError('Passwords must match')
        } else {
            if(credentials.password !== credentials.passwordConfirmation) {
                setPasswordError('Passwords must match')
                setPasswordConfirmError('Passwords must match')
            } else {
                validation++
            }
        }

        if(validation === 8) {
            auth.createUserWithEmailAndPassword(credentials.email, credentials.password, credentials.username).then((user) => {
                user.user.updateProfile({
                    displayName: credentials.username
                })
                firestore.collection('users').doc(user.user.uid).set({
                    username: credentials.username,
                    birthday: credentials.birthday,
                    name: credentials.firstName + ' ' + credentials.lastName,
                    email: credentials.email,
                    region: credentials.region
                })
                localStorage.setItem('userName', credentials.username.toUpperCase())
                history.replace('/')
            })
            .catch((error) => {
                console.log(error)
                console.log(error.code)
                if(error.code === 'auth/email-already-in-use') {
                    setEmailError('That email is already being used by another account')
                }
            });
        }
        
    }

    useEffect(() => {
        if(currentUser !== null) {
            history.replace('/login')
        } else {
            firestore.collection('users').get()
            .then((querySnapshot2) => {
                var listofusers = [];
                querySnapshot2.forEach((doc2) => {
                    listofusers.push(doc2.data().username.toLowerCase())
                })
                console.log(listofusers)
                setUsers(listofusers)
            })
        }
    }, [])
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
                                <Label style={{width:'100%',textAlign:'left'}}>First Name</Label>
                                <Input type="text" id="firstName" onChange={handleChange} style={{height:'50px'}} invalid={firstNameError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{firstNameError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Last Name</Label>
                                <Input type="text" id="lastName" onChange={handleChange} style={{height:'50px'}} invalid={ lastNameError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{lastNameError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Geographical Region</Label>
                                <Input type="select" id="region" onChange={handleChange} style={{height:'50px'}} invalid={ regionError === '' ? false : true}>
                                    <option>Select A Region</option>
                                    <option value="North America">North America</option>
                                    <option value="Europe">Europe</option>
                                </Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{regionError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Date of Birth</Label>
                                <Input type="date" id="birthday" onChange={handleChange} style={{height:'50px'}} invalid={ birthdayError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{birthdayError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Omnia Username</Label>
                                <Input type="text" id="username" onChange={handleChange} style={{height:'50px'}} invalid={ usernameError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{usernameError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Email Address</Label>
                                <Input type="email" id="email" onChange={handleChange} style={{height:'50px'}} invalid={ emailError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{emailError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Password</Label>
                                <Input type="password" id="password" onChange={handleChange} style={{height:'50px'}} invalid={ passwordError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{passwordError}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{marginTop:'10px'}}>
                                <Label style={{width:'100%',textAlign:'left'}}>Confirm Password</Label>
                                <Input type="password" id="passwordConfirmation" onChange={handleChange} style={{height:'50px'}} invalid={ passwordConfirmError === '' ? false : true}></Input>
                                <FormFeedback style={{width:'100%',textAlign:'left'}}>{passwordConfirmError}</FormFeedback>
                            </FormGroup>
                            <Button style={{marginTop:'20px',width:'100%',backgroundColor:'#242425',height:'50px'}}>Sign Up</Button>
                        </Form>
                        <p style={{marginTop:'20px'}}>Already have an account? <Link to='/login' style={{color:'#000'}}>Login</Link></p>
                        </center>
                    </div>
                </Container>
            </div>
    </>
  );
}

export default SignUp;
