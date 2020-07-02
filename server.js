// importing modules
const http = require('http');   // http module
const url = require('url');     // url module
const path = require('path');   // path module
const fs = require('fs');       // file system module

// set the type of files we want to serve
// here we are creating a js object which is a container for
// name/value pairs called properties or methods
// objects can contain many values assigned to one variable
const mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};

// use the createServer method to make a new server
// make sure to pass in the function(req, res) and then proceed
// with the function operations
http.createServer(function(req, res){
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log('Loading '+ uri);
	var stats;

	// if the file is found, then this command will execute
	try{
		stats = fs.lstatSync(fileName);
	// if not found, we will send a 404 error
	} catch(e){
		res.writeHead(404, {'Content-type': 'text/plain'});
		res.write('404 Not Found\n');
		res.end();
		return;
	}

	// getting the extension of the file path to see what kind of
  // file it is that we are working with
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200, {'Content-type': mimeType});

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if(stats.isDirectory()) {
		res.writeHead(302, {
			'Location': 'index.html'      // if we are in a directory w/ no filename,
		});                             // load the index.html file
		res.end();
	} else {
		res.writeHead(500, {'Content-type':'text/plain'});
		res.write('500 Internal Error\n');   // if not file/directory, internal error
		res.end();
	}

}).listen(1337);
