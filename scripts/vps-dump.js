const { Client } = require('ssh2');

const cmd = `
mysql -e "GRANT PROCESS ON *.* TO 'ya7edu_user'@'%'; GRANT PROCESS ON *.* TO 'ya7edu_user'@'localhost'; FLUSH PRIVILEGES;"
mysqldump --no-tablespaces -u ya7edu_user -pZeCqPDTSfSjY ya7edu_db > /root/ya7edu_complete_dump.sql
ls -lh /root/ya7edu_complete_dump.sql
head -n 25 /root/ya7edu_complete_dump.sql
`;

const conn = new Client();
conn.on('ready', () => {
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end());
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
  });
}).connect({
  host: '107.173.52.132',
  port: 22,
  username: 'root',
  password: 'ZeCqPDTSfSjY'
});

