import React from 'react'
import {RouteComponentProps, withRouter} from "react-router-dom";
import Question from "./models/Question";
import Quiz from "./models/Quiz";
import HeaderBar from "./HeaderBar";
import {default as Branding} from "./Branding.json";
import {Button, Form, Navbar, Container, Row, Col, Accordion, Card, Modal} from "react-bootstrap";
import { observer } from 'mobx-react'
import UserStore from "./stores/UserStore";

class EditQuizView extends React.Component<RouteComponentProps<{ quizId: string }>,
    { quiz: Quiz | null, questions: Question[], showRenameModal: boolean, showDeleteModal: boolean }> {

    deletedQuestions: Question[] = []

    constructor(props: RouteComponentProps<any>) {
        super(props)
        this.state = {
            quiz: null,
            questions: [],
            showRenameModal: false,
            showDeleteModal: false
        }
    }

    getQuestionsSorted() {
        return this.state.questions.sort((a, b) => a.questionOrder - b.questionOrder)
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
        if (questions.length == 0) {
            questions.push(new Question(null, this.state.quiz, '', 0, ['', '', '']))
        }
        this.setState({questions: questions})
    }

    async saveQuiz() {
        this.state.quiz?.save()
        this.state.questions.forEach((q) => q.save())
        this.deletedQuestions.forEach((q) => q.delete())
        this.props.history.push(`/quiz/${this.state.quiz?.id}`)
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
                <Navbar bg="dark" variant="dark" className="justify-content-between">
                    <Form inline>
                        <Button type="button"
                                variant="secondary"
                                className="mr-sm-2"
                                onClick={event => { this.props.history.push('/quizzes') }}>
                            All Quizzes
                        </Button>
                        {
                            this.state.quiz ? (
                                <Button type="button"
                                        variant="primary"
                                        className="mr-sm-2"
                                        onClick={e => {
                                            this.setState({
                                                showRenameModal: true
                                            })
                                        }}>
                                    Rename
                                </Button>
                            ) : null
                        }
                        {
                            this.state.quiz ? (
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
                    <Form inline>
                        {
                            this.state.quiz ? (
                                <Button type="button"
                                        variant="secondary"
                                        className="mr-sm-2"
                                        onClick={event => {
                                            this.props.history.push(`/quiz/${this.state.quiz?.id}`)
                                        }}>
                                    Cancel
                                </Button>
                            ) : null
                        }
                        {
                            this.state.quiz ? (
                                <Button type="button"
                                        variant="primary"
                                        onClick={event => this.saveQuiz()}>
                                    Save
                                </Button>
                            ) : null
                        }
                    </Form>
                </Navbar>
                <Container fluid="md" className="mt-2">
                {
                    this.getQuestionsSorted()
                        .map((question, i, questions) => (
                            <Card className="mt-2">
                                <Form>
                                    <Card.Header>
                                        <Row>
                                            <Col xs={2} sm={1}><h2>{i + 1}.</h2></Col>
                                            <Col>
                                                <Form.Control type='text'
                                                              placeholder='Question'
                                                              value={question.questionText}
                                                              onChange={
                                                                  (control) => {
                                                                      let value = control.currentTarget.value
                                                                      if (value.length > 300) return

                                                                      questions[i].questionText = value
                                                                      this.setState({
                                                                          questions: questions
                                                                      })
                                                                  }
                                                              } />
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Card.Body>
                                        {
                                            question.answers.map((answer, j) => (
                                                <Row>
                                                    <Col xs={2} sm={1}><h3>{'ABCDE'[j]}.</h3></Col>
                                                    <Col xs={6} sm={7}>
                                                        <Form.Control type='text'
                                                                      placeholder='Question'
                                                                      value={answer}
                                                                      onChange={
                                                                          (control) => {
                                                                              let value = control.currentTarget.value
                                                                              if (value.length > 200) return

                                                                              questions[i].answers[j] = value
                                                                              this.setState({
                                                                                  questions: questions
                                                                              })
                                                                          }
                                                                      } />
                                                    </Col>
                                                    <Col>
                                                    {
                                                        j > 0 ? (
                                                            <Button variant="secondary"
                                                                    className="btn-block"
                                                                    onClick={() => {
                                                                        let nextAnswer = question.answers[j - 1]
                                                                        questions[i].answers[j - 1] = answer
                                                                        questions[i].answers[j] = nextAnswer
                                                                        this.setState({
                                                                            questions: questions
                                                                        })
                                                                    }}>
                                                                Up
                                                            </Button>
                                                        ) : null
                                                    }
                                                    </Col>
                                                    <Col>
                                                    {
                                                        j < question.answers.length - 1 ? (
                                                            <Button variant="secondary"
                                                                    className="btn-block"
                                                                    onClick={() => {
                                                                        let nextAnswer = question.answers[j + 1]
                                                                        questions[i].answers[j + 1] = answer
                                                                        questions[i].answers[j] = nextAnswer
                                                                        this.setState({
                                                                            questions: questions
                                                                        })
                                                                    }}>
                                                                Down
                                                            </Button>
                                                        ) : null
                                                    }
                                                    </Col>
                                                    <Col>
                                                    {
                                                        question.answers.length > 3 ? (
                                                            <Button variant="danger"
                                                                    className="btn-block"
                                                                    onClick={() => {
                                                                        questions[i].answers = questions[i].answers
                                                                            .filter((a, a_i) => a_i != j)
                                                                        this.setState({
                                                                            questions: questions
                                                                        })
                                                                    }}>
                                                                Delete
                                                            </Button>
                                                        ) : null
                                                    }
                                                    </Col>
                                                </Row>
                                            ))
                                        }
                                    </Card.Body>
                                    <Card.Footer>
                                        {
                                            i > 0 ? (
                                                <Button variant="secondary"
                                                        className="mr-sm-2"
                                                        onClick={() => {
                                                            let thisQO = question.questionOrder
                                                            let nextQO = questions[i - 1].questionOrder
                                                            questions[i - 1].questionOrder = thisQO
                                                            questions[i].questionOrder = nextQO
                                                            this.setState({
                                                                questions: questions
                                                            })
                                                        }}>
                                                    Up
                                                </Button>
                                            ) : null
                                        }
                                        {
                                            i < questions.length - 1 ? (
                                                <Button variant="secondary"
                                                        className="mr-sm-2"
                                                        onClick={() => {
                                                            let thisQO = question.questionOrder
                                                            let nextQO = questions[i + 1].questionOrder
                                                            questions[i + 1].questionOrder = thisQO
                                                            questions[i].questionOrder = nextQO
                                                            this.setState({
                                                                questions: questions
                                                            })
                                                        }}>
                                                    Down
                                                </Button>
                                            ) : null
                                        }
                                        {
                                            questions.length > 1 ? (
                                                <Button variant="danger"
                                                        onClick={() => {
                                                            questions = questions.filter(
                                                                (q, q_i) => q_i != i)
                                                            if (question.id)
                                                                this.deletedQuestions.push(question)
                                                            this.setState({
                                                                questions: questions
                                                            })
                                                        }}>
                                                    Delete
                                                </Button>
                                            ) : null
                                        }
                                        <Button variant="primary"
                                                className="pull-right"
                                                onClick={() => {
                                                    if (this.state.quiz === null) return

                                                    questions.forEach((q) => {
                                                        if (q.questionOrder > question.questionOrder) {
                                                            q.questionOrder++
                                                        }
                                                    })
                                                    questions.push(new Question(null, this.state.quiz,
                                                        '', question.questionOrder + 1,
                                                        ['', '', '']))

                                                    this.setState({
                                                        questions: questions
                                                    })
                                                }}>
                                            Add Question
                                        </Button>
                                        {
                                            question.answers.length < 5 ? (
                                                <Button variant="primary"
                                                        className="pull-right mr-2"
                                                        onClick={() => {
                                                            questions[i].answers.push('')
                                                            this.setState({
                                                                questions: questions
                                                            })
                                                        }}>
                                                    Add Answer
                                                </Button>
                                            ) : null
                                        }
                                    </Card.Footer>
                                </Form>
                            </Card>
                        ))
                }
                </Container>
                <Modal show={this.state.showRenameModal} onHide={() => this.setState({showRenameModal: false})}>
                    <Modal.Header>
                        Renaming Quiz Title
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control type='text'
                                      placeholder='Quiz Title'
                                      value={this.state.quiz?.title}
                                      onChange={
                                          (control) => {
                                              if (this.state.quiz === null) return

                                              let value = control.currentTarget.value
                                              if (value.length > 50) return
                                              let quiz = this.state.quiz
                                              quiz.title = value
                                              this.setState({
                                                  quiz: quiz
                                              })
                                          }
                                      } />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.setState({showRenameModal: false})}>
                            Done
                        </Button>
                    </Modal.Footer>
                </Modal>
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

export default observer(withRouter(EditQuizView))