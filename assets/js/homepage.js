

var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
//for event listener for all buttons with language-buttons class
var languageButtonsEl = document.querySelector("#language-buttons");

// search bar input
var formSubmitHandler = function(event) {
  event.preventDefault();
//gets value from nameInputEl
  var username = nameInputEl.value.trim();

    if (username) {
      getUserRepos(username);
//clears the form after search
      repoContainerEl.textContent = "";
      nameInputEl.value = "";
    } else {
      alert("Pleae enter a gitHub username");
    }
  console.log(event);
};


//function to fetch from API
var getUserRepos = function(user) {
  var apiUrl = "https://api.github.com/users/" + user + "/repos";
  
  fetch(apiUrl)
    .then(function(response) {
//log an error for bad search/search with no repo
      if (response.ok) {
        response.json().then(function(data) { 
//when response data is converted to JSON, it gets sent from getUserRepos to displayRepos
            console.log(data);
            displayRepos(data, user);
          });
        } else {
          alert("Error: GitHub user not found");
        }
    })
//catch network errors
      .catch(function(error) {
        alert("Unable to connect to GitHub");
      });
}; 

//accepts the array of repository data, and the term we searched for as parameters
var displayRepos = function(repos, searchTerm) {
//check if api returned has any repos
    if (repos.length === 0) {
      repoContainerEl.textContent = "No repositories found.";
      return;
    }
//clear old content from repos display

repoSearchTerm.textContent = searchTerm;


//loop over repos
for (var i = 0; i < repos.length; i++) {
//format repo name
var repoName = repos[i].owner.login + "/" + repos[i].name;

//create a container for each repo
var repoEl = document.createElement("a");
repoEl.classList = "list-item flex-row justify-space-between align-center";
//creates link to link to single-repo page 6.4.4
repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

//create a span element to hold repo name
var titleEl = document.createElement("span");
titleEl.textContent = repoName;
//append to container repoEl
repoEl.appendChild(titleEl);

// create a status element
var statusEl = document.createElement("span");
statusEl.classList = "flex-row align-center";

// check if current repo has issues or not
if (repos[i].open_issues_count > 0) {
  statusEl.innerHTML =
    "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
} else {
  statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
}
// append to container repoEl
repoEl.appendChild(statusEl);
//append container to the dom
repoContainerEl.appendChild(repoEl);
}
//end for loop
};

//function to get featured repos from button choices for language
var getFeaturedRepos = function(language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data.items, language);
        console.log(response);
      });
    } else {
      alert('Error: GitHub User Not Found');
    }
  });
};


userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);