import { observable } from 'mobx';

class UserStore {
    @observable isLoggedIn = false
    @observable username = ''
    @observable permission = ''
}

export default new UserStore()