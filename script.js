const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const signUpForm = document.querySelector(".sign-up-container form");
const signInForm = document.querySelector(".sign-in-container form");

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm.querySelector('input[type="email"]').value;
  const password = signUpForm.querySelector('input[type="password"]').value;

  if (email && password) {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
  } else {
    alert("Lütfen tüm alanları doldurun.");
  }
});

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signInForm.querySelector('input[type="email"]').value;
  const password = signInForm.querySelector('input[type="password"]').value;

  const storedEmail = localStorage.getItem("userEmail");
  const storedPassword = localStorage.getItem("userPassword");

  if (email === storedEmail && password === storedPassword) {
    alert("Giriş başarılı!");
    showUserPanel({ email }); 
  } else {
    alert("Geçersiz email veya şifre.");
  }
});

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

document.getElementById("googleLogin").addEventListener("click", function() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signIn().then(function(googleUser) {
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail(); 
    const givenName = profile.getGivenName(); 

    alert(`Google ile giriş yapıldı: ${email}`); 

    showUserPanel({ email, given_name: givenName }); 
  }).catch(function(error) {
    if (error.error === "popup_closed_by_user") {
      alert("Popup penceresi kapatıldı. Lütfen tekrar deneyin.");
    } else {
      console.error(error);
    }
  });
});


function showUserPanel(user) {
  container.style.display = "none";
  const userPanel = document.getElementById("userPanel");
  userPanel.style.display = "block";

  const welcomeMessage = document.getElementById("welcomeMessage");
  if (user.given_name && user.email) {
    welcomeMessage.textContent = `Welcome, ${user.given_name} (${user.email})`;
  } else if (user.email) {
    welcomeMessage.textContent = `Welcome, ${user.email}`;
  } else {
    welcomeMessage.textContent = `Welcome!`;
  }

  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", logout);
}

function logout() {
  alert("Çıkış yapıldı!");
  const userPanel = document.getElementById("userPanel");
  userPanel.style.display = "none";
  container.style.display = "block";
}

window.onload = function() {
  gapi.load("auth2", function() {
    gapi.auth2.init({
      client_id: "615200215773-ve0eaneo5uuaj57gr8e5l9nl10s0ej2t.apps.googleusercontent.com"
    }).then(function () {
      document.getElementById("googleLogin").addEventListener("click", function() {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signIn().then(function(googleUser) {
          const profile = googleUser.getBasicProfile();
          const email = profile.getEmail();
          alert(`Google ile giriş yapıldı: ${email}`); 
          showUserPanel({ email }); 
        }).catch(function(error) {
          if (error.error === "popup_closed_by_user") {
            alert("Popup penceresi kapatıldı. Lütfen tekrar deneyin.");
          } else {
            console.error(error);
          }
        });
      });
    });
  });
  
  function handleCredentialResponse(response) {
    const credential = response.credential; 
    const user = parseJwt(credential); 

    console.log("Encoded JWT ID token: " + credential);
    console.log("User Info: ", user); 

    showUserPanel({ email: user.email }); 
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64); 
  }
};
