const { Client } = require('ssh2');

function runRemoteCommand(command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        let stdout = '';
        let stderr = '';
        stream.on('close', (code, signal) => {
          conn.end();
          resolve({ code, signal, stdout, stderr });
        });
        stream.on('data', (data) => {
          stdout += data.toString();
        });
        stream.stderr.on('data', (data) => {
          stderr += data.toString();
        });
      });
    }).on('error', (err) => {
      reject(err);
    }).connect({
      host: '107.173.52.132',
      port: 22,
      username: 'root',
      password: 'ZeCqPDTSfSjY'
    });
  });
}

const cmd = process.argv.slice(2).join(' ') || 'uname -a';
runRemoteCommand(cmd)
  .then(res => {
    if (res.stdout) console.log(res.stdout);
    if (res.stderr) console.error(res.stderr);
    process.exit(res.code || 0);
  })
  .catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
  });

