Proyecto LISW 2013
==================
Para ejecutarlo correr en consola

    python manage.py runserver

y luego abrir en navegador [http://localhost:8000/lisw/](http://localhost:8000/lisw/)

La descripcion de la api REST esta en [http://localhost:8000/lisw/api/v1/?format=json](http://localhost:8000/lisw/api/v1/?format=json)

ejemplos:
 - Notas [http://localhost:8000/lisw/api/v1/notes/?format=json](http://localhost:8000/lisw/api/v1/notes/?format=json)
 - Usuario [http://localhost:8000/lisw/api/v1/users/1/?format=json](http://localhost:8000/lisw/api/v1/users/1/?format=json)

Dependencias
------------
 - python 2.7+
 - django 1.5+
 - tastypie 0.9.14+
 - mimeparse 0.1.3+
 - dateutil 2.1+
 - PIL