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