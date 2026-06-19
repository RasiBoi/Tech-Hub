const fs = require('fs');
const filePath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c0489d3f-5c96-45e1-9a12-b2a5cff58052\\scratch\\step_562.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log('Keys:', Object.keys(data));
if (data.tool_calls) {
  console.log('tool_calls type:', typeof data.tool_calls);
}
console.log('type:', data.type);
console.log('status:', data.status);
console.log('content length:', data.content ? data.content.length : 0);
