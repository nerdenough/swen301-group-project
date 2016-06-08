#!/bin/bash
MARIADB_VERSION=10.1
ROOT_PASS=root
DB_USER=vagrant
DB_PASS=vagrant
DB_NAME=vagrant

# setup
apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db
add-apt-repository "deb http://mirror.aarnet.edu.au/pub/MariaDB/repo/$MARIADB_VERSION/ubuntu trusty main"

debconf-set-selections <<< "mariadb-server-$MARIADB_VERSION mysql-server/root_password password $ROOT_PASS"
debconf-set-selections <<< "mariadb-server-$MARIADB_VERSION mysql-server/root_password_again password $ROOT_PASS"
echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | debconf-set-selections
echo "phpmyadmin phpmyadmin/app-password-confirm password $ROOT_PASS" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/admin-pass password $ROOT_PASS" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/app-pass password $ROOT_PASS" | debconf-set-selections
echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect none" | debconf-set-selections

apt-get update
apt-get install -y vim software-properties-common build-essential
apt-get install -y apache2 php5 libapache2-mod-php5 php5-mcrypt
apt-get install -y mariadb-server phpmyadmin

sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/my.cnf

mysql -uroot -p$ROOT_PASS -e "CREATE USER '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS';"
mysql -uroot -p$ROOT_PASS -e "CREATE DATABASE $DB_NAME DEFAULT CHARACTER SET utf8;"
mysql -uroot -p$ROOT_PASS -e "GRANT ALL ON $DB_NAME.* TO '$DB_USER'@'%'; FLUSH PRIVILEGES;"
mysql -uroot -p$ROOT_PASS $DB_NAME < /var/www/swen301-group-project/data/db.sql

service mysql restart

echo "Setup complete!"
echo "Username: $DB_USER"
echo "Password: $DB_PASS"
echo "Database: $DB_NAME"
