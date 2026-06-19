const fs = require('fs');
const filePath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c0489d3f-5c96-45e1-9a12-b2a5cff58052\\scratch\\step_562.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Search for step 52 in the subagent's detailed actions
const jsonString = JSON.stringify(data);
// Let's find step 52 or capture_browser_console_logs output in the raw logs
const lines = content = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c0489d3f-5c96-45e1-9a12-b2a5cff58052\\.system_generated\\logs\\transcript.jsonl', 'utf8').split('\n');

for (const line of lines) {
  if (line.includes('2C5E51B0BC9B1890FBC7B72C8CEFD99F') && line.includes('console')) {
    console.log('--- FOUND RAW LINE ---');
    console.log(line.substring(0, 4000) + '...\n');
  }
}
