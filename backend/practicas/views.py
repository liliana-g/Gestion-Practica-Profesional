from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

from django.utils import timezone
from django.contrib.auth import authenticate, login, logout

from .models import *
from .serializers import *


# -----------------------------------
# LOGIN
# -----------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Credenciales incorrectas"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)

    return Response({
        "mensaje": "Login correcto",
        "usuario": UsuarioSerializer(user).data
    })


# -----------------------------------
# LOGOUT
# -----------------------------------

@api_view(["POST"])
def logout_view(request):

    logout(request)

    return Response({"mensaje": "Logout correcto"})


# -----------------------------------
# EMPRESAS
# -----------------------------------

class EmpresaViewSet(viewsets.ModelViewSet):

    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated]


# -----------------------------------
# SOLICITUDES
# -----------------------------------

class SolicitudViewSet(viewsets.ModelViewSet):

    queryset = SolicitudPractica.objects.all().order_by("-fecha_solicitud")
    serializer_class = SolicitudPracticaSerializer
    permission_classes = [IsAuthenticated]


    def get_serializer_context(self):
        return {"request": self.request}



    # -----------------------------------
    # CREAR SOLICITUD (ALUMNO)
    # -----------------------------------

    def create(self, request, *args, **kwargs):

        if request.user.rol != "ALUMNO":
            return Response({"error": "Solo alumnos pueden crear solicitudes"}, status=403)
    
        try:
            alumno = Alumno.objects.get(usuario=request.user)
        except Alumno.DoesNotExist:
            return Response({"error": "Alumno no encontrado"}, status=400)
    
        existe = SolicitudPractica.objects.filter(
            alumno=alumno,
            estado="PENDIENTE"
        ).exists()
    
        if existe:
            return Response(
                {"error": "Ya tienes una solicitud pendiente"},
                status=400
            )
        practica = Practica.objects.filter(alumno=alumno, estado__in=["EN_PROCESO", "INFORME_SUBIDO"]).first()
        if practica:
            return Response(
                {"error": "Ya tienes una práctica en proceso"},
                status=400
            )
    
        import json
        empresa_data = json.loads(request.data.get("empresa"))
    
        rut = empresa_data.get("rut")
    
        empresa = Empresa.objects.filter(rut=rut).first()
    
        if not empresa:
            empresa = Empresa.objects.create(
                nombre=empresa_data.get("nombre"),
                rut=rut,
                direccion=empresa_data.get("direccion"),
                telefono=empresa_data.get("telefono"),
                email=empresa_data.get("email"),
                contacto=empresa_data.get("contacto"),
            )
    
        data = {
            "carta_presentacion": request.data.get("carta_presentacion")
        }
    
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
    
        solicitud = serializer.save(
            alumno=alumno,
            empresa=empresa
        )
    
        return Response({
            "mensaje": "Solicitud creada correctamente",
            "data": SolicitudPracticaSerializer(solicitud).data
        })
    
    # -----------------------------------
    # MIS SOLICITUDES (ALUMNO)
    # -----------------------------------

    @action(detail=False, methods=["get"])
    def mis_solicitudes(self, request):
    
        if request.user.rol != "ALUMNO":
            return Response({"error": "Solo alumnos pueden ver sus solicitudes"}, status=403)
    
        alumno = Alumno.objects.get(usuario=request.user)
    
        solicitudes = SolicitudPractica.objects.select_related("empresa").filter(alumno=alumno)
    
        serializer = self.get_serializer(solicitudes, many=True)
    
        return Response(serializer.data)


    # -----------------------------------
    # APROBAR SOLICITUD (SECRETARIA)
    # -----------------------------------

    @action(detail=True, methods=["post"])
    def aprobar(self, request, pk=None):

        if request.user.rol != "SECRETARIA":
            return Response({"error": "Solo secretaria puede aprobar"}, status=403)

        solicitud = self.get_object()

        if solicitud.estado != "PENDIENTE":
            return Response({"error": "Solicitud ya procesada"}, status=400)

        solicitud.estado = "APROBADA"
        solicitud.revisado_por = request.user
        solicitud.fecha_revision = timezone.now()

        solicitud.save()

        practica = Practica.objects.create(
            solicitud=solicitud,
            alumno=solicitud.alumno,
            empresa=solicitud.empresa,
            fecha_inicio=request.data.get("fecha_inicio"),
            fecha_fin=request.data.get("fecha_fin"),
        )

        return Response({
            "mensaje": "Solicitud aprobada",
            "practica_id": practica.id
        })


    # -----------------------------------
    # RECHAZAR SOLICITUD
    # -----------------------------------

    @action(detail=True, methods=["post"])
    def rechazar(self, request, pk=None):

        if request.user.rol != "SECRETARIA":
            return Response({"error": "Solo secretaria puede rechazar"}, status=403)

        solicitud = self.get_object()

        solicitud.estado = "RECHAZADA"
        solicitud.comentario_secretaria = request.data.get("comentario")
        solicitud.revisado_por = request.user
        solicitud.fecha_revision = timezone.now()

        solicitud.save()

        return Response({"mensaje": "Solicitud rechazada"})


# -----------------------------------
# PRACTICAS
# -----------------------------------

class PracticaViewSet(viewsets.ModelViewSet):

    queryset = Practica.objects.all().order_by("-id")
    serializer_class = PracticaSerializer
    permission_classes = [IsAuthenticated]


    # -----------------------------------
    # PRACTICA DEL ALUMNO
    # -----------------------------------

    @action(detail=False, methods=["get"])
    def mi_practica(self, request):

        if request.user.rol != "ALUMNO":
            return Response({"error": "Solo alumnos"}, status=403)

        alumno = Alumno.objects.get(usuario=request.user)

        practicas = Practica.objects.filter(alumno=alumno)

        serializer = self.get_serializer(practicas, many=True)

        return Response(serializer.data)


    # -----------------------------------
    # FINALIZAR PRACTICA
    # -----------------------------------

    @action(detail=True, methods=["post"])
    def finalizar(self, request, pk=None):

        if request.user.rol != "SECRETARIA":
            return Response({"error": "Solo secretaria"}, status=403)

        practica = self.get_object()

        practica.estado = "FINALIZADA"

        practica.save()

        return Response({"mensaje": "Práctica finalizada"})


# -----------------------------------
# INFORMES
# -----------------------------------

class InformeViewSet(viewsets.ModelViewSet):

    queryset = InformePractica.objects.all()
    serializer_class = InformePracticaSerializer
    permission_classes = [IsAuthenticated]


    # -----------------------------------
    # SUBIR INFORME
    # -----------------------------------

    def create(self, request, *args, **kwargs):

        if request.user.rol != "ALUMNO":
            return Response({"error": "Solo alumnos pueden subir informes"}, status=403)

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        informe = serializer.save()

        practica = informe.practica

        practica.estado = "INFORME_SUBIDO"

        practica.save()

        return Response({
            "mensaje": "Informe subido correctamente",
            "data": serializer.data
        })


    # -----------------------------------
    # APROBAR INFORME
    # -----------------------------------

    @action(detail=True, methods=["post"])
    def aprobar(self, request, pk=None):

        if request.user.rol != "SECRETARIA":
            return Response({"error": "Solo secretaria"}, status=403)

        informe = self.get_object()

        informe.estado = "APROBADO"
        informe.revisado_por = request.user
        informe.fecha_revision = timezone.now()

        informe.save()

        practica = informe.practica

        practica.estado = "FINALIZADA"

        practica.save()

        return Response({"mensaje": "Informe aprobado"})


   # -----------------------------------
    # RECHAZAR INFORME
    # -----------------------------------

    @action(detail=True, methods=["post"])
    def rechazar(self, request, pk=None):

        if request.user.rol != "SECRETARIA":
            return Response({"error": "Solo secretaria"}, status=403)

        informe = self.get_object()

        informe.estado = "RECHAZADO"
        informe.comentarios_revision = request.data.get("comentarios")
        informe.revisado_por = request.user
        informe.fecha_revision = timezone.now()
        informe.save()

        practica = informe.practica
        practica.estado = "EN_PROCESO"
        practica.save()

        return Response({"mensaje": "Informe rechazado"})