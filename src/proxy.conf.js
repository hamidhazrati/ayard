module.exports = [
  {
    context: ['/config'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
  },
];
