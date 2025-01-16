const signInFormDOM = document.getElementById("signInForm");
const emailDOM = document.getElementById("email");
const pwDOM = document.getElementById("pw");
//const signInBtn = document.getElementById("signInBtn");
const alertDOM = document.getElementById("alert");

signInFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailDOM.value;
  const pw = pwDOM.value;
  let errors = "";

  errors += !email ? "email required<br>" : "";
  errors += email && !validateEmail(email) ? "enter valid email<br>" : "";
  errors += !pw ? "password required<br>" : "";

  if (errors) {
    alertDOM.innerHTML = errors;
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/users/auth",
      {
        email: email,
        password: pw,
      }
    );
    if (response.status === 200) {
      const user = response.data.user;
      window.location.href = "/index";
    } else {
      alertDOM.textContent = "failed (not 200)";
    }
  } catch (error) {
    // emailDOM.value = "";
    // pwDOM.value = "";
    alertDOM.textContent = `${error.response.data.msg}`;
  }
});

const validateEmail = function (email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};
