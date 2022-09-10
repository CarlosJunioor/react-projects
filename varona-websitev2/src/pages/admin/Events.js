import React, {useState, useEffect} from 'react';
import AdminHeader from '../../components/AdminHeader';
import Footer from '../../components/Footer';
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { firestore, auth } from '../../config/firebase';
import { useAuth } from "../../config/context";
import { Link, useHistory } from "react-router-dom";
import Loading from '../../components/Loading';

function Events() {

    const history = useHistory();
    const { currentUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    function setDate(startDate) {
        var date = new Date(startDate);
        date.setDate(date.getDate() + 1);
        return date.toDateString();
    }

    useEffect(async () => {
        if(currentUser) {
            await auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                if (!!idTokenResult.claims.admin) {
                    firestore.collection('events').get()
                    .then((querySnapshot) => {
                        var eventsArray = [];
                        querySnapshot.forEach((doc) => {
                            eventsArray.push({...doc.data(), id: doc.id})
                        });
                        setEvents(eventsArray)
                        setLoading(false)
                    })
                        .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                } else {
                    history.replace('/')
                }
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            history.replace('/')
        }
    },[])
  return (
    <>
        <AdminHeader />
        <div className='select-game'>
            <Container>
                {loading === true ? <Loading /> : <div className='section'>
                    <Row>
                        <Col md='3'>
                            <h3 style={{fontWeight:'800'}}>Events</h3>
                        </Col>
                        <Col md='9'>
                            <Link to={'/admin/events/create'}>
                                <Button style={{width:'400px',maxWidth:'100%', float:'right'}}>Create Event</Button>
                            </Link>
                        </Col>
                        
                    </Row>
                    <Row>
                        {events.map((event) => (
                            <Col md='3'>
                                <Card>
                                    <CardImg
                                        alt="Card image"
                                        src={event.headerimage}
                                        width="100%"
                                    />
                                    <CardBody>
                                    <CardTitle tag="h5">
                                        {event.name}
                                    </CardTitle>
                                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                                        {event.game}
                                    </CardSubtitle>
                                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                                        {setDate(event.start_date)}
                                    </CardSubtitle>
                                    <CardText>
                                        {event.eventoverview}
                                    </CardText>
                                    <Link to={'/admin/event/' + event.id}>
                                    <Button>
                                        VIEW
                                    </Button>
                                    </Link>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>}
            </Container>
        </div>
        <Footer />
    </>
  );
}

export default Events;
