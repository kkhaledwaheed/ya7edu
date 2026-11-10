const { Client } = require('ssh2');

const sqlCommands = `
CREATE DATABASE IF NOT EXISTS ya7edu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'ya7edu_user'@'%' IDENTIFIED BY 'ZeCqPDTSfSjY';
CREATE USER IF NOT EXISTS 'ya7edu_user'@'localhost' IDENTIFIED BY 'ZeCqPDTSfSjY';
ALTER USER 'ya7edu_user'@'%' IDENTIFIED WITH mysql_native_password BY 'ZeCqPDTSfSjY';
ALTER USER 'ya7edu_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ZeCqPDTSfSjY';
GRANT ALL PRIVILEGES ON ya7edu_db.* TO 'ya7edu_user'@'%';
GRANT ALL PRIVILEGES ON ya7edu_db.* TO 'ya7edu_user'@'localhost';
FLUSH PRIVILEGES;
`;

const bashScript = `
sed -i 's/^bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
sed -i 's/^mysqlx-bind-address.*/mysqlx-bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql
mysql << 'EOF'
${sqlCommands}
EOF
mysql -e "SHOW DATABASES; SELECT User, Host, plugin FROM mysql.user WHERE User='ya7edu_user';"
`;

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS via SSH. Configuring MySQL...');
  conn.exec(bashScript, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Script completed with code:', code);
      conn.end();
    });
    stream.on('data', data => process.stdout.write(data.toString()));
    stream.stderr.on('data', data => process.stderr.write(data.toString()));
  });
}).on('error', err => {
  console.error('SSH Connection error:', err);
}).connect({
  host: '107.173.52.132',
  port: 22,
  username: 'root',
  password: 'ZeCqPDTSfSjY'
});

