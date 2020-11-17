<h1>Pra quem vai fazer Projeto</h1>

<h5>Fazer um Inventário de Informática:</h5>

<ol>
  <li>Banco Cloud</li>
  <li>Responsível</li>
  <li>Rastreabilidade</li>
  <li>Parametros: 
    <ol>
      <li>Tombamento</li>
      <li>Nome item</li>
      <li>Marcar</li>
      <li>Modelo</li>
      <li>Responsável</li>
      <li>Data de Tombamento</li>
      <li>Modelo</li>
    </ol>
  </li>
</ol>

<div style="display:flex;">
  Observação: &nbsp; <p style="color:red;">Pra saber qual foi a ultima movimentação, por exemplo.</p>
</div>

<pre>
$ openssl genrsa 2048 > ca-key.pem
$ openssl req -new -x509 -nodes -days 3600 -key ca-key.pem -out ca.pem

$ openssl req -newkey rsa:2048 -days 3600 -nodes -keyout server-key.pem -out server-req.pem
$ openssl rsa -in server-key.pem -out server-key.pem
$ openssl x509 -req -in server-req.pem -days 3600 -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out server-cert.pem

$ openssl req -newkey rsa:2048 -days 3600 -nodes -keyout client-key.pem -out client-req.pem
$ openssl rsa -in client-key.pem -out client-key.pem
$ openssl x509 -req -in client-req.pem -days 3600 -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out client-cert.pem

$ openssl verify -CAfile ca.pem server-cert.pem client-cert.pem
server-cert.pem: OK
client-cert.pem: OK
</pre>

obs: The Common Name value used for the server and client certificates/keys must each differ from the Common Name value used for the CA certificate. Otherwise, the certificate and key files will not work for servers compiled using OpenSSL.

<pre>
$ sudo su
# sudo mkdir -p /var/lib/mysql/certs
# mv * /var/lib/mysql/certs/
# exit
exit
$ sudo nano /etc/mysql/mysql.conf.d/mysql.cnf
#
# The MySQL database server configuration file.
#
# One can use all long options that the program supports.
# Run program with --help to get a list of available options and with
# --print-defaults to see which it would actually understand and use.
#
# For explanations see
# http://dev.mysql.com/doc/mysql/en/server-system-variables.html

# Here is entries for some specific programs
# The following values assume you have at least 32M ram

[mysqld]
#
# * Basic Settings
#
user            = mysql
# pid-file      = /var/run/mysqld/mysqld.pid
# socket        = /var/run/mysqld/mysqld.sock
port            = 3306
# datadir       = /var/lib/mysql


# If MySQL is running as a replication slave, this should be
# changed. Ref https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_tmpdir
# tmpdir                = /tmp
#
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
bind-address            = 0.0.0.0

# -- add line --
# Type your own certificates directory
ssl-ca=/var/lib/mysql/certs/ca.pem
ssl-cert=/var/lib/mysql/certs/server-cert.pem
ssl-key=/var/lib/mysql/certs/server-key.pem

[client]
ssl-ca=/var/lib/mysql/certs/ca.pem
ssl-cert=/var/lib/mysql/certs/client-cert.pem
ssl-key=/var/lib/mysql/certs/client-key.pem

[mysqld]
# -- end add line --

#
# * Fine Tuning
#
key_buffer_size         = 16M
# max_allowed_packet    = 64M
# thread_stack          = 256K

# thread_cache_size       = -1

# This replaces the startup script and checks MyISAM tables if needed
# the first time they are touched
myisam-recover-options  = BACKUP

max_connections        = 2

# table_open_cache       = 4000

#
# * Logging and Replication
#
# Both location gets rotated by the cronjob.
#
# Log all queries
# Be aware that this log type is a performance killer.
# general_log_file        = /var/log/mysql/query.log
# general_log             = 1
#
# Error log - should be very few entries.
#
log_error = /var/log/mysql/error.log
#
# Here you can see queries with especially long duration
# slow_query_log                = 1
# slow_query_log_file   = /var/log/mysql/mysql-slow.log
# long_query_time = 2
# log-queries-not-using-indexes
#
# The following can be used as easy to replay backup logs or for replication.
# note: if you are setting up a replication slave, see README.Debian about
#       other settings you may need to change.
# server-id             = 1
# log_bin                       = /var/log/mysql/mysql-bin.log
# binlog_expire_logs_seconds    = 2592000
max_binlog_size   = 100M
# binlog_do_db          = include_database_name
# binlog_ignore_db      = include_database_name
</pre>

create user
<pre>
$ mysql -u root -p
mysql> create user 'victor'@'%' identified by '' REQUIRE X509;
Query OK, 0 rows affected (0.02 sec)
mysql> grant all privileges on *.* to 'victor'@'%';
Query OK, 0 rows affected (0.01 sec)
mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.02 sec)
mysql> exit
Bye
</pre>

connect
<pre>
mysql -h [HOST] -u victor \ 
--ssl-ca=ca.pem \
--ssl-cert=client-cert.pem \
--ssl-key=client-key.pem -p
</pre>

sql
<pre>
DROP DATABASE IF EXISTS `projeto`;
CREATE DATABASE `projeto` CHAR SET `utf8mb4`;

USE `projeto`;

DROP TABLE IF EXISTS `colaborador`;
CREATE TABLE `colaborador` (
    `id` BIGINT AUTO_INCREMENT,
    `nome` LONGTEXT NOT NULL, #encrypt
    `cpf` LONGTEXT NOT NULL, #encrypt
    `email` LONGTEXT NOT NULL, #encrypt
    PRIMARY KEY(`ID`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 ;

DROP TABLE IF EXISTS `marca`;
CREATE TABLE `marca` (
    `id` BIGINT AUTO_INCREMENT,
    `nome` LONGTEXT NOT NULL, #encrypt
    PRIMARY KEY(`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 ;

DROP TABLE IF EXISTS `iten`;
CREATE TABLE `iten` (
    `id` BIGINT AUTO_INCREMENT,
    `nome` LONGTEXT NOT NULL, #encrypt
    `modelo` LONGTEXT NOT NULL, #encrypt
    `marca` BIGINT NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`marca`) REFERENCES `marca`(`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 ;

DROP TABLE IF EXISTS `aluguel`;
CREATE TABLE `aluguel` (
    `id` BIGINT AUTO_INCREMENT,
    `colaborador` BIGINT NOT NULL,
    `iten` BIGINT NOT NULL,
    `crated_at` DATETIME NOT NULL,
    `expiration_at` DATETIME NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`colaborador`) REFERENCES `colaborador`(`id`),
    FOREIGN KEY (`iten`) REFERENCES `iten`(`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 ;
</pre>