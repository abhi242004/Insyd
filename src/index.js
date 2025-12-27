import "./workflows/router.workflow.js";
import "dotenv/config";
import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Lead Automation running on port ${PORT}`);
});
