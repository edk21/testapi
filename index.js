const express = require("express");
const app = express();
require("dotenv").config({ path: "./config.env" });
const { exec } = require('child_process');

const cors = require("cors");

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.json({msg: "Welcome to my Shop, please look around, Thanks"})
})

app.post('/startJob', (req, res) => {
    // Use the Flink CLI to start the job
    exec('/path/to/flink/bin/flink run /path/to/job.jar', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to start job');
      } else {
        console.log(stdout);
        // Poll Flink's REST API to get job status
        setTimeout(() => {
          exec('/path/to/flink/bin/flink list -r', (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              res.status(500).send('Failed to get job status');
            } else {
              console.log(stdout);
              res.send(stdout);
            }
          });
        }, 5000); // Wait 5 seconds before checking job status
      }
    });
  });

  const axios = require('axios');

// Flink REST API URL
const flinkUrl = 'http://localhost:8081';

// Retrieve Flink cluster status
async function getClusterStatus() {
  const response = await axios.get(`${flinkUrl}/overview`);
  return response.data;
}

// Submit a Flink job
async function submitJob(jarPath, className) {
  const response = await axios.post(`${flinkUrl}/jars/${jarPath}/run`, {
    entryClass: className,
    allowNonRestoredState: true // set to true if the job can resume from a savepoint
  });
  return response.data;
}

// Cancel a running Flink job
async function cancelJob(jobId) {
  const response = await axios.patch(`${flinkUrl}/jobs/${jobId}`, {
    cancel: true
  });
  return response.data;
}


