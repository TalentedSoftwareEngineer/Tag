const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const apiRealtime = require('./routes/realtime');
const { addUser, removeUser, getUser } = require('./services/loginusers'); 

const port = process.env.PORT || 2023;

app.get('/', (req, res) => {
  res.send('server is running');
});
app.use('/realtime', apiRealtime(app));

io.on('connection', (socket) => {

  socket.on('join', ({auth_id}, callback) => {
    const { error, user } = addUser({socket_id: socket.id, login_id: auth_id});
    if (error) {return callback(error);}
  });

  socket.on('logout', ({loginUserId}, callback) => {
    const user = removeUser(loginUserId);
    
    callback();
  });

  socket.on('msgSent', ({message}, callback)=>{
    message.to_syain.forEach((item, index, arr)=>{
      // let loginUser = getUser(item);
      // socket.broadcast.to(loginUser.socket_id).emit('msgGet', {});
      // io.to(loginUser.socket_id).emit('msgGet', {});
      let send_name = message.syain_name;
      let send_syain = message.send_syain;
      let send_yoyaku_date = message.send_yoyaku_date;
      let send_date = message.send_date;
      io.emit('msgGet', {
        send_name: send_name,
        send_syain: send_syain, 
        to_syain_id: item, 
        send_yoyaku_date: send_yoyaku_date, 
        send_date:send_date,
      });
    });
    callback();
  });

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
