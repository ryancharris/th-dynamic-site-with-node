var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");
var commonHeaders = {'Content-Type': 'text/html'};

// Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {
  // if URL === "/" && GET
  if(request.url === "/") {
    // IF http method is GET
    if(request.method.toLowerCase() === "get") {
      // show search
      response.writeHead(200, commonHeaders);
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else {
      // if URL == "/"" && POST

      // get the POST data from body
      request.on("data", function(postBody) {
        var query = querystring.parse(postBody.toString());
        response.writeHead(303, {"Location": "/" + query.username});
        response.end();
      });
      // extract the username
        // redirect to /username

    }
  }
}


// Handle HTTP route for GET /username i.e. /chalkers
function user(request, response) {
  // if URL === "/..."
  var username = request.url.replace("/", "");

  if(username.length > 0) {
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);

    // get JSON from treehouse
    var studentProfile = new Profile(username);

    // on "end"
    studentProfile.on("end", function(profileJSON){
      // show profile

      // store the values which we need
      var values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      };
      // Simple response
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();

    });


    // on "error"
    studentProfile.on("error", function(error){
      // display error
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    });

  }
}

module.exports.home = home;
module.exports.user = user;
