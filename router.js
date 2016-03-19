var Profile = require("./profile.js");
var renderer = require("./renderer.js");

// Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {
  // if URL === "/" && GET
  if(request.url === "/") {
    // show search
    response.writeHead(200, {'Content-Type': 'text/plain'});
    renderer.view("header", {}, response);
    renderer.view("search", {}, response);
    renderer.view("footer", {}, response);
  }
  // if URL == "/"" && POST
    // redirect to /username
}


// Handle HTTP route for GET /username i.e. /chalkers
function user(request, response) {
  // if URL === "/..."
  var username = request.url.replace("/", "");

  if(username.length > 0) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
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
