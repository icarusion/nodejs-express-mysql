# 创建用户
CREATE USER 'demotable'@'%' IDENTIFIED BY 'demotable';

# 删除匿名用户
DELETE FROM mysql.user WHERE user='';

# 创建数据库
CREATE DATABASE demotable DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

# 为用户赋予操作数据库的权限
GRANT ALL ON demotable.* TO 'demotable'@'%';