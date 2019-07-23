FROM php:7.2-apache

RUN a2enmod rewrite

COPY dist /var/www/html


