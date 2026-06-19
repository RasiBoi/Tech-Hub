const fs = require('fs');

const logFilePath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c0489d3f-5c96-45e1-9a12-b2a5cff58052\\.system_generated\\logs\\transcript.jsonl';
const outFilePath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c0489d3f-5c96-45e1-9a12-b2a5cff58052\\scratch\\step_562.json';

const content = fs.readFileSync(logFilePath, 'utf8');
const lines = content.split('\n');
for (const line of lines) {
  try {
    const data = JSON.parse(line);
    if (data.step_index === 562) {
      fs.writeFileSync(outFilePath, JSON.stringify(data, null, 2), 'utf8');
      console.log('Successfully wrote step 562 to step_562.json');
      break;
    }
  } catch (e) {}
}
