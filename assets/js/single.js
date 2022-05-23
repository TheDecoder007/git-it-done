
//reference to issues container, to append displayIssues to actual page
var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function(repo) {
    console.log(repo);
//get issues from api endpoint 6.3.4
var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

//make a get request to url
    fetch(apiUrl).then(function(response) {
    //request was successful
    if (response.ok) {
        response.json().then(function(data) {
//pass response data to DOM function
            displayIssues(data);
        });
    } else {
        alert("There was a problem with your request.");
    }
    });

};

//turning Github issue data into DOM elements
    var displayIssues = function(issues) {

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

    

getRepoIssues("thedecoder007");