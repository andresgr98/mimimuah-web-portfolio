# Configuración de Resend para Emails de Contacto

## 📧 Qué hace
Cuando alguien envía el formulario de contacto:
1. Se guarda en la base de datos (como antes)
2. **NUEVO:** Se envía un email automático al email configurado

## 🔧 Pasos para configurar

### 1. Crear cuenta en Resend
1. Ve a https://resend.com/signup
2. Crea una cuenta gratuita (no necesitas tarjeta de crédito)
3. Confirma tu email

### 2. Obtener API Key
1. Una vez logueado, ve a **API Keys** en el menú
2. Haz clic en **Create API Key**
3. Dale un nombre (ej: "Portfolio Mimi")
4. Selecciona permisos: **Sending access**
5. Copia la API key que te genera (empieza con `re_`)

### 3. Configurar variables de entorno
Edita el archivo `.env` en la raíz del proyecto:

```env
RESEND_API_KEY=re_TuApiKeyAqui
CONTACT_EMAIL_TO=mimi@ejemplo.com
```

**Importante:** Cambia `mimi@ejemplo.com` por el email real de tu hermana donde quiere recibir las notificaciones.

### 4. Configurar dominio (OPCIONAL pero recomendado)
Por defecto, Resend usa `onboarding@resend.dev` como remitente. Para usar tu propio dominio:

1. En Resend, ve a **Domains**
2. Haz clic en **Add Domain**
3. Añade tu dominio (ej: `mimimuah.com`)
4. Configura los registros DNS que te indica (SPF, DKIM, DMARC)
5. Una vez verificado, edita el archivo `src/lib/email.ts` línea 18:
   ```typescript
   from: 'Mimi Portfolio <contacto@tumimaho.com>',
   ```

## 📝 Notas importantes

- **Límite gratuito:** 100 emails/día, 3000/mes
- Los emails se envían automáticamente, no afecta la experiencia del usuario
- Si el email falla por alguna razón, el formulario igual se guarda en BD (no se pierde nada)
- Puedes ver todos los emails enviados en el dashboard de Resend

## 🧪 Probar que funciona

1. Asegúrate de tener las variables configuradas en `.env`
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Rellena el formulario de contacto en http://localhost:4321/#contacto
4. Revisa:
   - La base de datos (admin panel)
   - El inbox del email configurado en `CONTACT_EMAIL_TO`
   - El dashboard de Resend (para ver el log de emails enviados)

## 🚀 Para producción

Cuando despliegues en EC2, asegúrate de:
1. Añadir las mismas variables de entorno en el servidor
2. Si tienes dominio propio, configurarlo en Resend
3. Actualizar el `from:` en `src/lib/email.ts`
