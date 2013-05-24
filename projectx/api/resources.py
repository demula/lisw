from django.contrib.auth.models import User
from tastypie.cache import SimpleCache
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.authentication import SessionAuthentication, ApiKeyAuthentication, MultiAuthentication
from tastypie.authorization import Authorization, DjangoAuthorization
from projectx.models import Note, AnnotatedNote, SlugBasedNote
from projectx.models import Mapa, Sala, Condicion, Expositor, Conferenciante, Evento, Asistente


class UserResource(ModelResource):
    class Meta:
        resource_name = 'users'
        queryset = User.objects.all()
        authorization = Authorization()
        excludes = ['password', 'is_active', 'is_superuser']  # 'email'
        allowed_methods = ['get']


class CondicionResource(ModelResource):
    class Meta:
        resource_name = 'condiciones'
        queryset = Condicion.objects.all()
        #authentication = MultiAuthentication(SessionAuthentication(), ApiKeyAuthentication())
        #authorization = DjangoAuthorization()
        authorization = Authorization()
        allowed_methods = ['get', 'post', 'put', 'delete']
        always_return_data = True


class SalaResource(ModelResource):
    condicion = fields.OneToOneField(CondicionResource, 'condicion', related_name='sala', null=True, full=True)

    class Meta:
        resource_name = 'salas'
        queryset = Sala.objects.all()
        authorization = Authorization()
        allowed_methods = ['get', 'post', 'put', 'delete']
        always_return_data = True


class ConferencianteResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)

    class Meta:
        resource_name = 'conferenciantes'
        queryset = Conferenciante.objects.all()
        authorization = Authorization()
        allowed_methods = ['get']


class EventoResource(ModelResource):
    sala = fields.OneToOneField(SalaResource, 'sala', related_name='evento', full=True)
    conferenciante = fields.ToManyField('projectx.api.resources.ConferencianteResource', 'conferenciante', related_name='evento', full=True)
    asistentes = fields.ToManyField('projectx.api.resources.AsistenteResource', 'asistentes', related_name='evento')

    class Meta:
        resource_name = 'eventos'
        queryset = Evento.objects.all()
        authorization = Authorization()
        allowed_methods = ['get']


class AsistenteResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)
    eventos = fields.ToManyField('projectx.api.resources.EventoResource', 'eventos', related_name='asistente')

    class Meta:
        resource_name = 'asistentes'
        queryset = Asistente.objects.all()
        authorization = Authorization()
        allowed_methods = ['get']


class MapaResource(ModelResource):
    salas = fields.ToManyField(SalaResource, 'salas', related_name='mapa', null=True, full=True)
    imagen = fields.FileField(attribute="imagen", null=True, blank=True)

    class Meta:
        resource_name = 'mapas'
        queryset = Mapa.objects.all()
        authorization = Authorization()
        allowed_methods = ['get', 'post', 'put', 'delete']
        always_return_data = True


class ExpositorResource(ModelResource):
    sala = fields.OneToOneField(SalaResource, 'sala', related_name='evento', full=True)

    class Meta:
        resource_name = 'expositores'
        queryset = Expositor.objects.all()
        authorization = Authorization()
        allowed_methods = ['get']






# ====================================================================================

class CachedUserResource(ModelResource):
    class Meta:
        allowed_methods = ('get', )
        queryset = User.objects.all()
        resource_name = 'cached_users'
        cache = SimpleCache(timeout=3600)


class PublicCachedUserResource(ModelResource):
    class Meta:
        allowed_methods = ('get', )
        queryset = User.objects.all()
        resource_name = 'public_cached_users'
        cache = SimpleCache(timeout=3600, public=True)


class PrivateCachedUserResource(ModelResource):
    class Meta:
        allowed_methods = ('get', )
        queryset = User.objects.all()
        resource_name = 'private_cached_users'
        cache = SimpleCache(timeout=3600, private=True)


class NoteResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        resource_name = 'notes'
        queryset = Note.objects.all()
        authorization = Authorization()


class BustedResource(ModelResource):
    class Meta:
        queryset = AnnotatedNote.objects.all()
        resource_name = 'busted'

    def get_list(self, *args, **kwargs):
        raise Exception("It's broke.")


class SlugBasedNoteResource(ModelResource):
    class Meta:
        queryset = SlugBasedNote.objects.all()
        resource_name = 'slugbased'
        detail_uri_name = 'slug'
        authorization = Authorization()


class SessionUserResource(ModelResource):
    class Meta:
        resource_name = 'sessionusers'
        queryset = User.objects.all()
        authentication = SessionAuthentication()
        authorization = Authorization()
