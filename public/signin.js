const signInFormDOM = document.getElementById("signInForm");
const emailDOM = document.getElementById("email");
const pwDOM = document.getElementById("pw");
//const signInBtn = document.getElementById("signInBtn");
const alertDOM = document.getElementById("alert");

signInFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailDOM.value;
  const pw = pwDOM.value;

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
      window.location.href = "/dashboard";
    } else {
      alertDOM.textContent = "failed (not 200)";
    }
  } catch (error) {
    // emailDOM.value = "";
    // pwDOM.value = "";
    alertDOM.textContent = `${error.response.data.msg}`;
  }
});
