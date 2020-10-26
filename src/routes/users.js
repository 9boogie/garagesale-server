const router = require("express").Router();

const checkUserExists = (user, db) => {
  const queryString =`
    SELECT username 
    FROM users 
    WHERE username = $1`;
  const queryParams = [user.username];
  return db.query(queryString, queryParams)
    .then(data => {
      const matchingUser = data.rows;
      if (matchingUser.length > 0) {
        return true;
      }
      return false;
    })
};

const findUser = async (username, db) => {
  const queryString = `
    SELECT * 
    FROM users 
    WHERE username = $1;`;
  const data = await db.query(queryString, [username]);
  const user = data.rows[0];
  return user;
};

const verifyPassword = async (username, password, db) => {
  const user = await findUser(username, db);
  if (password === user.password) {
    return user.id;
  } else {
    return null;
  }
};

module.exports = db => {
  router.get("/", (req, res) => {
    db.query(`
      SELECT username
      FROM users;`)
      .then(data => {
        const listOfUsers = data.rows
        res.json({listOfUsers})
      })
      .catch(err => console.log('query Error', err))
  });

  router.post("/login", async (req, res) => {
    const user = req.body;
    try {
      const userExists = await checkUserExists(user, db);
      if (userExists) {
        const loggedInUserID = await verifyPassword(user.username, user.password, db);
        if (loggedInUserID) {
          req.session.userID = loggedInUserID;
          return res.redirect('/')
        }
        return res
          .status(401)
          .json({ message: "Invalid password" });
      }else{
        return res
          .status(401)
          .json({ message: "Invalid username" });
      }
    } catch (e) {
      return res
        .status(500)
        .json({ message: e.message });
    }
    
  });
  
  router.post('/logout', (req, res) => {
    req.session = null;
    return res
      .json({ message: "Succesfully logged out" });
  })

  return router;
};