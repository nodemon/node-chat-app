class Users {
  constructor () {  // var user = new User(params) will invoke this with parameters
    this.userList = [];
  }

  // object method - access object using this
  addUser (id, name, room) {
    var user = {id, name, room};
    this.userList.push(user);
    return user;
  }

  removeUser (id) {
    var user = this.getUser(id);
    if (user) {
      var filteredUserList = this.userList.filter((user) => user.id != id);
      this.userList = filteredUserList;
    }

    return user;
  }

  getUser(id) {
    var userObject = this.userList.find((user) => user.id === id);
    return userObject;
  }

  // case-insensitive search
  getUserByName(name) {
    var userObject = this.userList.find((user) => user.name.toLowerCase() === name.toLowerCase());
    return userObject;
  }

  // case-insensitive search
  getUserNames(room) {
    var userObjects = this.userList.filter((user) => user.room.toLowerCase() === room.toLowerCase()); // filter: array objects which satisfy the condition get added to the result
    var userNames = userObjects.map((user) => user.name);   // map: selectively return the properties from an object

    return userNames;

  }

}

module.exports = {Users};
