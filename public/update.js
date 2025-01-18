const updateFormDOM = document.getElementById("updateForm");
const emailDOM = document.getElementById("email");
const nameDOM = document.getElementById("name");
const countryCodeDOM = document.getElementById("country-code");
const mobileDOM = document.getElementById("mobile");
const nationalityDOM = document.getElementById("nationality");
const passportDOM = document.getElementById("passport");
const dobDOM = document.getElementById("dob");
const alertDOM = document.getElementById("alert");

updateFormDOM.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailDOM.value;
  const name = nameDOM.value;
  const genderDOM = document.querySelector('input[name="gender"]:checked');
  const gender = genderDOM.value;
  const countryCode = countryCodeDOM.value;
  const mobile = mobileDOM.value;
  const nationality = nationalityDOM.value;
  const passport = passportDOM.value;
  const dob = dobDOM.value;
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

  if (errors) {
    alertDOM.innerHTML = errors;
    return;
  }

  try {
    const userFetch = await axios.get(
      "http://localhost:3000/api/v1/users/current"
    );
    console.log(userFetch.data.user._id);

    if (!userFetch) {
      throw new Error("no active session");
    }

    const response = await axios.patch(
      `http://localhost:3000/api/v1/users/${userFetch.data.user._id}`,
      {
        email: email,
        name: name,
        gender: gender,
        mobileNumber: countryCode + " " + mobile,
        nationality: nationality,
        passportNumber: passport,
        dob: dob,
      }
    );
    //alertDOM.textContent = "success";
    window.location.href = "/profile";
  } catch (error) {
    if (error.response.data.msg) {
      alertDOM.textContent = `${error.response.data.msg}`;
    } else {
      alertDOM.textContent = "failed to update";
    }
    console.log(error);
  }
});

const validateEmail = function (email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};
