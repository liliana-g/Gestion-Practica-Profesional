from django.db import models
from django.contrib.auth.models import AbstractUser


# ---------------------------
# USUARIOS DEL SISTEMA
# ---------------------------

class Usuario(AbstractUser):

    ROLES = (
        ('ADMIN', 'Administrador'),
        ('SECRETARIA', 'Secretaria'),
        ('ALUMNO', 'Alumno'),
    )

    rol = models.CharField(max_length=20, choices=ROLES)


# ---------------------------
# ALUMNO
# ---------------------------

class Alumno(models.Model):

    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name="alumno"
    )

    rut = models.CharField(max_length=12, unique=True)
    carrera = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.usuario.first_name} {self.usuario.last_name}"


# ---------------------------
# EMPRESA
# ---------------------------

class Empresa(models.Model):

    nombre = models.CharField(max_length=200)
    rut = models.CharField(max_length=20, unique=True)

    direccion = models.CharField(max_length=250)
    telefono = models.CharField(max_length=20)
    email = models.EmailField()

    contacto = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre


# ---------------------------
# SOLICITUD DE PRACTICA
# ---------------------------

class SolicitudPractica(models.Model):

    ESTADOS = (
        ('PENDIENTE', 'Pendiente'),
        ('APROBADA', 'Aprobada'),
        ('RECHAZADA', 'Rechazada'),
        ('CORRECCION', 'Pendiente Corrección'),
    )

    alumno = models.ForeignKey(
        Alumno,
        on_delete=models.CASCADE,
        related_name="solicitudes"
    )

    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name="solicitudes"
    )

    fecha_solicitud = models.DateTimeField(auto_now_add=True)

    carta_presentacion = models.FileField(upload_to="cartas_practica/")

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='PENDIENTE'
    )

    comentario_secretaria = models.TextField(blank=True, null=True)

    revisado_por = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="solicitudes_revisadas"
    )

    fecha_revision = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Solicitud {self.id} - {self.alumno}"


# ---------------------------
# PRACTICA
# ---------------------------

class Practica(models.Model):

    ESTADOS = (
        ('EN_PROCESO', 'En proceso'),
        ('INFORME_SUBIDO', 'Informe Subido'),
        ('FINALIZADA', 'Finalizada'),
    )

    solicitud = models.OneToOneField(
        SolicitudPractica,
        on_delete=models.CASCADE,
        related_name="practica"
    )

    alumno = models.ForeignKey(
        Alumno,
        on_delete=models.CASCADE,
        related_name="practicas"
    )

    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name="practicas"
    )

    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='EN_PROCESO'
    )

    def __str__(self):
        return f"Practica {self.id} - {self.alumno}"


# ---------------------------
# INFORME DE PRACTICA
# ---------------------------

class InformePractica(models.Model):

    ESTADOS = (
        ('PENDIENTE', 'Pendiente Revisión'),
        ('APROBADO', 'Aprobado'),
        ('RECHAZADO', 'Rechazado'),
    )

    practica = models.ForeignKey(
        Practica,
        on_delete=models.CASCADE,
        related_name="informes"
    )

    archivo = models.FileField(upload_to="informes_practica/")

    fecha_subida = models.DateTimeField(auto_now_add=True)

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='PENDIENTE'
    )

    comentarios_revision = models.TextField(blank=True, null=True)

    revisado_por = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="informes_revisados"
    )

    fecha_revision = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Informe {self.id} - {self.practica.alumno}"