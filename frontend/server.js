const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <h2>Submit Form</h2>
    <form method="POST" action="/submit">
      <input name="name" placeholder="Name" required /><br><br>
      <input name="email" placeholder="Email" required /><br><br>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/submit", async (req, res) => {
  try {
    const response = await axios.post(
      "http://backend:5000/submit",
      req.body
    );
    res.send(response.data);
  } catch (error) {
    res.send("Error submitting data");
  }
});

app.listen(3000, () => {
  console.log("Frontend running on port 3000");
});
