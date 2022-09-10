import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import SmallFooter from '../components/SmallFooter';
import defaultPic from '../assets/default-profile-picture.png';
import { firestore } from '../config/firebase';
import { Container, Row, Col, Button } from 'reactstrap';
import { useAuth } from "../config/context"
import { Link, useParams, useHistory } from "react-router-dom";
import Loading from '../components/LoadingLight';

function UpdateProfile() {
    const history = useHistory()
    let { username } = useParams();
    const [profile, setProfile] = useState({});
    const [user, setUser] = useState({});
    const [files, setFiles] = useState('');
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    function checkProfile() {
        firestore.collection('users').where('username','==',`${username}`).get()
        .then((querySnapshot) => {
            if(!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    firestore.collection('player_accounts').doc(doc.id).get()
                    .then((querySnapshot3) => {
                        console.log(querySnapshot3.data())
                        setUser(doc.data())
                        setProfile(querySnapshot3.data())
                        setFiles(querySnapshot3.data().profile_image)
                        setLoading(false)
                });
                });
            } else {
                alert('Profile not found')
                setLoading(false)
            }
            
        })
    }

    useEffect(() => {

        checkProfile();
        
      }, [])
  return (
    <>
        <Header />
            <div className='profile-bg' style={{minHeight:'100vh'}}>
                <Container>
                {loading === true ? <Loading /> : profile &&
                    <Row>
                        <Col md='12' lg='8' style={{paddingTop:'20px'}}>
                            <>
                                <span style={{color:'#000',padding:'5px 20px',backgroundColor:'#fff',fontSize:'25px',borderRadius:'10px',fontWeight:'600'}}>{username.toUpperCase()}</span>
                                <Row style={{backgroundColor:'#fff',borderRadius:'10px',margin:'0',marginTop:'20px',alignItems:'center'}}>
                                    <Col md='12' lg='4' style={{padding:'20px'}}>
                                        <div style={{borderRadius:'10px',border:'2px solid #000'}}>
                                            <img src={profile.profile_image === '' ? defaultPic : files} style={{maxWidth:'100%',borderRadius:'10px',aspectRatio:'4/5',objectFit:'cover'}} />
                                        </div>
                                    </Col>
                                    <Col md='12' lg='8' style={{padding:'20px'}}>
                                        <Row style={{margin:'0'}}>
                                            <Col md='4'>
                                                <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>REGION:</p>
                                            </Col>
                                            <Col md='8'>
                                                <p style={{padding:'5px',border:'1px solid #000',borderRadius:'10px'}}> {user.region}</p>
                                            </Col>
                                        </Row>
                                        <Row style={{margin:'0'}}>
                                            <Col md='4'>
                                                <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>MAIN GAME:</p>
                                            </Col>
                                            <Col md='8'>
                                                <p style={{padding:'5px',border:'1px solid #000',borderRadius:'10px'}}> {profile.game}</p>
                                            </Col>
                                        </Row>
                                        <Row style={{margin:'0'}}>
                                            <Col md='4'>
                                                <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>IGN:</p>
                                            </Col>
                                            <Col md='8'>
                                                <p style={{padding:'5px',border:'1px solid #000',borderRadius:'10px'}}> {profile.ign}</p>
                                            </Col>
                                        </Row>
                                        <Row style={{margin:'0'}}>
                                            <Col md='4'>
                                                <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>{profile.game === 'Valorant' ? 'AGENTS' : 'LEGENDS'}</p>
                                            </Col>
                                            <Col md='8'>
                                                <Row>
                                                    <Col md='6'>
                                                        <p style={{padding:'5px',border:'1px solid #000',borderRadius:'10px'}}> {profile.primary_agent}</p>
                                                    </Col>
                                                    <Col md='6'>
                                                        <p style={{padding:'5px',border:'1px solid #000',borderRadius:'10px'}}> {profile.secondary_agent}</p>
                                                    </Col>
                                                </Row>
                                                
                                            </Col>
                                        </Row>
                                        <Row style={{margin:'0'}}>
                                            <Col md='4'>
                                                <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>TEAM ROLE:</p>
                                            </Col>
                                            <Col md='8'>
                                                <p style={{padding:'5px',border:'1px solid #000',borderRadius:'10px'}}> {profile.role}</p>
                                            </Col>
                                        </Row>
                                        <Row style={{margin:'0'}}>
                                            <Col md='4'>
                                                <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px',margin:'0'}}>TEAM STATUS:</p>
                                            </Col>
                                            <Col md='8'>
                                                <p style={{padding:'5px',border:'1px solid #000',borderRadius:'10px',margin:'0'}}> {'Free Agent'}</p>
                                            </Col>
                                        </Row>
                                        {currentUser.uid === profile.player_id && <Row style={{margin:'0'}}>
                                            <Col md='12'>
                                                <Link to='/update-profile'>
                                                    <Button className="" style={{borderRadius:'10px',backgroundColor:'#000',fontSize:'16px',marginTop:'20px',width:'100%'}} size="lg">EDIT PROFILE</Button>
                                                </Link>
                                            </Col>
                                        </Row>}
                                    </Col>
                                </Row>
                            </>
                            <div style={{paddingTop:'50px'}}>
                                <span style={{color:'#000',padding:'5px 20px',backgroundColor:'#fff',fontSize:'25px',borderRadius:'10px',fontWeight:'600'}}>OMNIA HISTORY</span>
                                <Row style={{backgroundColor:'#fff',borderRadius:'10px',margin:'0',marginTop:'20px',alignItems:'center'}}>
                                    <Col md='3' lg='3' style={{padding:'20px'}}>
                                        <Row style={{margin:'0'}}>
                                            <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>EVENT</p>
                                        </Row>
                                    </Col>
                                    <Col md='3' lg='3' style={{padding:'20px'}}>
                                        <Row style={{margin:'0'}}>
                                            <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>GAME</p>
                                        </Row>
                                    </Col>
                                    <Col md='3' lg='3' style={{padding:'20px'}}>
                                        <Row style={{margin:'0'}}>
                                            <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>TEAM</p>
                                        </Row>
                                    </Col>
                                    <Col md='3' lg='3' style={{padding:'20px'}}>
                                        <Row style={{margin:'0'}}>
                                            <p style={{color:'#fff',backgroundColor:'#000',padding:'5px',borderRadius:'10px',paddingLeft:'10px'}}>PLACEMENT</p>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md='12' lg='4' style={{paddingTop:'20px',marginBottom:'50px'}}>
                        <div>
                                <span style={{color:'#000',padding:'5px 20px',backgroundColor:'#fff',fontSize:'25px',borderRadius:'10px',fontWeight:'600'}}>OMNIA MEDALS</span>
                                <Row style={{backgroundColor:'#fff',borderRadius:'10px',margin:'0',marginTop:'20px',alignItems:'center',height:'700px'}}>
                                    
                                </Row>
                            </div>
                        </Col>
                    </Row>
                }
                </Container>
            </div>
        <SmallFooter />
    </>
  );
}

export default UpdateProfile;
