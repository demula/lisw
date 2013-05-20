from django.core.context_processors import csrf
from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth import logout

from projectx.models import Note


def index(request):
    latest_notes_list = Note.objects.all().order_by('-updated')[:5]
    context = {'latest_notes_list': latest_notes_list}
    return render(request, 'index.html', context)

def login(request):
    if request.method == 'GET':
        c = {}
        c.update(csrf(request))
        return render(request, 'login.json', c)
    else:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            c = {}
            c['username'] = username
            c['password'] = password
            return render(request, 'login.json', c)
        else:
            c = {}
            c['username'] = username
            c['password'] = password
            c['errors'] = 'Clave o usuario incorrectos'
            return render(request, 'login.json', c)

def logout_user(request):
    logout(request)
    return render(request, 'logout.json', {"msg":"User logout successful"})