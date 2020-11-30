import React from 'react'
import {RouteComponentProps, withRouter} from "react-router-dom";
import Question from "./models/Question";
import Quiz from "./models/Quiz";
import HeaderBar from "./HeaderBar";
import {default as Branding} from "./Branding.json";
import {Button, Form, Navbar, Container, Row, Col, Accordion, Card, Modal} from "react-bootstrap";
import { observer } from 'mobx-react'
import UserStore from "./stores/UserStore";

class QuizView extends React.Component<RouteComponentProps<{ quizId: string }>,
    { quiz: Quiz | null, questions: Question[], showDeleteModal: boolean }> {
    constructor(props: RouteComponentProps<any>) {
        super(props)
        this.state = {
            quiz: null,
            questions: [],
            showDeleteModal: false
        }
    }

    async componentDidMount() {
        await this.loadQuiz()
    }

    async loadQuiz() {
        let quiz = await Quiz.getQuiz(this.props.match.params.quizId)
        if (quiz) {
            this.setState({quiz: quiz})
            await this.loadQuestions()
        } else {
            this.props.history.push('/')
        }
    }

    async loadQuestions() {
        if (this.state.quiz === null)
            return
        let questions = await Question.getQuestions(this.state.quiz)
        this.setState({questions: questions})
    }

    async deleteQuiz() {
        this.setState({
            showDeleteModal: false
        })
        if (await this.state.quiz?.delete()) {
            this.props.history.push('/quizzes')
        }
    }

    render() {
        return (
            <div>
                <HeaderBar title={this.state.quiz?.title ?? Branding.title} />
                <Navbar bg="dark" variant="dark">
                    <Form inline>
                        <Button type="button"
                                variant="secondary"
                                className={ UserStore.permission == "edit" ? "mr-sm-2" : "" }
                                onClick={event => { this.props.history.push('/quizzes') }}>
                            All Quizzes
                        </Button>
                        {
                            this.state.quiz && UserStore.permission == "edit" ? (
                                <Button type="button"
                                        variant="primary"
                                        className="mr-sm-2"
                                        onClick={event => {
                                            this.props.history.push(`/quiz/${this.state.quiz?.id}/_edit`)
                                        }}>
                                    Edit
                                </Button>
                            ) : null
                        }
                        {
                            this.state.quiz && UserStore.permission == "edit" ? (
                                <Button type="button"
                                        variant="danger"
                                        onClick={e => {
                                            this.setState({
                                                showDeleteModal: true
                                            })
                                        }}>
                                    Delete
                                </Button>
                            ) : null
                        }
                    </Form>
                </Navbar>
                <Container fluid="md" className="mt-2">
                {
                    UserStore.permission == 'restricted' ? (
                        this.state.questions
                            .sort((a, b) => a.questionOrder - b.questionOrder)
                            .map((question, i) => (
                                    <Row>
                                        <Col xs={1}><h2>{i + 1}.</h2></Col>
                                        <Col><h2>{question.questionText}</h2></Col>
                                    </Row>
                                )
                            )
                    ) : (
                        <Accordion>
                        {
                            this.state.questions
                                .sort((a, b) => a.questionOrder - b.questionOrder)
                                .map((question, i) => (
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={i.toString()}>
                                            <h2>{i + 1}. {question.questionText}</h2>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={i.toString()}>
                                            <Card.Body>
                                                {
                                                    question.answers.map((answer, j) => (
                                                        <Row>
                                                            <Col xs={2} sm={1}><h3>{'ABCDE'[j]}.</h3></Col>
                                                            <Col><h3>{answer}</h3></Col>
                                                        </Row>
                                                    ))
                                                }
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                ))
                        }
                        </Accordion>
                    )
                }
                </Container>
                <Modal show={this.state.showDeleteModal} onHide={() => this.setState({showDeleteModal: false})}>
                    <Modal.Header>
                        Delete "{this.state.quiz?.title}"?
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this quiz?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showDeleteModal: false})}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => this.deleteQuiz()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default observer(withRouter(QuizView))