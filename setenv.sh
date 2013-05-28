#Simulate the Stackato container environment
export DATABASE_URL=mysql://root:secret_password@127.0.0.1:3306/wordpress
export DATABASE_ALWAYS_REFRESH="true"
export DATABASE_SQL_DUMP="/vagrant/src/db/wordpress.master.sql"
export STACKATO_APP_ROOT=/home/vagrant
export STACKATO_DOCUMENT_ROOT=/home/vagrant/dist
