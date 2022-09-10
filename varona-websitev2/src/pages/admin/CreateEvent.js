import React, {useState, useEffect} from 'react';
import AdminHeader from '../../components/AdminHeader';
import SmallFooter from '../../components/SmallFooter';
import { firestore, auth } from '../../config/firebase';
import { Container, Row, Col, FormFeedback, FormGroup, Input, Button, Table } from 'reactstrap';
import { useAuth } from "../../config/context"
import { Link, useHistory, useParams } from "react-router-dom"

function CreateEvent() {
    const history = useHistory()
    const [ignError, setIgnError] = useState('');
    const [files, setFiles] = useState('');
    const [loading, setLoading] = useState(true)
    const [updated, setUpdated] = useState(false)
    const [event, setEvent] = useState({});
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

    const handleChange = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertBase64(file)
        setEvent({...event, headerimage: base64})
    }

    const createEvent = () => {
        firestore.collection('events').add({
            ...event
        }).then(() => {
            history.replace('/admin/events')
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect( async() => {
        if(currentUser) {
            await auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                if (!!idTokenResult.claims.admin) {
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
                    {loading === true ? null : <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Create An Event</h2>
                                <>
                                <h5 style={{margin:'0'}}>Event Header</h5>
                                <img src={event.headerimage} style={{maxWidth:'100%'}} />
                                <input type="file" id="profile-image" accept="image/png, image/gif, image/jpeg" onChange={handleChange} />
                                <br/>
                                <br/>
                                <h5 style={{margin:'0'}}>Event Name</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="text" id="ign" value={event.name} onChange={(e) => {
                                            setIgnError('')
                                            setEvent({...event, name: e.target.value})
                                        }} style={{height:'50px',width:'400px',maxWidth:'100%'}} />
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Event Overview</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="textarea" id="ign" value={event.eventoverview} onChange={(e) => {
                                            setEvent({...event, eventoverview: e.target.value})
                                        }} style={{width:'400px',maxWidth:'100%'}} />
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Event Rules & Instructions</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="textarea" id="ign" value={event.rulesinstructions} onChange={(e) => {
                                            setEvent({...event, rulesinstructions: e.target.value})
                                        }} style={{width:'400px',maxWidth:'100%'}} />
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
                                            <option>Select A Game</option>
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
                                            <option>Select A Series</option>
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
                                <h5 style={{margin:'0'}}>Event Fee</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="number" id="ign" value={event.fee} onChange={(e) => {
                                            setIgnError('')
                                            setEvent({...event, fee: e.target.value})
                                        }} style={{height:'50px',width:'400px',maxWidth:'100%'}} />
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                <h5 style={{margin:'0'}}>Max Teams</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="number" id="ign" value={event.maxteams} onChange={(e) => {
                                            setIgnError('')
                                            setEvent({...event, maxteams: e.target.value})
                                        }} style={{height:'50px',width:'400px',maxWidth:'100%'}} />
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                <br/>
                                </>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px'}} onClick={createEvent} size="lg">Create Event</Button>
                        </center>
                    </div>}
                    
                </Container>
            </div>
        <SmallFooter />
    </>
  );
}

export default CreateEvent;
