import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Button } from 'reactstrap';
import { firestore } from '../config/firebase';
import defaultLogo from '../assets/default-team-logo.png';
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "../config/context";
import Loading from '../components/Loading';

function TeamInvite () {

    const { currentUser } = useAuth();
    const history = useHistory();
    let { id } = useParams();
    const [teams, setTeams] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const accept = () => {
        firestore.collection('teams').doc(teams[0].id).update({
            members: [...teams[0].members, currentUser.uid]
        })
        .then(() => {
            console.log("Document successfully updated!");
            history.replace('/teams')
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    useEffect(() => {
        if(currentUser === null) {
            history.replace('/login')
        } else {
            let userTeams = [];
            firestore.collection("teams")
            .where("invite_code", "==", id).get().then((querySnapshot) => {
                if(querySnapshot.empty === false) {
                    querySnapshot.forEach((doc) => {
                        userTeams.push({
                            id: doc.id,
                            name: doc.data().name,
                            logo: doc.data().logo,
                            members: doc.data().members,
                            captain: doc.data().captain
                        })
                        setTeams(userTeams)
                        if(doc.data().members.includes(currentUser.uid)) {
                            setMessage('You are already on this team.')
                        } else {
                            setMessage('')
                        }
                    });
                } else {
                    history.replace('/')
                }
                setLoading(false)
            });
        }
    }, [])

  return (
    <>
        <Header />
        <div style={{backgroundColor:'#000',padding:'20px',display:'flex',justifyContent:'center'}}><h1 style={{color:'#fff',fontWeight:'800',margin:'0'}}>YOU'VE BEEN INVITED</h1></div>
        <div className='select-game'>
            <Container>
            {loading === true ? <Loading /> : teams && <div className='section'>
                    <Row style={{display:'flex', justifyContent:'center'}}>
                        {teams.length > 0 && teams.map((team) => (
                            <Col md="3" style={{display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'}}>
                                <div style={{width:'300px', height:'300px', aspectRatio:'1/1', backgroundColor:'#eee', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'10px'}}>
                                    <img src={team.logo === '' ? defaultLogo : team.logo} style={{maxWidth:'100%',borderRadius:'10px',aspectRatio:'1/1',objectFit:'cover'}} />
                                </div>
                                <h3 style={{marginTop:'15px'}}>{team.name}</h3>
                            </Col>
                        ))}
                    </Row>
                    <center>
                        {message !== '' ? <><h4 style={{marginTop:'20px'}}>{message}</h4><Button onClick={() => history.replace('/teams')} style={{backgroundColor:'#121212',color:'#fff',padding:'10px 40px',marginTop:'10px',fontWeight:'800'}} size='lg'>BACK TO TEAMS</Button></> : <><h4 style={{marginTop:'20px'}}>Do you want to join this team?</h4>
                        <Button onClick={accept} style={{backgroundColor:'#121212',color:'#fff',padding:'10px 40px',marginTop:'10px',fontWeight:'800'}} size='lg'>ACCEPT</Button></>}
                        
                    </center>
                </div>
            }
            </Container>
        </div>
        <Footer />
    </>
  );
}

export default TeamInvite;
