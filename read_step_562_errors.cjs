const fs = require('fs');
const readline = require('readline');

const logFilePath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c0489d3f-5c96-45e1-9a12-b2a5cff58052\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logFilePath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    // Print lines containing browser subagent tool output that has errors
    const str = JSON.stringify(data).toLowerCase();
    if (str.includes('vendors.jsx') && (str.includes('error') || str.includes('exception') || str.includes('fail') || str.includes('uncaught'))) {
      console.log(`--- MATCH IN STEP ${data.step_index} (${data.type}) ---`);
      // print first 2000 chars of the content/tool output
      console.log(JSON.stringify(data, null, 2).substring(0, 3000) + '\n...\n');
    }
  } catch (e) {}
});
