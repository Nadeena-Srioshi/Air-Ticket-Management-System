//const notFound = (req, res) => res.status(404).send("Route does not exist");

const notFound = (req, res) => res.redirect(302, "/error-page");

module.exports = notFound;