FROM php:8.2-apache

RUN a2enmod rewrite headers \
    && docker-php-ext-install pdo pdo_mysql

RUN sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

WORKDIR /var/www/html
