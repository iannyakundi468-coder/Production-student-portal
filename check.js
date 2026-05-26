const { execSync } = require('child_process');
const fs = require('fs');
try {
  const out = execSync('git status', { cwd: '/home/thealpha/Desktop/student portal' });
  fs.writeFileSync('/home/thealpha/Desktop/student portal/git-status.txt', out.toString());
} catch(e) {
  fs.writeFileSync('/home/thealpha/Desktop/student portal/git-status.txt', e.stdout ? e.stdout.toString() + '\n' + e.message : e.message);
}
