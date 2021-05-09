const router = require("express").Router();

router.post("/", async (req, res, next) => {
  try {
    const { teamName } = req.body;

    // get teams from .env
    const teams = process.env.TEAMS;
    const teamNotFound = " is not part of the team. Modify your .env";

    if (teams) {
      const teamsArray = teams.split(",");
      // find team name
      if (teamsArray.includes(teamName)) {
        return res.send({ success: true });
      }
    }

    return res.status(400).json({ response: teamName + teamNotFound });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
