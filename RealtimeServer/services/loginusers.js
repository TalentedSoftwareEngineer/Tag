const users = [];

const addUser = ({ socket_id, login_id }) => {

    const existingUser = users.find((user) => user.login_id === login_id);

    if (existingUser) return { error: 'The User is already exist.' };

    const user = { socket_id, login_id };

    users.push(user);

    return { user };
}

const removeUser = (login_id) => {
    const index = users.findIndex((user) => user.login_id === login_id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => {
        return user.login_id == id
    });
}

module.exports = { addUser, removeUser, getUser };