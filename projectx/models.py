#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime
from django.contrib.auth.models import User
from django.db import models
from django import forms
from tastypie.utils import now


class Mapa(models.Model):
    nombre = models.CharField(max_length=255)
    imagen = models.ImageField(upload_to='mapas')

    def __unicode__(self):
        return self.nombre


class Condicion(models.Model):
    abierta = models.BooleanField(default=False)
    ip_camara = models.IPAddressField()
    ruido_db = models.DecimalField(max_digits=10, decimal_places=7)
    temperatura = models.DecimalField(max_digits=4, decimal_places=1)

    def __unicode__(self):
        return "Condicion id:"+str(self.id)


class Sala(models.Model):
    nombre = models.CharField(max_length=255)
    mapa = models.ForeignKey(Mapa, related_name='salas', null=True)
    condicion = models.OneToOneField(Condicion, related_name='sala', null=True)
    color = models.CharField(max_length=7)
    puntos = models.CommaSeparatedIntegerField(max_length=100)

    def __unicode__(self):
        return self.nombre


class Expositor(models.Model):
    compania = models.CharField(max_length=255)
    descripcion = models.TextField()
    color = models.CharField(max_length=7)
    sala = models.ForeignKey(Sala, related_name='expositores', null=True)

    def __unicode__(self):
        return self.compania


class Conferenciante(models.Model):
    user = models.OneToOneField(User)
    mac_router = models.CharField(max_length=255)

    def __unicode__(self):
        return self.user.username


class Evento(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha = models.DateTimeField(default=now)
    fin = models.DateTimeField(default=now)
    sala = models.ForeignKey(Sala, related_name='eventos')
    conferenciante = models.ManyToManyField(Conferenciante, related_name='evento')

    def __unicode__(self):
        return self.titulo


class Asistente(models.Model):
    user = models.OneToOneField(User)
    mac_router = models.CharField(max_length=255)
    eventos = models.ManyToManyField(Evento, related_name='asistentes')

    def __unicode__(self):
        return self.user.username


# ============================


class Note(models.Model):
    user = models.ForeignKey(User, related_name='notes')
    title = models.CharField(max_length=255)
    slug = models.SlugField()
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(default=now)
    updated = models.DateTimeField(default=now)

    def __unicode__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.updated = now()
        return super(Note, self).save(*args, **kwargs)


class AnnotatedNote(models.Model):
    note = models.OneToOneField(Note, related_name='annotated')
    annotations = models.TextField()

    def __unicode__(self):
        return u"Annotated %s" % self.note.title


class SlugBasedNote(models.Model):
    slug = models.SlugField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_active = models.BooleanField(default=True)

    def __unicode__(self):
        return u"SlugBased %s" % self.title


class UserForm(forms.ModelForm):
    class Meta:
        model = User