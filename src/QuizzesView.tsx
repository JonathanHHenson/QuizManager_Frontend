import React from 'react'
import HeaderBar from "./HeaderBar";
import { default as Branding } from './Branding.json'
import { Navbar, Form, FormControl, InputGroup, Button, Table, Modal } from 'react-bootstrap'
import { withRouter, RouteComponentProps } from "react-router-dom"
import { observer } from 'mobx-react'
import Quiz from "./models/Quiz";
import UserStore from "./stores/UserStore";

class QuizzesView extends React.Component<RouteComponentProps<{}>, {
    search: string,
    currentQuiz: Quiz | null, showDeleteModal: boolean, quizTitle: string, showCreateModal: boolean, quizzes: Quiz[]
}> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        this.state = {
            search: '',
            currentQuiz: null,
            showDeleteModal: false,
            quizTitle: '',
            showCreateModal: false,
            quizzes: []
        }
    }

    async componentDidMount() {
        await this.loadQuizzes()
    }

    async loadQuizzes() {
        let quizzes = await Quiz.getAll()
        if (quizzes)
            this.setState({quizzes: quizzes})
    }

    async deleteCurrentQuiz() {
        let currentQuiz = this.state.currentQuiz
        this.setState({
            showDeleteModal: false
        })
        if (await currentQuiz?.delete()) {
            let quizzes = this.state.quizzes.filter((quiz, i, arr) => quiz.id != currentQuiz?.id)
            this.setState({
                quizzes: quizzes
            })
        }
    }

    async createQuiz() {
        let title = this.state.quizTitle
        this.setState({
            quizTitle: '',
            showCreateModal: false
        })
        if (title.length) {
            let newQuiz = new Quiz(null, title)
            if (await newQuiz.save()) {
                this.props.history.push(`/quiz/${newQuiz.id}/_edit`)
            }
        }
    }

    render() {
        return (
            <div>
                <HeaderBar title={Branding.title} />
                <Navbar bg="dark" variant="dark">
                    <Form inline>
                        <InputGroup className="mr-sm-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1"><span className="fa fa-search"/></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl type="text"
                                         placeholder="Quiz Title"
                                         value={this.state.search}
                                         onChange={(control) => {
                                             let value = control.currentTarget.value
                                             this.setState({
                                                 search: value
                                             })
                                         }}/>
                        </InputGroup>
                        {
                            UserStore.permission == "edit" ? (
                                <Button type="button"
                                        variant="primary"
                                        onClick={() => {
                                            this.setState({
                                                quizTitle: '',
                                                showCreateModal: true
                                            })
                                        }}>
                                    New
                                </Button>
                            ) : null
                        }
                    </Form>
                </Navbar>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th># of Questions</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.quizzes.filter((quiz) => {
                        if (this.state.search.length > 0) {
                            return quiz.title.includes(this.state.search)
                        } else {
                            return true
                        }
                    }).sort((a, b) => {
                        return a.title.localeCompare(b.title)
                    }).map((quiz, i) => (
                        <tr>
                            <td>{quiz.title}</td>
                            <td>{quiz.questions.length}</td>
                            <td>
                                <Button type="button"
                                        variant="secondary"
                                        className={ UserStore.permission == "edit" ? "mr-sm-2" : "" }
                                        onClick={ event => {this.props.history.push(`/quiz/${quiz.id}`)} }>
                                    View
                                </Button>
                                {
                                    UserStore.permission == "edit" ? (
                                        <Button type="button"
                                                variant="primary"
                                                className="mr-sm-2"
                                                onClick={event => {
                                                    this.props.history.push(`/quiz/${quiz.id}/_edit`)
                                                }}>
                                            Edit
                                        </Button>
                                    ) : null
                                }
                                {
                                    UserStore.permission == "edit" ? (
                                            <Button type="button"
                                                    variant="danger"
                                                    onClick={e => {
                                                        this.setState({
                                                            showDeleteModal: true,
                                                            currentQuiz: quiz
                                                        })
                                                    }}>
                                                Delete
                                            </Button>
                                    ) : null
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Modal show={this.state.showDeleteModal} onHide={() => this.setState({showDeleteModal: false})}>
                    <Modal.Header>
                        Delete "{this.state.currentQuiz?.title}"?
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this quiz?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showDeleteModal: false})}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => this.deleteCurrentQuiz()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showCreateModal} onHide={() => this.setState({showCreateModal: false})}>
                    <Modal.Header>
                        Create New Quiz
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formGroupTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type='text'
                                              placeholder='Quiz Title'
                                              value={this.state.quizTitle}
                                              onChange={
                                                  (control) => {
                                                      let value = control.currentTarget.value
                                                      if (value.length > 50) return
                                                      this.setState({
                                                          quizTitle: value
                                                      })
                                                  }
                                              } />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showCreateModal: false})}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.createQuiz()}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default observer(withRouter(QuizzesView))