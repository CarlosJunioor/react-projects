import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import SmallFooter from '../components/SmallFooter';
import { firestore } from '../config/firebase';
import { Container, Row, Col, FormFeedback, FormGroup, Input, Button } from 'reactstrap';
import { useAuth } from "../config/context"
import { useHistory } from "react-router-dom"

function CreateProfile() {
    const history = useHistory()
    const db = firestore.collection('games');
    const [games, setGames] = useState([]);
    const [agents, setAgents] = useState([]);
    const [profile, setProfile] = useState({});
    const [ignError, setIgnError] = useState('');
    const [files, setFiles] = useState('');
    const { currentUser } = useAuth();
    const [step, setStep] = useState(0);

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
        firestore.collection('player_accounts').doc(currentUser.uid).set({
            player_id: currentUser.uid,
            game: profile.game,
            primary_agent: profile.mainAgent,
            secondary_agent: profile.secondAgent,
            ign: profile.ign,
            role: profile.role,
            profile_image: files
        })
        setStep(step + 1)
    }

    function selectAgent(agent) {
        if(profile.mainAgent === undefined) {
            setProfile({
                ...profile,
                mainAgent: agent
            })
        } else if(profile.mainAgent !== undefined) {
            setProfile({
                ...profile,
                secondAgent: agent
            })
        }
        if(profile.mainAgent === agent) {
            setProfile({
                ...profile,
                mainAgent: undefined
            })
        } else if(profile.secondAgent === agent) {
            setProfile({
                ...profile,
                secondAgent: undefined
            })
        }
    }

    function getGames() {
        db.get()
        .then((querySnapshot) => {
            var supportedGames = [];
            querySnapshot.forEach((doc) => {
                supportedGames.push(doc.data())
            });
            setGames(supportedGames)
            firestore.collection('agents').get()
            .then((querySnapshot2) => {
                var gameAgents = [];
                querySnapshot2.forEach((doc2) => {
                    gameAgents.push(doc2.data())
                });
                setAgents(gameAgents)
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
                    alert('Already have a profile you little slut')
                } else {
                    getGames();
                }
            })
            
        }
        
      }, [])
  return (
    <>
        <Header />
            <div className='select-game' style={{minHeight:'100vh'}}>
                <Container>
                    {step === 0 &&
                    <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Athlete Profile</h2>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <h5 style={{margin:'0'}}>Which of the supported Omnia titles do you primarily compete in?</h5>
                                <p><i>Providing this information will determine the rest of your Profile setup</i></p>
                                {games && games.map((game) => (
                                    <img src={'data:image/jpeg;base64,' + game.image} onClick={() => setProfile({...profile, 'game': game.name})} style={{width:'200px',margin:'15px',borderRadius:'10px', outline: profile.game === game.name ? '5px solid #000' : 'none'}} />
                                ))}
                            </div>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px',width:'200px'}} onClick={() => setStep(step + 1)} disabled={profile.game === undefined ? true : false} size="lg">Next</Button>
                        </center>
                    </div>}
                    {step === 1 && 
                    <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Athlete Profile</h2>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <h5 style={{margin:'0'}}>Who do you play as?</h5>
                                <p><i>Select your primary (main) agent and a secondary agent</i></p>
                                {agents && agents.filter(agent => agent.game === profile.game ).map((agent) => (
                                    <div className={profile.mainAgent === agent.name ? 'main' : profile.secondAgent === agent.name ? 'second' : '' } onClick={() => selectAgent(agent.name)} style={{width:'100px',margin:'5px',display:'inline-block'}}>
                                        <img src={'data:image/jpeg;base64,' + agent.image} className={profile.mainAgent === agent.name ? profile.game === 'Apex Legends' ? 'main-agent-apex' : 'main-agent' : profile.secondAgent === agent.name ? profile.game === 'Apex Legends' ? 'second-agent-apex' : 'second-agent' : '' } style={{width:'100px',margin:'5px'}} />
                                    </div>
                                ))}
                            </div>
                            <div className="profile-btn-div">
                            <Button className="profile-back-btn" style={{backgroundColor:'#616161',height:'50px',width:'200px'}} onClick={() => {
                                setStep(step - 1);
                                setProfile({
                                    ...profile,
                                    primary_agent: undefined,
                                    secondary_agent: undefined
                                })
                                }} size="lg">Back</Button>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px',width:'200px'}} onClick={() => setStep(step + 1)} disabled={profile.mainAgent === undefined || profile.secondAgent === undefined ? true : false} size="lg">Next</Button>
                                </div>
                        </center>
                    </div>
                    }
                    {step === 2  && 
                    <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Athlete Profile</h2>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <h5 style={{margin:'0'}}>What is your IGN (In Game Name) for {profile.game}?</h5>
                                <p><i>Provide your in game name for {profile.game}</i></p>
                                <FormGroup style={{marginTop:'10px'}}>
                                    <Input type="text" id="ign" value={profile.ign} onChange={(e) => setProfile({...profile, ign: e.target.value})} style={{height:'50px',width:'400px',maxWidth:'100%'}} invalid={ ignError === '' ? false : true}/>
                                    <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                </FormGroup>
                            </div>
                            <div className="profile-btn-div">
                            <Button className="profile-back-btn" style={{backgroundColor:'#616161',height:'50px',width:'200px'}} onClick={() => {
                                setStep(step - 1);
                                setProfile({
                                    ...profile,
                                    ign: undefined
                                })
                                }} size="lg">Back</Button>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px',width:'200px'}} onClick={() => setStep(step + 1)} disabled={profile.ign === undefined || profile.ign === null ? true : false} size="lg">Next</Button>
                            </div>
                        </center>
                    </div>
                    }
                    {step === 3  && 
                    <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Athlete Profile</h2>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <h5 style={{margin:'0'}}>Which best describes your role in a team composition?</h5>
                                <p><i>Your selected role will be displayed on your Athlete Profile</i></p>
                                <Row style={{justifyContent:'center'}}>
                                {roles.map(player_role => (
                                    <Col md="3" style={{padding:'10px'}}>
                                        <div className={profile.role === player_role ? 'role-selected' : 'role'} onClick={() => setProfile({...profile,role: player_role.toUpperCase()})}>
                                            {player_role}
                                        </div>
                                    </Col>
                                ))}
                                </Row>
                            </div>
                            <div className="profile-btn-div">
                            <Button className="profile-back-btn" style={{backgroundColor:'#616161',height:'50px',width:'200px'}} onClick={() => {
                                setStep(step - 1);
                                setProfile({
                                    ...profile,
                                    role: undefined
                                })
                                }} size="lg">Back</Button>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px',width:'200px'}} onClick={() => setStep(step + 1)} disabled={profile.role === undefined || profile.role === null ? true : false} size="lg">Next</Button>
                            </div>
                        </center>
                    </div>
                    }
                    {step === 4  && 
                    <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Athlete Profile</h2>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <h5 style={{margin:'0'}}>Submit an Athlete Profile Image</h5>
                                <p><i>Show the Omnia metaverse who you are and make your profile more personal. <br />Recommended size is 400x500 pixels.</i></p>
                                <input type="file" id="profile-image" accept="image/png, image/gif, image/jpeg" onChange={handleChange} />
                                <br /><br />
                                {files && <>
                                <p>Here is how your image will look on your profile:</p>
                                <div style={{width:'300px',height:'400px',backgroundImage:`url(${files})`,backgroundPosition:'center',backgroundSize:'cover',backgroundRepeat:'no-repeat',backgroundColor:'#919191',borderRadius:'10px',outline:'2px solid #000'}}></div>
                                </>}
                            </div>
                            <div className="profile-btn-div">
                            <Button className="profile-back-btn" style={{backgroundColor:'#616161',height:'50px',width:'200px'}} onClick={() => {
                                setStep(step - 1);
                                setFiles('');
                                setProfile({
                                    ...profile,
                                    role: undefined
                                })
                                }} size="lg">Back</Button>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px',width:'200px'}} onClick={handleFinish} size="lg">Finish</Button>
                            </div>
                        </center>
                    </div>
                    }
                    {step === 5  && 
                    <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Athlete Profile</h2>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <h5 style={{margin:'0'}}>Your Athlete Profile has been created!</h5>
                                <p><i>Now it's time to show it off and earn some medals to display</i></p>
                                <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px'}} onClick={handleFinish} size="lg">View {profile.game} Tournaments!</Button>
                            </div>
                        </center>
                    </div>
                    }
                </Container>
            </div>
        <SmallFooter />
    </>
  );
}

export default CreateProfile;
