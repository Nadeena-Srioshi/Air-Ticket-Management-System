const signUpFormDOM = document.getElementById("signUpForm");
const emailDOM = document.getElementById("email");
const nameDOM = document.getElementById("name");
const countryCodeDOM = document.getElementById("country-code");
const mobileDOM = document.getElementById("mobile");
const nationalityDOM = document.getElementById("nationality");
const passportDOM = document.getElementById("passport");
const dobDOM = document.getElementById("dob");
const pwDOM = document.getElementById("pw");
const repwDOM = document.getElementById("repw");
const privacyDOM = document.getElementById("privacy");
//const signUpBtn = document.getElementById("signUpBtn");
const alertDOM = document.getElementById("alert");

signUpFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailDOM.value;
  const name = nameDOM.value;
  const genderDOM = document.querySelector('input[name="gender"]:checked');
  const gender = genderDOM.value;
  const countryCode = countryCodeDOM.value;
  const mobile = mobileDOM.value.replace(/\s+/g, "");
  const nationality = nationalityDOM.value;
  const passport = passportDOM.value;
  const dob = dobDOM.value;
  const pw = pwDOM.value;
  const repw = repwDOM.value;
  const privacy = privacyDOM.checked;
  let errors = "";
  alertDOM.textContent = "";

  errors += !email ? "email required<br>" : "";
  errors += email && !validateEmail(email) ? "enter valid email<br>" : "";
  errors += !name ? "enter a name<br>" : "";
  errors += !gender ? "select a gender<br>" : "";
  errors += !countryCode ? "enter a country code<br>" : "";
  errors += !mobile ? "enter a mobile number<br>" : "";
  errors += !nationality ? "enter a nationality<br>" : "";
  errors += !passport ? "enter a passport number<br>" : "";
  errors += !dob ? "enter DOB<br>" : "";
  errors += !pw ? "password required<br>" : "";
  errors += pw && pw.length < 4 ? "minimum password length is 4 characters<br>" : ""; // prettier-ignore
  errors += pw && pw.length > 3 && !repw ? "confirm the password<br>" : "";
  errors += pw && pw.length > 3 && repw && pw !== repw ? "passwords must match<br>" : ""; // prettier-ignore
  errors += !privacy ? "must accept privacy policy<br>" : "";

  if (errors) {
    alertDOM.innerHTML = errors;
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/api/v1/users", {
      email: email,
      name: name,
      gender: gender,
      mobileNumber: countryCode + " " + mobile,
      nationality: nationality,
      passportNumber: passport,
      dob: dob,
      password: pw,
    });
    // nameDOM.value = "";
    // emailDOM.value = "";
    // pwDOM.value = "";
    sessionStorage.setItem("alertNew", "Account successfully created!");
    window.location.href = "/index";
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
