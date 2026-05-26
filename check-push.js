const { execSync } = require('child_process');
const fs = require('fs');

try {
  const result = execSync('git push --dry-run origin master', { cwd: '/home/thealpha/Desktop/student portal', stdio: 'pipe' });
  fs.writeFileSync('/home/thealpha/Desktop/student portal/push-result.txt', `STDOUT:\n${result.toString()}`);
} catch (error) {
  fs.writeFileSync('/home/thealpha/Desktop/student portal/push-result.txt', `ERROR:\n${error.message}\nSTDOUT:\n${error.stdout ? error.stdout.toString() : ''}\nSTDERR:\n${error.stderr ? error.stderr.toString() : ''}`);
}
