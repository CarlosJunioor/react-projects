import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Input, FormGroup, Button, Label } from 'reactstrap';
import { firestore } from '../config/firebase';
import { useAuth } from "../config/context";
import { Link, useHistory, useParams } from "react-router-dom"
import Loading from '../components/Loading';

function Register() {

    const history = useHistory()
    const { currentUser } = useAuth();
    let { id } = useParams();
    const [alertMessage, setAlertMessage] = useState('');
    const [event, setEvent] = useState({});
    const [teams, setTeams] = useState([]);
    const [empty, setEmpty] = useState(false);
    const [user, setUser] = useState(false);
    const [team, setTeam] = useState(null);
    const [rosterError, setRosterError] = useState('');
    const [teamError, setTeamError] = useState('');
    const [captainError, setCaptainError] = useState('');
    const [agreeError, setAgreeError] = useState('');
    const [registration, setRegistration] = useState({});
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(true);

    function setDate(startDate) {
        var date = new Date(startDate);
        date.setDate(date.getDate() + 1);
        return date.toDateString();
    }

    const handleCheck = () => {
        setAgreeError('')
        setAgree(!agree)
    }

    const onChange = (e) => {
        setRegistration({
            ...registration,
            captain_info: ''
        })
        setTeamError('')
        if(e.target.value !== '') {
            console.log(e.target.value)
            let res = teams.filter(item => item.id === e.target.value);
            console.log(res[0])
            setTeam({
                ...res[0]
            })
        } else {
            setTeam(null)
        }
    }

    const onChange2 = (e) => {
        setCaptainError('')
        setRegistration({
            ...registration,
            captain_info: e.target.value
        })
    }

    const register = () => {
        var validation = 0;

        if(registration.roster.length > 0 || registration.roster !== undefined) {
            validation += 1
        } else {
            setRosterError('You must select at least 1 roster member.')
        }

        if(registration.captain_info !== '') {
            validation += 1
        } else {
            setCaptainError('You must provide your discord info.')
        }

        if(agree === true) {
            validation += 1
        } else {
            setAgreeError('You must agree to our terms & conditions.')
        }

        if(event.registeredteams === undefined) {
            validation += 1
        } else {
            if(event.registeredteams.includes(team.id)) {
                setTeamError('This team is already registered.')
            } else {
                validation += 1
            }
        }

        if(event.registeredteams === undefined) {
            validation += 1
        } else {

            var count = 0;
            event.team_info.forEach((team) => {
                if(team.roster.some(item => registration.roster.includes(item))) {
                    count++;
                } else {
                    
                }
            })
            
            if(count > 0) {
                setRosterError('A member of your roster is already registered on another team.')
            } else {
                validation += 1
            }
        }
        
        if(validation === 5) {
            if(event.registeredteams === undefined) {
                firestore.collection('events').doc(id).update({
                    registeredteams: [team.id],
                    team_info: [
                        {
                            captain: registration.captain_info,
                            id: team.id,
                            placement: '',
                            score: '',
                            roster: registration.roster
                        }
                    ]
                    })
                    window.scrollTo(0,0);
                    setAlertMessage('success')
                    setTeam(null)
            } else {
                firestore.collection('events').doc(id).update({
                registeredteams: [...event.registeredteams, team.id],
                team_info: [
                    ...event.team_info,
                    {
                        captain: registration.captain_info,
                        id: team.id,
                        placement: '',
                        score: '',
                        roster: registration.roster
                    }
                ]
                })
                window.scrollTo(0,0);
                setAlertMessage('success')
                setTeam(null)
            }
        } else {
            window.scrollTo(0,0);
            setAlertMessage('fail')
        }
        
    }

    function adjustMembers(member) {
        setRosterError('')
        var array = registration.roster;
        if(registration.roster !== undefined && array.includes(member)) {
            let updated = registration.roster.filter(item => item !== member);
            setRegistration({
                ...registration,
                roster: updated
            })
        } else {
            if(registration.roster === undefined) {
                setRegistration({
                    ...registration,
                    roster: [member]
                })
            } else {
                setRegistration({
                    ...registration,
                    roster: [...registration.roster, member]
                })
                
            }
        }
    }

    useEffect( async () => {

        await firestore.collection('events').doc(id).get()
            .then((doc) => {
                if(doc.exists === true) {
                    firestore.collection('series').doc(doc.data().seriesname).get()
                    .then((doc2) => {
                        if(doc2.exists === true) {
                            var event = {
                                ...doc.data(),
                                seriesname: doc2.data().name
                            };
                            var teams2 = [];
                        }
                                                                                                                                                                   

                    firestore.collection('users').get()
                    .then((querySnapshot2) => {
                        var allUsers = [];
                        querySnapshot2.forEach((doc2) => {
                            allUsers.push({
                                id: doc2.id,
                                username: doc2.data().username
                            })
                        })
                        if(currentUser === null) {
                            setUser(true) 
                        } else {
                            firestore.collection("teams")
                            .where("captain", "==", currentUser.uid).get().then((querySnapshot) => {
                                if(querySnapshot.empty === false) {
                                    querySnapshot.forEach((doc) => {
                                        let res = allUsers.filter(item => doc.data().members.includes(item.id))
                                        teams2.push({...doc.data(), id: doc.id, members: res})
                                    });
                                    setTeams(teams2)
                                } else {
                                    setEmpty(true)
                                }
                            
                            });
                        }
                    setEvent(event);
                    setLoading(false);
                    })
                });
                } else {
                    alert('No event found')
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                setLoading(false);
            });

    },[])
  return (
    <>
        <Header />
        <>
            <div className='select-game'>
            {loading === true ? <Loading /> : event && <>
            <div className='event-banner' style={{width:'100%', height:'450px',backgroundColor:'#121212',backgroundRepeat:'no-repeat', backgroundSize:'cover', backgroundPosition:'center', backgroundImage: `url(${event.headerimage})`}}></div>

                <div style={{padding:'5% 0px'}}>
                    <Container>    
                        <center>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <Row style={{alignItems:'center'}}>
                                    <Col lg='12'>
                                    {alertMessage === 'success'? <div style={{display:'inline-block',backgroundColor:'mediumspringgreen',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Success!</strong> Your team has been registered!</p></div> : alertMessage === 'fail' ? <div style={{display:'inline-block',backgroundColor:'indianred',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Uh oh!</strong> Looks like you have some errors to fix!</p></div> : null}

                                        <h1 style={{fontWeight:'800',margin:'0'}}>{event.name}</h1>
                                        <h3 style={{margin:'0'}}>{event.seriesname}</h3>
                                        <h5 style={{margin:'0'}}>{'Game: ' + event.game}</h5>
                                        <p>{setDate(event.start_date)}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    {user === true? <>
                                        <center>
                                        <h5 style={{margin:'0'}}>You must be logged in to register for an event!</h5>
                                        <Button style={{marginTop:'20px',width:'200px',backgroundColor:'#242425',height:'50px'}} onClick={() => history.replace('/login?redirect=' + window.location.pathname )}>LOGIN</Button>
                                    </center>
                                    </> : empty === true ? <>
                                    <center>
                                        <h5 style={{margin:'0'}}>You must be a captain of a team to register for an event!</h5>
                                        <Button style={{marginTop:'20px',width:'200px',backgroundColor:'#242425',height:'50px'}} onClick={() => history.replace('/teams/create')}>CREATE A TEAM</Button>
                                    </center>
                                    </> : <>
                                        <h5 style={{margin:'0'}}>Select Your Team</h5>
                                        <FormGroup>
                                            <Input type="select" onChange={onChange} style={{width:'400px'}}>
                                                <option value=''>Select A Team</option>
                                                {teams.map((team) => (
                                                    <option value={team.id}>{team.name}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        {teamError !== '' && <p style={{margin:'0',color:'red'}}>{teamError}</p>}
                                        <br/><br/><br/>
                                        {team !== null && 
                                        <>
                                            <h5 style={{margin:'0'}}>Select Your Roster</h5>
                                            <Row style={{justifyContent:'center'}}>
                                                {team.members.map((member) => {
                                                    return <Col md="3" style={{padding:'10px'}}>
                                                        <div className={registration.roster !== undefined && registration.roster.includes(member.id) === true ? 'role-selected' : 'role'} onClick={() => adjustMembers(member.id)}>
                                                            {member.username}
                                                        </div>
                                                    </Col>
                                                })}
                                
                                            </Row>
                                            {rosterError !== '' && <p style={{margin:'0',color:'red'}}>{rosterError}</p>}

                                            <h5 style={{marginTop:'20px'}}>Captain's Discord Name</h5>
                                            <Row style={{justifyContent:'center'}}>
                                                <FormGroup>
                                                    <Input type="text" placeholder="Name#1234" value={registration.captain_info} onChange={onChange2} style={{width:'400px'}} />
                                                </FormGroup>
                                                {captainError !== '' && <p style={{margin:'0',color:'red'}}>{captainError}</p>}
                                            </Row>
                                            <Row style={{marginTop:'20px'}}>
                                                <FormGroup check>
                                                    <Input type="checkbox" onChange={handleCheck} checked={agree} style={{float:'none'}} />
                                                    <Label check style={{marginLeft:'10px'}}>
                                                        I agree blah blah
                                                    </Label>
                                                </FormGroup>
                                            </Row>
                                            {agreeError !== '' && <p style={{margin:'0',color:'red'}}>{agreeError}</p>}
                                        </>
                                        }
                                    </>}
                        
                                </Row>
                                {user === false && empty === false && 
                                <Row style={{justifyContent:'center'}}>
                                    <Button style={{marginTop:'20px',width:'200px',backgroundColor:'#242425',height:'50px'}} onClick={register} disabled={team === null ? true : false}>REGISTER</Button>
                                </Row>}
                            </div>
                        </center>
                    </Container>
                </div>
                </>}
            </div>
        </>
        <Footer />
    </>
  );
}

export default Register;
