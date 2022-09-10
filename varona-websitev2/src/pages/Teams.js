import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Button } from 'reactstrap';
import { firestore } from '../config/firebase';
import defaultLogo from '../assets/default-team-logo.png';
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../config/context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading';

function Teams () {

    const history = useHistory();
    const { currentUser } = useAuth();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(currentUser === null) {
            history.replace('/login')
        } else {
            firestore.collection("teams")
            .where("members", "array-contains", currentUser.uid).get().then((querySnapshot) => {
                var userTeams = [];
                querySnapshot.forEach((doc) => {
                    userTeams.push({
                        id: doc.id,
                        name: doc.data().name,
                        logo: doc.data().logo,
                        members: doc.data().members,
                        captain: doc.data().captain
                    })
                });
                setTeams(userTeams)
                setLoading(false)
            });
        }
    }, [])

  return (
    <>
        <Header />
        <div style={{backgroundColor:'#000',padding:'20px',display:'flex',justifyContent:'center'}}><h1 style={{color:'#fff',fontWeight:'800',margin:'0'}}>{currentUser.displayName.toUpperCase()}'s TEAMS</h1></div>
        <div className='select-game'>
            <Container>
            {loading === true ? <Loading /> : teams && <div className='section'>
                    <Row style={{display:'flex', justifyContent:'center'}}>
                        {teams.length > 0 ? teams.map((team) => (
                            <Col md="3" style={{display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'}} onClick={() => history.replace('/teams/' + team.name)}>
                                <div style={{width:'300px', aspectRatio:'1/1', maxWidth:'100%', backgroundColor:'#eee', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'10px'}}>
                                    <img src={team.logo === '' ? defaultLogo : team.logo} style={{maxWidth:'100%',borderRadius:'10px',aspectRatio:'1/1',objectFit:'cover'}} />
                                </div>
                                <h3 style={{marginTop:'15px'}}>{team.captain === currentUser.uid ? <FontAwesomeIcon icon={faCrown} style={{color:'goldenrod',marginRight:'10px'}} /> : ''}{team.name}</h3>
                            </Col>
                        )) : <h2 style={{textAlign:'center'}}>You are not apart of any teams. Create one below!</h2>}
                    </Row>
                    <center>
                        <Link to={'/teams/create'}>
                            <Button style={{backgroundColor:'#121212',color:'#fff',padding:'10px 40px',marginTop:'20px',fontWeight:'800'}} size='lg'>+ NEW TEAM</Button>
                        </Link>
                    </center>
                </div>
            }
            </Container>
        </div>
        <Footer />
    </>
  );
}

export default Teams;
