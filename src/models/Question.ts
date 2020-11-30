import Quiz from "./Quiz";

class Question {
    id: number | null
    quiz: Quiz
    questionText: string
    questionOrder: number
    answers: string[]

    constructor(id: number | null, quiz: Quiz, questionText: string, questionOrder: number, answers: string[]) {
        this.id = id
        this.quiz = quiz
        this.questionText = questionText
        this.questionOrder = questionOrder
        this.answers = answers
    }

    async delete() {
        try {
            let response = await fetch(`/_apis/question/${this.id}`, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json'
                }
            })
            let result = await response.json()
            return result && result.success
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async save() {
        let endpoint = '/_apis/' + (this.id ? `question/${this.id}` : `quiz/${this.quiz.id}/questions`)
        try {
            let response = await fetch(endpoint, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'question_text': this.questionText,
                    'answers': this.answers,
                    'question_order': this.questionOrder
                })
            })
            let result = await response.json()
            if (result) {
                this.id = result.id
                return true
            }
        } catch (e) {
            console.log(e)
        }
        return false
    }

    static async getQuestions(quiz: Quiz) {
        try {
            let response = await fetch(`/_apis/quiz/${quiz.id}/questions`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json'
                }
            })
            let result: {id: number,
                question_text: string,
                question_order: number,
                answers: string[]|undefined}[] = await response.json()

            if (response.status == 200) {
                return result.map((question, i) => Question.deserialize(quiz, question))
            }
        } catch (e) {
            console.log(e)
        }
        return []
    }

    static deserialize(quiz: Quiz, obj: {id: number,
                                         question_text: string,
                                         question_order: number,
                                         answers: string[]|undefined}) {
        let answers = obj.answers === undefined? [] : obj.answers
        return new Question(obj.id, quiz, obj.question_text, obj.question_order, answers)
    }
}

export default Question