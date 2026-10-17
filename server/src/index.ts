import "./lib/env";
import app from "./app";
import "./lib/seed";

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
