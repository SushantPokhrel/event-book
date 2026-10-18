import "./lib/env.js";
import app from "./app.js";
import "./lib/seed.js";

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
