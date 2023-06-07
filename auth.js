async function authenticate(event) {
  event.preventDefault();
  let username = document.getElementById("InputBasicTextUsername").value;
  let password = document.getElementById("InputBasicTextPassword").value;

  let url = "https://api.mumuxiang.cloud/api/token";
  let data = {
    username: username,
    password: password
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    let data = await response.json(); //parse JSON response to an object
    sessionStorage.setItem("accessToken", data.data.access_token); //store the token in session storage
    window.location.href = "tutorial.html";
  } else {
    alert("Authentication failed. Please check your username and password.");
  }
}
