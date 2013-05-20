try:
    from django.conf.urls import *
except ImportError: # Django < 1.4
    from django.conf.urls.defaults import *
from tastypie.api import Api
from projectx.api.resources import NoteResource, UserResource, BustedResource, CachedUserResource, PublicCachedUserResource, PrivateCachedUserResource, SlugBasedNoteResource, SessionUserResource
from projectx.api.resources import MapaResource, ExpositorResource, SalaResource, CondicionResource, ConferencianteResource, AsistenteResource, EventoResource

api = Api(api_name='v1')
api.register(NoteResource(), canonical=True)
api.register(UserResource(), canonical=True)
api.register(CachedUserResource(), canonical=True)
api.register(PublicCachedUserResource(), canonical=True)
api.register(PrivateCachedUserResource(), canonical=True)

v2_api = Api(api_name='v2')
v2_api.register(MapaResource())
v2_api.register(ExpositorResource())
v2_api.register(SalaResource())
v2_api.register(EventoResource())
v2_api.register(CondicionResource())
v2_api.register(ConferencianteResource())
v2_api.register(AsistenteResource())
v2_api.register(UserResource())

urlpatterns = v2_api.urls + api.urls
