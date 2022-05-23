
var limitWarningEl = document.querySelector("#limit-warning");
//DOM reference to update <span id="repo-name"> container in HTML
var repoNameEl = document.querySelector("#repo-name");
 
//reference to issues container, to append displayIssues to actual page
var issueContainerEl = document.querySelector("#issues-container");

//extracts query value from query string in the api call function getRepoIssues
//(divs on single page show issues from repo clicked on index)
var getRepoName = function() {

    //grab repo name from url query string
    var queryString = document.location.search;
  var repoName = queryString.split("=")[1];

  //pass repoName into getRepoIssues, will fetch the related issues from api endpoint
  // getRepoIssues(repoName);
  //puts repoName in the <span id #repo-name)
  // repoNameEl.textContent = repoName;

  //conditional statement that checks if repoName exists (instead of code above)
  if(repoName) {
      //display repo name on the page
      repoNameEl.textContent = repoName;
      getRepoIssues(repoName);
  }
  //redirects back to homepage if repoName doesnt exist
   else {
       document.location.replace("./index.html");
   }
};

var getRepoIssues = function (repo) {
  console.log(repo);
  //get issues from api endpoint 6.3.4
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  //make a get request to url
  fetch(apiUrl).then(function (response) {
    //request was successful
    if (response.ok) {
      response.json().then(function (data) {
        //pass response data to DOM function
        displayIssues(data);

        //check if api has paginated issues (more than 30)
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
        //if not successful, redirect to homepage
        document.location.replace("./index.html");
    }
  });
};

//turning Github issue data into DOM elements
var displayIssues = function (issues) {
  //checks if there are any open issues
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues.";
    return;
  }

  //loops through issues and creates a div on HTML for each issue
  for (var i = 0; i < issues.length; i++) {
    //create link element "a" to take users to issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    //opens link in new tab instead of replacing current webpage
    issueEl.setAttribute("target", "_blank");

    //create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type element(issue/pull request)
    var typeEl = document.createElement("span");

    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl);
    //appends all to issues container
    issueContainerEl.appendChild(issueEl);
  }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    //link element 
    var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on GitHub.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // append to warning container
  limitWarningEl.appendChild(linkEl);
  };

  getRepoName();
getRepoIssues();
