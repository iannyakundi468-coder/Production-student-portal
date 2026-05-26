const { execSync } = require('child_process');
const fs = require('fs');

try {
  const result = execSync('git log -n 5 --name-status', { cwd: '/home/thealpha/Desktop/student portal', stdio: 'pipe' });
  fs.writeFileSync('/home/thealpha/Desktop/student portal/git-log.txt', result.toString());
} catch (error) {
  fs.writeFileSync('/home/thealpha/Desktop/student portal/git-log.txt', error.toString());
}
