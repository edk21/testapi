const express = require('express');
const { exec } = require('child_process');
const app = express();

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

app.listen(3000, () => console.log('Server running on port 3000'));
