from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import login_view, logout_view
from .views import *

router = DefaultRouter()

router.register(r'empresas', EmpresaViewSet)
router.register(r'solicitudes', SolicitudViewSet)
router.register(r'practicas', PracticaViewSet)
router.register(r'informes', InformeViewSet)

urlpatterns = [
    path("login/", login_view),
    path("logout/", logout_view),

    path("", include(router.urls)),
]