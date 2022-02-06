const socket = io.connect('http://localhost:3333')

socket.on('connect', () => {
  console.log('blo')
})

socket.emit('joinRoom', { playerName: 'Marcos', userId: Math.random(), room: '9QUVVS' })


socket.on('userJoined', console.log)