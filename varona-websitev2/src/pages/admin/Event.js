import React, {useState, useEffect} from 'react';
import AdminHeader from '../../components/AdminHeader';
import SmallFooter from '../../components/SmallFooter';
import { firestore, auth } from '../../config/firebase';
import { Container, Row, Col, FormFeedback, FormGroup, Input, Button, Table } from 'reactstrap';
import { useAuth } from "../../config/context";
import { Link, useHistory, useParams } from "react-router-dom";
import Loading from '../../components/Loading';

function UpdateEvent() {
    const history = useHistory()
    const [profile, setProfile] = useState({});
    const [ignError, setIgnError] = useState('');
    const [files, setFiles] = useState('');
    const [loading, setLoading] = useState(true)
    const [updated, setUpdated] = useState(false)
    let { id } = useParams();
    const [event, setEvent] = useState({});
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [games, setGames] = useState([])
    const [series, setSeries] = useState([])
    const { currentUser } = useAuth();

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
    }

    function convertToName(roster) {
        if(roster === undefined) {

        } else {
            let res = teams.filter(item => roster.includes(item.id));
            return res[0].name;
        }
    }

    const scoreChange = (e, index) => {
        let teamInfo = [...event.team_info];
        teamInfo[index].score = e.target.value;
        setEvent({...event,
            team_info: teamInfo
        })
        setUpdated(true)
        setUpdated(false)
    }

    const placementChange = (e, index) => {
        let teamInfo = [...event.team_info];
        teamInfo[index].placement = e.target.value;
        setEvent({...event,
            team_info: teamInfo
        })
        setUpdated(true)
        setUpdated(false)
    }

    const updateEvent = () => {
        firestore.collection('events').doc(id).set({
            ...event
        })
        setUpdated(true)
        setUpdated(false)
        window.scrollTo(0,0);
    }

    const handleChange = async (event) => {
        const file = event.target.files[0]
        const base64 = await convertBase64(file)
        setFiles(base64)
    }

    useEffect( async() => {
        if(currentUser) {
            auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                if (!!idTokenResult.claims.admin) {
                    firestore.collection('events').doc(id).get()
                    .then((doc) => {
                        console.log(doc.data())
                        if(doc.exists === true) {
                            firestore.collection('series').doc(doc.data().seriesname).get()
                            .then((doc2) => {
                                if(doc2.exists === true) {
                                    setEvent({
                                        ...doc.data(),
                                        series: doc2.data().name,
                                        medalimage: doc2.data().medal
                                    })
                                } else {
                                    alert('Series not found')
                                }
                                
                            })
                        } else {
                            alert('No event found')
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                    firestore.collection('teams').get()
                    .then((querySnapshot2) => {
                        var allTeams = [];
                        querySnapshot2.forEach((doc2) => {
                            allTeams.push({
                                id: doc2.id,
                                name: doc2.data().name
                            })
                        })
                        setTeams(allTeams)
                    });
                    firestore.collection('users').get()
                    .then((querySnapshot2) => {
                        var allUsers = [];
                        querySnapshot2.forEach((doc2) => {
                            allUsers.push({
                                id: doc2.id,
                                username: doc2.data().username
                            })
                        })
                        setUsers(allUsers)
                        firestore.collection('games').get()
                        .then((querySnapshot2) => {
                            var allGames = [];
                            querySnapshot2.forEach((doc2) => {
                                allGames.push({
                                    id: doc2.id,
                                    name: doc2.data().name
                                })
                            })
                            setGames(allGames)
                            firestore.collection('series').get()
                            .then((querySnapshot2) => {
                                var allSeries = [];
                                querySnapshot2.forEach((doc2) => {
                                    allSeries.push({
                                        id: doc2.id,
                                        name: doc2.data().name
                                    })
                                })
                                setSeries(allSeries)
                                setLoading(false)
                            });
                        });
                    });
                } else {
                    history.replace('/')
                }
            });
            setLoading(false)
            
        }
        
      }, [updated])
  return (
    <>
        <AdminHeader />
            <div className='select-game' style={{minHeight:'100vh'}}>
                <Container>
                    {loading === true ? <Loading /> : event && <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Edit Event Details</h2>
                                <>
                                <img src={files === '' ? event.headerimage : files } style={{maxWidth:'100%'}} />
                                <input type="file" id="profile-image" accept="image/png, image/gif, image/jpeg" onChange={handleChange} />
                                <br/>
                                <br/>
                                <h5 style={{margin:'0'}}>Event Name</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="text" id="ign" value={event.name} onChange={(e) => {
                                            setIgnError('')
                                            setEvent({...event, name: e.target.value})
                                        }} style={{height:'50px',width:'400px',maxWidth:'100%'}} invalid={ ignError === '' ? false : true}/>
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Event Overview</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="textarea" id="ign" value={event.eventoverview} onChange={(e) => {
                                            setEvent({...event, eventoverview: e.target.value})
                                        }} style={{width:'400px',maxWidth:'100%'}} invalid={ ignError === '' ? false : true}/>
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Event Rules & Instructions</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="textarea" id="ign" value={event.rulesinstructions} onChange={(e) => {
                                            setEvent({...event, rulesinstructions: e.target.value})
                                        }} style={{width:'400px',maxWidth:'100%'}} invalid={ ignError === '' ? false : true}/>
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Game</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="select" value={event.game} onChange={(e) => {
                                            setIgnError('')
                                            setEvent({...event, game: e.target.value})
                                        }} style={{height:'50px',width:'400px',maxWidth:'100%'}}>
                                                {games && games.map((game) => (
                                                    <option value={game.name}>{game.name}</option>
                                                ))}
                                            </Input>
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Series</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="select" value={event.seriesname} onChange={(e) => {
                                            setIgnError('')
                                            setEvent({...event, seriesname: e.target.value})
                                        }} style={{height:'50px',width:'400px',maxWidth:'100%'}}>
                                                {series && series.map((series) => (
                                                    <option value={series.id}>{series.name}</option>
                                                ))}
                                            </Input>
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Start Date</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="date" id="birthday" value={event.start_date} style={{height:'50px',width:'400px',maxWidth:'100%'}} onChange={(e) => {
                                            setIgnError('')
                                            setEvent({...event, start_date: e.target.value})
                                        }} ></Input>
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Registered Teams</h5>
                                <br/>
                                <Row style={{justifyContent:'center'}}>
                                    <Table striped bordered>
                                        <tr>
                                            <th>Team Name</th>
                                            <th>Capt. Discord</th>
                                            <th>Members</th>
                                            <th>Score</th>
                                            <th>Placement</th>
                                        </tr>
                                        {event.team_info !== undefined && teams.length > 1 && users.length > 0 && event.team_info.map((team,index) => (
                                            <tr style={{height:'75px'}}>
                                                <td>{convertToName(team.id)}</td>
                                                <td>{team.captain}</td>
                                                <td>{team.roster !== undefined && team.roster.map((member) => {
                                                    let res = users.filter(item => member.includes(item.id));
                                                    return <p style={{margin:'0',display:'inline-block'}}>{res[0].username}</p>;
                                                })}</td>
                                                <td>{<Input type="text" style={{backgroundColor:'#fff',borderWidth:'1px'}} value={team.score} onChange={(e) => scoreChange(e, index)} />}</td>
                                                <td>{<Input type="text" style={{backgroundColor:'#fff',borderWidth:'1px'}} value={team.placement} onChange={(e) => placementChange(e, index)} />}</td>
                                            </tr>
                                        ))}
                                    </Table>
                                </Row>
                                </>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px'}} onClick={updateEvent} size="lg">Update Event</Button>
                        </center>
                    </div>}
                    
                </Container>
            </div>
        <SmallFooter />
    </>
  );
}

export default UpdateEvent;
