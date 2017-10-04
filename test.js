'use strict';

const fs = require('fs');


/** Class create log to class Login. */
class Log {
  static levels() {
    return {
      LOG: 'LOG',
      ERROR: 'ERROR',
      WARN: 'WARN',
      ALERT: 'ALERT',
      INFO: 'INFO',
    };
  }
  constructor() {
    this.list = [];
  }
  add(level, msg) {
    const obj = { level, date: new Date().getTime(), msg };
    this.list.push(obj);
    if (process.argv[3] == 'logfile') {
      fs.appendFile('log.txt', `${JSON.stringify(obj)}\n`, (err) => {
        if (err) throw err;
      });
    }
  }
  dateConverter(d) {
    return [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
  }
  showMsg(msg) {
    console.log(`-> ${msg.level}\t${this.dateConverter(new Date(msg.date))}\n   ${msg.msg}\n`);
    return msg;
  }
  showList() {
    this.list.forEach(msg => { this.showMsg(msg); });
    if (process.argv[3] == 'logfile') {
      console.log('show log.txt!!!');
    }
  }
}


/** Class is used for logins. */
class Login {
  /**
    * Checks if user exists.
    * @param {string} userToCheck - name user to check.
    * @param {array} list - this.sessions or this.users.
    * @return {boolean} is true when user exist.
    */
  static userExist(userToCheck, list) {
    return list.some(user => user === userToCheck);
  }
  /**
    * Create a Login.
    * @param {object} hash - object: k: username, v: password.
    */
  constructor(hash) {
    this.log = new Log();
    this.sessions = [];
    this.users = [];
    this.passwords = [];
    this.init(hash);
  }
  /**
    * Add new logged message.
    * @param {string} msg - text to message.
    */
  logged(msg) {
    this.log.add(Log.levels().WARN, msg);
  }
  /**
    * Add new user.
    * @param {string} userData - name user to add.
    */
  addUser(userData) {
    this.users.push(userData.user);
    this.passwords.push(userData.password);
  }
  /**
    * init array passwords and users.
    * @param {object} hash - object: k: username, v: password.
    */
  init(hash) {
    Object.keys(hash).forEach(user => {
      this.addUser({ user, password: hash[user] });
    });
  }
  // Register user
  registerUser(user, password) {
    if (Login.userExist(user, this.users)) {
      this.logged(`registerUser(${user}, ${password}) [user already exists]`);
    } else {
      this.addUser({ user, password });
    }
  }

  logout(user) {
    if (Login.userExist(user, this.sessions)) {
      const index = this.idx(user, this.sessions);
      this.sessions.splice(index, 1);
    } else {
      this.logged(`logout(${user}) [user not exists]`);
    }
  }

  removeUser(user) {
    if (Login.userExist(user, this.users)) {
      const index = this.userIndex(user);
      this.users.splice(index, 1);
      this.passwords.splice(index, 1);
    } else {
      this.logged(`removeUser(${user}) [user not exists]`);
    }
  }

  checkPassword(user, password) {
    if (Login.userExist(user, this.users)) {
      const index = this.userIndex(user);
      return this.passwords[index] === password && this.users[index] === user;
    }
    this.logged(`checkPassword(${user}, ${password}) [user not exists]`);
    return false;
  }

  login(user, password) {
    if (this.checkPassword(user, password)) {
      if (!Login.userExist(user, this.sessions)) {
        this.sessions.push(user);
      } else {
        this.logged(`login(${user}, ${password}) [user is login]`);
      }
    } else {
      this.logged(`login(${user}, ${password}) [invaid credentials]`);
    }
  }

  updatePassword(user, oldPassword, newPassword) {
    if (this.checkPassword(user, oldPassword) && newPassword) {
      this.passwords[this.userIndex(user)] = newPassword;
      return true;
    }
    return false;
  }

  userIndex(user) {
    return this.idx(user, this.users);
  }

  // Gets index of an element in an array
  idx(element, array) {
    return array.indexOf(element);
  }
}

let registeredUsers = {
  user1: 'pass1',
  user2: 'pass2',
  user3: 'pass3'
};

let login = new Login(registeredUsers);

login.registerUser('user4', 'pass4');
login.login('user4', 'pass4');
login.updatePassword('user3', 'pass3', 'pass5');
login.login('user3', 'pass5');
login.logout('user4');
login.logout('user3');

/* TEST */
const test = () => {
  console.log('|----------------------------------|');
  console.log('|             TEST APP             |');
  console.log('|----------------------------------|\n');

  console.log('1. ------ List Users & Pass  ------\n');
  console.log('users:\t', login.users);
  console.log('passw:\t', login.passwords);

  console.log('\n\n2. ------ Register User exists (user4) [simulate error] ------');
  login.registerUser('user4', 'pass4');
  console.log('users', login.users);

  console.log('\n\n3. ------ Register User (user6) ------');
  login.registerUser('user6', 'pass6');
  console.log('users:\t', login.users);
  console.log('passw:\t', login.passwords);

  console.log('\n\n4. ------ Login (user1)  ------');
  console.log('sessi:\t', login.sessions);
  console.log('session (user1) init...');
  login.login('user1', 'pass1');
  console.log('sessi:\t', login.sessions);

  console.log('\n\n5. ------ Login (user3, pass5)  ------');
  console.log('sessi:\t', login.sessions);
  console.log('session (user3) init...');
  login.login('user3', 'pass5');
  console.log('sessi:\t', login.sessions);

  console.log('\n\n6. ------ Login (user1) [simulate error] ------');
  login.login('user1', 'pass1');
  console.log('sessi:\t', login.sessions);

  console.log('\n\n7. ------ Login (user199, pass1) [simulate error] ------');
  login.login('user199', 'pass1');
  console.log('sessi:\t', login.sessions);

  console.log('\n\n8. ------ Login (user1, pass199) [simulate error] ------');
  login.login('user1', 'pass199');
  console.log('sessi:\t', login.sessions);

  console.log('\n\n9. ------ Logout (user1)  ------');
  login.logout('user1');
  console.log('sessi:\t', login.sessions);

  console.log('\n\n10. ------ Logout (user1) [simulate error] ------');
  login.logout('user1');
  console.log('sessi:\t', login.sessions);

  console.log('\n\n11. ------ Remove (user100) [simulate error] ------');
  login.removeUser('user100');
  console.log('users:\t', login.users);
  console.log('passw:\t', login.passwords);

  console.log('\n\n12. ------ Remove (user3) ------');
  login.removeUser('user3');
  console.log('users:\t', login.users);
  console.log('passw:\t', login.passwords);

  console.log('\n\n13. ------ Checks Password (user1, pass1) ------');
  console.log('->\t', login.checkPassword('user1', 'pass1'));

  console.log('\n\n14. ------ Checks Password (user1, pass100)  [simulate error] ------');
  console.log('->\t', login.checkPassword('user1', 'pass100'));

  console.log('\n\n15. ------ Change Password (user1, pass1 -> pass33) ------');
  login.updatePassword('user1', 'pass1', 'pass33');
  console.log('users:\t', login.users);
  console.log('passw:\t', login.passwords);

  console.log('\n\n16. ------ Login (user1, pass33) ------');
  console.log('sessi:\t', login.sessions);
  login.login('user1', 'pass33');
  console.log('sessi:\t', login.sessions);

  console.log('\n\n17. ---- LOG ----');
  login.log.showList();
};

if (process.argv[2] == 'test') {
  test(login);
}
