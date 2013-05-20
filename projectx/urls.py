from projectx import views
try:
    from django.conf.urls import patterns, include, url
except ImportError: # Django < 1.4
    from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('',
    url(r'^api/', include('projectx.api.urls')),
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    url(r'^logout/$', views.logout_user, name="logout_user"),
    url(r'^login.json$', views.login, name="login"),
    url(r'^$', views.index, name="index"),
)
