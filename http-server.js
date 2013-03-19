var connect = require('connect');

var port = process.env.PORT || 3001;
var host = process.env.VCAP_APP_HOST || "127.0.0.1";

var app = connect()
  .use(connect.logger())
  .use(connect.static(__dirname + '/dist', { maxAge: 0 }))
  .listen(port, host);
console.log("Listening on http://%s:%d", host, port);