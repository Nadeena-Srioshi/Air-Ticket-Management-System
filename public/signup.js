const signUpFormDOM = document.getElementById("signUpForm");
const nameDOM = document.getElementById("name");
const emailDOM = document.getElementById("email");
const pwDOM = document.getElementById("pw");
//const signUpBtn = document.getElementById("signUpBtn");
const alertDOM = document.getElementById("alert");

signUpFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameDOM.value;
  const email = emailDOM.value;
  const pw = pwDOM.value;
  let errors = "";

  errors += !name ? "enter a name<br>" : "";
  errors += !email ? "email required<br>" : "";
  errors += email && !validateEmail(email) ? "enter valid email<br>" : "";
  errors += !pw ? "password required<br>" : "";
  errors += pw && pw.length < 4 ? "minimum password length is 4 characters<br>" : ""; // prettier-ignore

  if (errors) {
    alertDOM.innerHTML = errors;
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/api/v1/users", {
      name: name,
      email: email,
      password: pw,
    });
    nameDOM.value = "";
    emailDOM.value = "";
    pwDOM.value = "";
    alertDOM.textContent = "success";
  } catch (error) {
    if (error.response.data.msg) {
      alertDOM.textContent = `${error.response.data.msg}`;
    } else {
      alertDOM.textContent = "failed";
    }
  }
});

const validateEmail = function (email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};
