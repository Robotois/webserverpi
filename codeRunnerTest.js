const data = JSON.parse(process.env.data);
console.log('Hello from child...');
console.log(data);

process.on('message', (m) => {
  console.log('CHILD got message:', m);
});

process.send({ foo: 'bar' });
