const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;

// Endpoint to handle requests for specific data
app.get('/data', async (req, res) => {
  // Extracting parameters 'n' and 'm' from the query string
  const { n, m } = req.query;

  // Checking if the required parameter 'n' is present
  if (!n) {
    return res.status(400).send('Parameter n is required.');
  }

  // Constructing the file path based on the value of 'n'
  const filePath = path.join('data', `${n}.txt`);

  try {
    // Checking if 'm' is provided to read a specific line
    if (m) {
      // Reading a specific line and sending it as the response
      const lineContent = await readSpecificLine(filePath, parseInt(m, 10));
      res.send(lineContent);
    } else {
      // Streaming the entire file if 'm' is not provided
      const readStream = fs.createReadStream(filePath, 'utf8');
      readStream.pipe(res);
    }
  } catch (err) {
    // Handling errors and sending an appropriate response
    res.status(500).send(`Error reading file: ${err.message}`);
  }
});

// Function to read a specific line from a file
async function readSpecificLine(filePath, lineNumber) {
  return new Promise((resolve, reject) => {
    // Creating a readable stream for the file
    const readStream = fs.createReadStream(filePath, 'utf8');
    let currentLine = 0;

    // Event listener for 'data' event, triggered when data is read from the file
    readStream.on('data', (chunk) => {
      // Splitting the chunk into lines
      const lines = chunk.split('\n');

      // Iterating through each line in the chunk
      for (const line of lines) {
        currentLine++;

        // Checking if the current line matches the specified line number
        if (currentLine === lineNumber) {
          // Closing the stream and resolving with the line content
          readStream.close();
          resolve(line);
          return;
        }
      }
    });

    // Event listener for 'close' event, triggered when the stream is closed
    readStream.on('close', () => {
      // Rejecting with an error if the specified line number is not found
      reject(new Error(`Line ${lineNumber} not found in file.`));
    });

    // Event listener for 'error' event, triggered in case of any error during the read
    readStream.on('error', (err) => {
      // Rejecting with the encountered error
      reject(err);
    });
  });
}

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
