from rest_framework import serializers
from .models import Usuario, Alumno, Empresa, SolicitudPractica, Practica, InformePractica


# -----------------------------
# USUARIO
# -----------------------------

class UsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "rol"
        ]


# -----------------------------
# ALUMNO
# -----------------------------

class AlumnoSerializer(serializers.ModelSerializer):

    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Alumno
        fields = "__all__"


# -----------------------------
# EMPRESA
# -----------------------------

class EmpresaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Empresa
        fields = "__all__"


# -----------------------------
# SOLICITUD PRACTICA
# -----------------------------

class SolicitudPracticaSerializer(serializers.ModelSerializer):

    empresa = EmpresaSerializer(read_only=True)
    alumno = AlumnoSerializer(read_only=True)

    class Meta:
        model = SolicitudPractica
        fields = "__all__"
        read_only_fields = ["empresa", "alumno", "estado"]
        

# -----------------------------
# INFORME
# -----------------------------

class InformePracticaSerializer(serializers.ModelSerializer):

    class Meta:
        model = InformePractica
        fields = "__all__"


# -----------------------------
# PRACTICA
# -----------------------------
class PracticaSerializer(serializers.ModelSerializer):

    alumno = AlumnoSerializer(read_only=True)
    empresa = EmpresaSerializer(read_only=True)
    informes = InformePracticaSerializer(many=True, read_only=True)

    class Meta:
        model = Practica
        fields = "__all__"