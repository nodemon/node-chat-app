const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

  beforeEach(() => {
    users = new Users();
    users.userList = [{
      id: '1',
      name: 'Ned',
      room: 'stark'
    }, {
      id: '2',
      name: 'Dan',
      room: 'targ'
    }, {
      id: '3',
      name: 'John',
      room: 'stark'
    }];
  });

  it('should add a new user', () => {
    var users = new Users();
    var user = {
      id: '4',
      name: 'Rhae',
      room: 'targ'
    };
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.userList).toEqual([user]);
  })

  it('should return names for room stark', () => {
    var userList = users.getUserNames('stark');
    expect(userList).toEqual(['Ned', 'John']);
  });

  it('should return names for room targ', () => {
    var userList = users.getUserNames('targ');
    expect(userList).toEqual(['Dan']);
  });

  it('should remove user with id 1', () => {
    var user = users.removeUser('1');
    expect(user).toEqual({
      id: '1',
      name: 'Ned',
      room: 'stark'
    });
    expect(users.userList.length).toBe(2);
  });

  it('should not remove user with id 0', () => {
    var user = users.removeUser('0');
    expect(user).toNotExist();
    expect(users.userList.length).toBe(3);
  });


  it('should find user with id 1', () => {
    var user = users.getUser('1');
    expect(user).toEqual({
      id: '1',
      name: 'Ned',
      room: 'stark'
    });
  });

  it('should not find user with id 0', () => {
    var user = users.getUser('0');
    expect(user).toNotExist();
  });

  it('should find user with name ', () => {
    var user = users.getUserByName('Ned');
    expect(user).toEqual({
      id: '1',
      name: 'Ned',
      room: 'stark'
    });
  });

})
