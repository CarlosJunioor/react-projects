import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import { firestore } from '../config/firebase';
import defaultLogo from '../assets/default-team-logo.png';
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "../config/context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading';

function TeamDetails () {

    const { currentUser } = useAuth();
    const history = useHistory();
    let { id } = useParams();
    const [teams, setTeams] = useState([]);
    const [nameError, setNameError] = useState('');
    const [team, setTeam] = useState({});
    const [loading, setLoading] = useState(true);
    const [member, setMember] = useState({});
    const [updates, setUpdates] = useState({});
    const [updated, setUpdated] = useState(false)
    const [files, setFiles] = useState('');
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [modal2, setModal2] = useState(false);
    const toggle2 = () => setModal2(!modal2);
    const [modal3, setModal3] = useState(false);
    const toggle3 = () => setModal3(!modal3);
    const [modal4, setModal4] = useState(false);
    const toggle4 = () => setModal4(!modal4);

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

    const handleName = (event) => {
        setNameError('')
        setUpdates({
            ...updates,
            name: event.target.value
        })
    }

    const handleChange = async (event) => {
        const file = event.target.files[0]
        const base64 = await convertBase64(file)
        setUpdates({
            ...updates,
            logo: base64
        });
    }

    const updateTeam = () => {
        let validation = 0;

        if(updates.name === '' || updates.name === ' ' || updates.name === undefined) {
            setNameError('Team name cannot be blank.')
        } else if(updates.name !== team.name) {
            if(teams.includes(updates.name)) {
                setNameError('This team name is already in use.')
            } else {
                validation++
            }
        } else {
            validation++
        }

        console.log(validation)

        if(validation === 1) {
            firestore.collection("teams").doc(team.id)
            .update({
                name: updates.name,
                logo: updates.logo
            })
            .then(() => {
                history.replace('/teams/' + updates.name);
                setUpdated(true)
                setUpdated(false)
                toggle2()
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    const deleteTeam = () => {
        firestore.collection("teams").doc(team.id).delete().then(() => {
            history.replace('/teams')
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const removeMember = () => {
        const newList = [];
        team.members.forEach((teamMember) => {
            newList.push(teamMember.id)
        })
        const filtered = newList.filter(item => item !== member.id)
        firestore.collection('teams').doc(team.id).update({
            members: filtered
        })
        .then(() => {
            window.location.reload()
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    const leaveTeam = () => {
        const newList = [];
        team.members.forEach((teamMember) => {
            newList.push(teamMember.id)
        })
        const filtered = newList.filter(item => item !== member.id)
        firestore.collection('teams').doc(team.id).update({
            members: filtered
        })
        .then(() => {
            history.replace('/teams')
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    useEffect(() => {
        firestore.collection("teams")
        .where("name", "==", id).get().then((querySnapshot) => {
            if(querySnapshot.empty === false) {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data())
                    firestore.collection('users').get()
                    .then((querySnapshot2) => {
                        var allUsers = [];
                        querySnapshot2.forEach((doc2) => {
                            allUsers.push({
                                id: doc2.id,
                                username: doc2.data().username
                            })
                        })
                        let res = allUsers.filter(item => doc.data().members.includes(item.id))
                        let res2 = allUsers.filter(item => doc.data().captain === item.id)
                        setTeam({
                            id: doc.id,
                            name: doc.data().name,
                            logo: doc.data().logo,
                            members: res,
                            members_array: doc.data().members,
                            captain: res2,
                            invite_code: doc.data().invite_code
                        })
                        setUpdates({
                            name: doc.data().name,
                            logo: doc.data().logo
                        })
                        firestore.collection('teams').get()
                        .then((querySnapshot3) => {
                            var listofteams = [];
                            querySnapshot3.forEach((doc3) => {
                                listofteams.push(doc3.data().name)
                            })
                            setTeams(listofteams)
                        })
                    })
                setLoading(false)
                })
            } else {
                alert('Team not found!')
                setLoading(false)
            }
        })
        .catch((error) => {
            console.log(error)
            setLoading(false)
        });
        

    }, [updated])

  return (
    <>
        <Header />
        <div style={{backgroundColor:'#000',padding:'20px',display:'flex',justifyContent:'center'}}><h1 style={{color:'#fff',fontWeight:'800',margin:'0',textTransform:'uppercase'}}>{team.name}</h1></div>
        <div className='select-game'>
            <Container>
            {loading === true ? <Loading /> : teams && <div className='section'>
                    <Row style={{display:'flex', justifyContent:'center'}}>
                        <Col md="3" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <div style={{width:'300px', aspectRatio:'1/1', maxWidth:'100%', backgroundColor:'#eee', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'10px'}}>
                                <img src={team.logo === '' ? defaultLogo : team.logo} style={{maxWidth:'100%',borderRadius:'10px',aspectRatio:'1/1',objectFit:'cover'}} />
                            </div>
                        </Col> 
                    </Row>
                    <center>
                    <Row style={{display:'flex', justifyContent:'center'}}>
                        <h4 style={{marginTop:'20px',fontWeight:'700'}}>Team Captain</h4>
                        {team.members !== undefined && team.captain.map((captain) => (
                            <h3>{captain.username}</h3>
                        ))}
                    </Row>

                    <Row style={{display:'flex', justifyContent:'center'}}>
                        <h4 style={{marginTop:'20px',fontWeight:'700'}}>Members</h4>
                        {team.members !== undefined && team.members.map((member) => (
                            <Col md="2" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <div style={{ backgroundColor:'#fff', padding:'10px', border:'1px solid #000', borderRadius:'10px'}}>
                                    {member.username}
                                    {currentUser !== null && team.captain[0].id === currentUser.uid && member.id !== team.captain[0].id ? <span style={{marginLeft:'20px',cursor:'pointer'}} onClick={() => {
                                        setMember({
                                            id: member.id,
                                            username: member.username
                                        });
                                        toggle()
                                    }}><FontAwesomeIcon icon={faTimes} /></span> : ''}
                                </div>
                            </Col> 
                        ))}
                    </Row>
                    <br/>
                    <br/>
                    <Row style={{display:'flex', justifyContent:'center'}}>
                        {currentUser !== null && team.members !== undefined && team.captain[0].id === currentUser.uid ? 
                        <>
                        <h4 style={{marginTop:'20px',fontWeight:'700'}}>Invite Link</h4>
                        <p>This link is unique to your team. Anyone with this link is able to join your team so keep it safe!</p>
                        <FormGroup style={{marginTop:'10px'}}>
                                    <Input type="text" id="team-name" value={'https://omnia-tournaments.web.app/i/' + team.invite_code} style={{height:'50px',width:'400px',maxWidth:'100%', marginBottom:'20px'}} readOnly />
                                </FormGroup>

                            <Button className="profile-next-btn" onClick={toggle2} style={{backgroundColor:'#242425',height:'50px',width:'300px'}} size="lg">EDIT TEAM DETAILS</Button>

                            <Button className="profile-next-btn" onClick={toggle3} style={{backgroundColor:'red',height:'50px',width:'300px'}} size="lg">DELETE TEAM</Button>

                        </> 
                        : ''} 
                        {currentUser !== null && team.members !== undefined && team.members_array.includes(currentUser.uid) && team.captain[0].id !== currentUser.uid  ? 
                        <>
                            <Button className="profile-next-btn" onClick={() => {
                                toggle4()
                                setMember({
                                    id: currentUser.uid,
                                    username: currentUser.displayName
                                })    
                            }} style={{backgroundColor:'red',height:'50px',width:'300px'}} size="lg">LEAVE TEAM</Button>

                        </> 
                        : ''}
                    </Row>
                    </center>
                </div>
}
            </Container>
        </div>
        <Footer />
        <Modal isOpen={modal} toggle={toggle} centered={true}>
            <ModalHeader toggle={toggle}>Remove Member?</ModalHeader>
            <ModalBody>
              Are you sure you want to remove <b>{member.username}</b> from your roster?
            </ModalBody>
            <ModalFooter>
              <Button style={{backgroundColor:'#242425'}} onClick={() => {
                  removeMember()
                  toggle()
              }}>Confirm</Button>{' '}
              <Button onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modal3} toggle={toggle3} centered={true}>
            <ModalHeader toggle={toggle3}>Delete Team?</ModalHeader>
            <ModalBody>
              Are you sure you want to remove delete this team? This team's history will still be shown on events history.
            </ModalBody>
            <ModalFooter>
              <Button style={{backgroundColor:'red'}} onClick={() => {
                  deleteTeam()
                  toggle3()
              }}>Delete</Button>{' '}
              <Button onClick={toggle3}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modal2} toggle={toggle2} centered={true}>
            <ModalHeader toggle={toggle2}>Edit Team Details</ModalHeader>
            <ModalBody>
              <>
                <h5 style={{margin:'0'}}>Team Name</h5>
                <FormGroup style={{marginTop:'10px'}}>
                    <Input type="text" id="team-name" onChange={handleName} value={updates.name} style={{height:'50px',width:'400px',maxWidth:'100%'}} />
                </FormGroup>
                {nameError !== '' && <p style={{margin:'0',color:'red'}}>{nameError}</p>}
                <br/>
                <h5 style={{margin:'0'}}>Team Logo</h5>
                <br/>
                <input type="file" id="profile-image" accept="image/png, image/gif, image/jpeg" onChange={handleChange} />
                <br /><br />
                <center>
                    <div style={{width:'300px', height:'300px', aspectRatio:'1/1', backgroundColor:'#eee', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'10px'}}>
                        <img src={updates.logo} style={{maxWidth:'100%',borderRadius:'10px',aspectRatio:'1/1',objectFit:'cover'}} />
                    </div>
                </center>
              </>
            </ModalBody>
            <ModalFooter>
              <Button style={{backgroundColor:'#242425'}} disabled={updates.name !== team.name || updates.logo !== team.logo ? false : true} onClick={() => {
                  updateTeam()
              }}>Update</Button>{' '}
              <Button onClick={() => {
                  setUpdates({
                      name: team.name,
                      logo: team.logo
                  })
                  setFiles('')
                  toggle2()
              }}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modal4} toggle={toggle4} centered={true}>
            <ModalHeader toggle={toggle4}>Leave Team?</ModalHeader>
            <ModalBody>
              Are you sure you want to leave <b>{team.name}</b>?
            </ModalBody>
            <ModalFooter>
              <Button style={{backgroundColor:'#242425'}} onClick={() => {
                  leaveTeam()
                  toggle4()
              }}>Confirm</Button>{' '}
              <Button onClick={toggle4}>Cancel</Button>
            </ModalFooter>
          </Modal>
    </>
  );
}

export default TeamDetails;
