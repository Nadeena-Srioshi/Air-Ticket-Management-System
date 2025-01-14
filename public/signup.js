const signUpFormDOM = document.getElementById("signUpForm");
const nameDOM = document.getElementById("name");
const emailDOM = document.getElementById("email");
const pwDOM = document.getElementById("pw");
//const signUpBtn = document.getElementById("signUpBtn");
const alertDOM = document.getElementById("alert");

signUpFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameDOM.value;
  const email = emailDOM.value;
  const pw = pwDOM.value;

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
    alertDOM.textContent = `${error.response.data.msg}`;
  }
});
