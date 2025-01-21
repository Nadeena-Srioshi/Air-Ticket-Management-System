const printAll = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/users");
    const data = response.data;
    res.render("printall", { users: data.users, userCount: data.users.length });
  } catch (error) {
    res.render("printall", { users: [], error: "unable to fetch users" });
    console.log(error);
  }
}; //just for testing, require axios

const remove = async (req, res) => {
  try {
    await axios.delete(
      `http://localhost:3000/api/v1/users/${req.session.user._id}`
    );
    req.session.destroy();
    res.redirect(302, "/index");
  } catch (error) {
    res.status(500).json({ msg: "failed to delete" });
    console.log(error);
  }
}; //unused function, making the api call directly from frontend
