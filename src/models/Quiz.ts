import Question from "./Question";

class Quiz {
    id: number | null
    title: string
    questions: number[] = []

    constructor(id: number | null, title: string, questions: number[] = []) {
        this.id = id
        this.title = title
        this.questions = questions
    }

    async delete() {
        try {
            let response = await fetch(`/_apis/quiz/${this.id}`, {
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
        let endpoint = '/_apis/quiz' + (this.id ? `/${this.id}` : '')
        try {
            let response = await fetch(endpoint, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'title': this.title
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

    static async getQuiz(id: string) {
        try {
            let response = await fetch(`/_apis/quiz/${id}`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json'
                }
            })
            let result: {id: number, title: string, questions: number[]} = await response.json()

            if (response.status == 200) {
                return Quiz.deserialize(result)
            }
        } catch (e) {
            console.log(e)
        }
        return null
    }

    static async getAll() {
        try {
            let response = await fetch('/_apis/quiz', {
                method: 'get',
                headers: {
                    'Accept': 'application/json'
                }
            })
            let result: {id: number, title: string, questions: number[]}[] = await response.json()

            if (response.status == 200) {
                return result.map((quiz, i) => Quiz.deserialize(quiz))
            }
        } catch (e) {
            console.log(e)
        }
        return []
    }

    static deserialize(obj: {id: number, title: string, questions: number[]}) {
        return new Quiz(obj.id, obj.title, obj.questions)
    }
}

export default Quiz