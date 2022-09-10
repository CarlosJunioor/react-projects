import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import SmallFooter from '../components/SmallFooter';
import { firestore } from '../config/firebase';
import { Container, Row, Col, FormFeedback, FormGroup, Input, Button } from 'reactstrap';
import { useAuth } from "../config/context"
import { Link, useHistory } from "react-router-dom"

function UpdateProfile() {
    const history = useHistory()
    const db = firestore.collection('games');
    const [alertMessage, setAlertMessage] = useState('');
    const [games, setGames] = useState([]);
    const [agents, setAgents] = useState([]);
    const [gameAgents, setGameAgents] = useState();
    const [initialGame, setInitialGame] = useState('');
    const [profile, setProfile] = useState({});
    const [ignError, setIgnError] = useState('');
    const [agentsError, setAgentsError] = useState('');
    const [files, setFiles] = useState('');
    const { currentUser } = useAuth();

    var roles = ["IGL","SUPPORT","RECON","ENTRY FRAG","LURKER","FLEX","CROWD CONTROL"];

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

    const handleChange = async (event) => {
        const file = event.target.files[0]
        const base64 = await convertBase64(file)
        setFiles(base64)
    }

    function handleFinish() {
        var validation = 0;

        if(initialGame === profile.game) {
            if(gameAgents.main === undefined || gameAgents.second === undefined) {
                setAgentsError('You must select a Main & Secondary agent.')
            } else {
                validation++
            }
        } else {
            if(gameAgents.third === undefined || gameAgents.fourth === undefined) {
                setAgentsError('You must select a Main & Secondary agent.')
            } else {
                validation++
            }
        }

        if(profile.ign === '' || profile.ign === ' ') {
            setIgnError('Your IGN cannot be blank')
        } else {
            validation++
        }

        if(validation === 2) {
            if(initialGame === profile.game) {
                var one = gameAgents.main;
                var two = gameAgents.second;
            } else {
                var one = gameAgents.third;
                var two = gameAgents.fourth;
            }
            firestore.collection('player_accounts').doc(currentUser.uid).set({
                player_id: currentUser.uid,
                game: profile.game,
                primary_agent: one,
                secondary_agent: two,
                ign: profile.ign,
                role: profile.role,
                profile_image: files
            })
            window.scrollTo(0,0);
            setAlertMessage('success')
        } else {
            window.scrollTo(0,0);
            setAlertMessage('fail')
        }
        
    }

    function selectAgent(agent) {
        setAgentsError('');
        if(initialGame === profile.game){
            if(gameAgents.main === undefined) {
                setGameAgents({
                    ...gameAgents,
                    main: agent
                })
            } else if(gameAgents.main !== undefined) {
                setGameAgents({
                    ...gameAgents,
                    second: agent
                })
            }
            if(gameAgents.main === agent) {
                setGameAgents({
                    ...gameAgents,
                    main: undefined
                })
            } else if(gameAgents.second === agent) {
                setGameAgents({
                    ...gameAgents,
                    second: undefined
                })
            }
        } else {
            if(gameAgents.third === undefined) {
                setGameAgents({
                    ...gameAgents,
                    third: agent
                })
            } else if(gameAgents.third !== undefined) {
                setGameAgents({
                    ...gameAgents,
                    fourth: agent
                })
            }
            if(gameAgents.third === agent) {
                setGameAgents({
                    ...gameAgents,
                    third: undefined
                })
            } else if(gameAgents.fourth === agent) {
                setGameAgents({
                    ...gameAgents,
                    fourth: undefined
                })
            }
        }
        
    }

    function getGames() {
        db.get()
        .then((querySnapshot) => {
            var supportedGames = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                supportedGames.push(doc.data())
            });
            setGames(supportedGames)
            firestore.collection('agents').get()
            .then((querySnapshot2) => {
                var gameAgents = [];
                querySnapshot2.forEach((doc2) => {
                    // doc.data() is never undefined for query doc snapshots
                    gameAgents.push(doc2.data())
                });
                setAgents(gameAgents)
                firestore.collection('player_accounts').doc(currentUser.uid).get()
                .then((querySnapshot3) => {
                    setProfile(querySnapshot3.data())
                    setGameAgents({
                        main: querySnapshot3.data().primary_agent,
                        second: querySnapshot3.data().secondary_agent
                    })
                    setInitialGame(querySnapshot3.data().game)
                    setFiles(querySnapshot3.data().profile_image)
                });
            })
                .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    useEffect(() => {
        if(currentUser === null) {
            history.replace('/login')
        } else {
            firestore.collection('player_accounts').doc(currentUser.uid).get()
            .then((docSnapshot) => {
                if(docSnapshot.exists) {
                    getGames();
                } else {
                    alert('You do not have a profile you little slut')
                }
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
                            {alertMessage === 'success'? <div style={{display:'inline-block',backgroundColor:'mediumspringgreen',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Success!</strong> Your profile has been updated! <Link style={{textDecoration:'underline', color:'#000'}} to={"/profile/" + currentUser.displayName}><u>View Profile</u></Link></p></div> : alertMessage === 'fail' ? <div style={{display:'inline-block',backgroundColor:'indianred',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Uh oh!</strong> Looks like you have some errors to fix!</p></div> : null}
                            <h2 style={{fontWeight:'900'}}>Update Your Athlete Profile</h2>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <>
                                <h5 style={{margin:'0'}}>Primary Game</h5>
                                <Row style={{justifyContent:'center'}}>
                                {games && games.map((game) => (
                                    <Col md="3" style={{padding:'10px'}}>
                                    <div className={profile.game === game.name ? 'role-selected' : 'role'} onClick={() => setProfile({...profile,game: game.name})}>
                                        {game.name}
                                    </div>
                                </Col>
                                ))}
                                </Row>
                                </>
                                <br/>
                                <>
                                <h5 style={{margin:'0'}}>Main & Secondary Agents</h5>
                                {agentsError !== '' && <p style={{margin:'0',color:'red'}}>You must select a main & secondary agent.</p>}
                                <Row style={{justifyContent:'center'}}>
                                {gameAgents && agents.filter(agent => agent.game === profile.game ).map((agent) => (
                                    <div className={gameAgents.main === agent.name || gameAgents.third === agent.name  ? 'main-update' : gameAgents.second === agent.name || gameAgents.fourth === agent.name ? 'second-update' : '' } onClick={() => selectAgent(agent.name)} style={{width:'100px',margin:'5px',display:'inline-block'}}>
                                        <img src={'data:image/jpeg;base64,' + agent.image} className={gameAgents.main === agent.name || gameAgents.third === agent.name ? profile.game === 'Apex Legends' ? 'main-agent-apex-update' : 'main-agent-update' : gameAgents.second === agent.name || gameAgents.fourth === agent.name ? profile.game === 'Apex Legends' ? 'second-agent-apex-update' : 'second-agent-update' : '' } style={{width:'100px',margin:'5px'}} />
                                    </div>
                                ))}
                                </Row>
                                </>
                                <br/>
                                <>
                                <h5 style={{margin:'0'}}>IGN (In Game Name) for {profile.game}</h5>
                                {ignError !== '' && <p style={{margin:'0',color:'red'}}>Your IGN cannot be blank.</p>}
                                <FormGroup style={{marginTop:'10px'}}>
                                    <Input type="text" id="ign" value={profile.ign} onChange={(e) => {
                                        setIgnError('')
                                        setProfile({...profile, ign: e.target.value})
                                    }} style={{height:'50px',width:'400px',maxWidth:'100%'}} invalid={ ignError === '' ? false : true}/>
                                    <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                </FormGroup>
                                </>
                                <br />
                                <>
                                <h5 style={{margin:'0'}}>Team Role</h5>
                                <Row style={{justifyContent:'center'}}>
                                {profile.role !== undefined && roles.map(player_role => (
                                    <Col md="3" style={{padding:'10px'}}>
                                        <div className={profile.role.toUpperCase() === player_role ? 'role-selected' : 'role'} onClick={() => setProfile({...profile,role: player_role})}>
                                            {player_role}
                                        </div>
                                    </Col>
                                ))}
                                </Row>
                                </>
                                <br />
                                <>
                                <h5 style={{margin:'0'}}>Athlete Profile Image</h5>
                                <br/>
                                <input type="file" id="profile-image" accept="image/png, image/gif, image/jpeg" onChange={handleChange} />
                                <br /><br />
                                {files && <>
                                <p>Here is how your image will look on your profile:</p>
                                <div style={{width:'300px',height:'400px',backgroundImage:`url(${files})`,backgroundPosition:'center',backgroundSize:'cover',backgroundRepeat:'no-repeat',backgroundColor:'#919191',borderRadius:'10px',outline:'2px solid #000'}}></div>
                                </>}
                                </>
                            </div>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px'}} onClick={handleFinish} size="lg">Update Profile</Button>
                        </center>
                    </div>
                    
                </Container>
            </div>
        <SmallFooter />
    </>
  );
}

export default UpdateProfile;
