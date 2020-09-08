import React from 'react';
import logo from './logo.png';
import './App.css';

import ItemList from './items.json';
import Configuration from './config.json';

import CardColumns from 'react-bootstrap/CardColumns'
import Card from 'react-bootstrap/Card'
import Navbar from 'react-bootstrap/Navbar'
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";

interface ItemCardProps {
    title: string,
    subtitle: string,
    raffle: boolean,
    image: string
}

const ItemCard = (props: ItemCardProps) => {
    return (<Card border="secondary">
        <Card.Img variant="top" src={props.image} className={'card-image'}/>
        <Card.Body>
            <Card.Title>{props.title} {props.raffle && <Badge pill variant="success">Verlosung</Badge>}</Card.Title>
            <Card.Text>
                {props.subtitle}
            </Card.Text>
        </Card.Body>
    </Card>);
}

function App() {
  return (
    <div className="App">
        <Navbar fixed="top" variant={'dark'} className={'main-navbar'}>
            <Navbar.Brand href="#home" className={"navbar-brand"}>
                <img
                    alt=""
                    src={logo}
                    height="30"
                    className="d-inline-block align-top navbar-logo"
                />
                {Configuration.title}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
                    <Nav.Link href="#merch">Merch</Nav.Link>
                    <Nav.Link href="#order">Bestellen</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Container className={"h-100 masthead"} fluid id={'home'}>
            <Jumbotron className={'jumbotron-header h-100'}>
                <div className={'jumbotron-bg'}></div>
                <Container className={'jumbotron-text'}>
                    <h1>Hello World!</h1>
                    {Configuration.description}
                    <div className={'button-container'}>
                        <Button size="lg" href={"#merch"}>
                            Take me to the merch!
                        </Button>
                    </div>
                </Container>
            </Jumbotron>
        </Container>
        <Container fluid="md" id={'merch'}>
            <h1>Verfügbarer Merch</h1>
            <Row>
                <Col>
                    <CardColumns>
                        {ItemList.map((item, key) => {
                            return <ItemCard {...item} key={key}/>;
                        })}
                    </CardColumns>
                </Col>
            </Row>
        </Container>
        <Container fluid="md" className={"h-100"} id={'order'}>
            <h1>Merch bestellen</h1>
            <Form>
                <Form.Group controlId="formEmail">
                    <Form.Label>E-Mail</Form.Label>
                    <Form.Control required type="email" placeholder="max.mustermann@beispiel.de" />
                </Form.Group>

                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Max Mustermann" />
                </Form.Group>
                <Form.Group controlId="formAddress">
                    <Form.Row>
                        <Col>
                            <Form.Label>Straße und Hausnummer</Form.Label>
                            <Form.Control placeholder="Musterweg 123" />
                        </Col>
                        <Col>
                            <Form.Label>PLZ</Form.Label>
                            <Form.Control placeholder="12345" />
                        </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Merch-Artikel auswählen</Form.Label>
                    <Form.Row>
                        {ItemList.map((item, key) => {
                            return (<Col key={key}>
                                <Form.Check type="checkbox" label={item.title} />
                            </Col>);
                        })}
                    </Form.Row>
                    {ItemList.filter((item) => item.raffle).length !== 0 && <Form.Text id="passwordHelpBlock" muted>
                        Bitte beachten Sie, dass einige Artikel verlost werden.
                    </Form.Text>}
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check required type="checkbox" label="Ich stimme den AGB zu" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    </div>
  );
}

export default App;
