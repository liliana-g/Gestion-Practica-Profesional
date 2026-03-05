from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *

admin.site.register(Usuario)
admin.site.register(Alumno)
admin.site.register(Empresa)
admin.site.register(SolicitudPractica)
admin.site.register(Practica)
admin.site.register(InformePractica)