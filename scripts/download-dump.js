const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastGet('/root/ya7edu_complete_dump.sql', 'prisma/ya7edu_complete_dump.sql', (getErr) => {
      if (getErr) throw getErr;
      console.log('Successfully saved prisma/ya7edu_complete_dump.sql locally.');
      conn.end();
    });
  });
}).connect({
  host: '107.173.52.132',
  port: 22,
  username: 'root',
  password: 'ZeCqPDTSfSjY'
});

