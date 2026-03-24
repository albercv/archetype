import { LegalLayout, legal } from '@/components/ui/LegalLayout'

export default function PoliticaPrivacidadPage() {
  return (
    <LegalLayout title="POLÍTICA DE PRIVACIDAD">

      <div style={legal.section}>
        <h2 style={legal.h2}>1. Responsable del Tratamiento</h2>
        <p style={legal.p}>
          Responsable: Alberto Carrasco Vázquez<br />
          NIF: 51095475D<br />
          Domicilio: Calle Arquitectura 11, 28005, Madrid, España<br />
          Email:{' '}
          <a href="mailto:hello@evolve2digital.com" style={legal.a}>
            hello@evolve2digital.com
          </a>
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>2. Datos que Recopilamos</h2>
        <p style={legal.p}>2.1. Datos proporcionados directamente:</p>
        <ul style={legal.ul}>
          <li style={legal.li}>Respuestas al cuestionario de 12 preguntas (opciones seleccionadas, sin datos identificativos personales).</li>
          <li style={legal.li}>Dirección de correo electrónico (proporcionada a través del proceso de pago gestionado por Lemon Squeezy).</li>
        </ul>
        <p style={legal.p}>2.2. Datos generados automáticamente:</p>
        <ul style={legal.ul}>
          <li style={legal.li}>Informe de arquetipos generado por inteligencia artificial a partir de las respuestas al cuestionario.</li>
          <li style={legal.li}>Fecha y hora de realización del test.</li>
          <li style={legal.li}>Identificador de sesión (código interno, no vinculado a datos personales hasta el momento del pago).</li>
        </ul>
        <p style={legal.p}>2.3. Datos que NO recopilamos:</p>
        <ul style={legal.ul}>
          <li style={legal.li}>No recopilamos datos de tarjetas de crédito ni información financiera. Todo el procesamiento de pagos es gestionado íntegramente por Lemon Squeezy como Merchant of Record.</li>
          <li style={legal.li}>No utilizamos cookies de seguimiento, rastreo ni analítica.</li>
          <li style={legal.li}>No recopilamos datos de navegación, dirección IP ni datos de geolocalización.</li>
        </ul>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>3. Finalidad del Tratamiento</h2>
        <p style={legal.p}>Los datos personales se tratan con las siguientes finalidades:</p>
        <ul style={legal.ul}>
          <li style={legal.li}>a) Prestación del servicio contratado: generar y entregar el informe personalizado de arquetipos, tanto en pantalla como por correo electrónico.</li>
          <li style={legal.li}>b) Gestión de la relación comercial: procesamiento del pago a través de Lemon Squeezy.</li>
          <li style={legal.li}>c) Comunicación: envío del informe al correo electrónico proporcionado.</li>
        </ul>
        <p style={legal.p}>
          No se utilizarán los datos para envío de publicidad, newsletters ni comunicaciones
          comerciales, salvo que el usuario dé su consentimiento expreso.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>4. Base Legal del Tratamiento</h2>
        <ul style={legal.ul}>
          <li style={legal.li}>Ejecución del contrato (artículo 6.1.b RGPD): el tratamiento es necesario para la prestación del servicio solicitado por el usuario.</li>
          <li style={legal.li}>Consentimiento (artículo 6.1.a RGPD): para el envío de comunicaciones que no sean estrictamente necesarias para la prestación del servicio.</li>
        </ul>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>5. Comunicación de Datos a Terceros</h2>
        <p style={legal.p}>
          Los datos podrán ser comunicados a los siguientes terceros, necesarios para la
          prestación del servicio:
        </p>
        <ul style={legal.ul}>
          <li style={legal.li}>
            Lemon Squeezy (Lemon Squeezy LLC): procesamiento de pagos como Merchant of Record.
            Política de privacidad:{' '}
            <a href="https://www.lemonsqueezy.com/privacy" style={legal.a} target="_blank" rel="noopener noreferrer">
              https://www.lemonsqueezy.com/privacy
            </a>
          </li>
          <li style={legal.li}>
            Anthropic (Anthropic PBC): las respuestas al cuestionario (sin datos identificativos)
            se envían a la API de Claude para la generación del informe. Política de privacidad:{' '}
            <a href="https://www.anthropic.com/privacy" style={legal.a} target="_blank" rel="noopener noreferrer">
              https://www.anthropic.com/privacy
            </a>
          </li>
          <li style={legal.li}>
            Resend (Resend Inc.): envío del informe por correo electrónico. Política de
            privacidad:{' '}
            <a href="https://resend.com/legal/privacy-policy" style={legal.a} target="_blank" rel="noopener noreferrer">
              https://resend.com/legal/privacy-policy
            </a>
          </li>
        </ul>
        <p style={legal.p}>
          No se venden, alquilan ni ceden datos personales a terceros con fines comerciales o
          publicitarios.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>6. Transferencias Internacionales</h2>
        <p style={legal.p}>
          Algunos de los proveedores mencionados tienen sede fuera del Espacio Económico Europeo
          (EEE). En particular, Anthropic, Lemon Squeezy y Resend operan desde Estados Unidos.
          Dichas transferencias se realizan con las garantías adecuadas previstas en el RGPD,
          incluyendo cláusulas contractuales tipo aprobadas por la Comisión Europea y/o decisiones
          de adecuación.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>7. Conservación de los Datos</h2>
        <ul style={legal.ul}>
          <li style={legal.li}>Las respuestas al cuestionario y el informe generado se conservan durante un máximo de 12 meses desde su generación, con el fin de permitir al usuario acceder nuevamente a su informe.</li>
          <li style={legal.li}>Transcurrido dicho plazo, los datos se eliminarán de forma automática.</li>
          <li style={legal.li}>Los datos de pago son gestionados y conservados por Lemon Squeezy según su propia política de retención.</li>
        </ul>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>8. Derechos del Usuario</h2>
        <p style={legal.p}>
          De conformidad con el RGPD y la LOPDGDD, el usuario tiene derecho a:
        </p>
        <ul style={legal.ul}>
          <li style={legal.li}>a) Acceso: conocer qué datos personales se tratan.</li>
          <li style={legal.li}>b) Rectificación: corregir datos inexactos.</li>
          <li style={legal.li}>c) Supresión: solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
          <li style={legal.li}>d) Oposición: oponerse al tratamiento de sus datos.</li>
          <li style={legal.li}>e) Limitación del tratamiento: solicitar la limitación del tratamiento en determinadas circunstancias.</li>
          <li style={legal.li}>f) Portabilidad: recibir sus datos en un formato estructurado y de uso común.</li>
        </ul>
        <p style={legal.p}>
          Para ejercer cualquiera de estos derechos, envíe un correo electrónico a{' '}
          <a href="mailto:hello@evolve2digital.com" style={legal.a}>
            hello@evolve2digital.com
          </a>{' '}
          indicando su solicitud y adjuntando copia de su documento de identidad.
        </p>
        <p style={legal.p}>El titular se compromete a responder en un plazo máximo de 30 días.</p>
        <p style={legal.p}>
          Asimismo, el usuario tiene derecho a presentar una reclamación ante la Agencia Española
          de Protección de Datos (
          <a href="https://www.aepd.es" style={legal.a} target="_blank" rel="noopener noreferrer">
            www.aepd.es
          </a>
          ) si considera que sus derechos no han sido respetados.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>9. Seguridad</h2>
        <p style={legal.p}>
          Se aplican medidas técnicas y organizativas para proteger los datos personales contra el
          acceso no autorizado, la alteración, divulgación o destrucción, incluyendo:
        </p>
        <ul style={legal.ul}>
          <li style={legal.li}>Comunicaciones cifradas mediante HTTPS/TLS.</li>
          <li style={legal.li}>Almacenamiento en bases de datos con acceso restringido.</li>
          <li style={legal.li}>Acceso a los sistemas limitado al titular.</li>
          <li style={legal.li}>Uso de proveedores con certificaciones de seguridad reconocidas.</li>
        </ul>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>10. Menores de Edad</h2>
        <p style={legal.p}>
          Este sitio web y sus servicios están dirigidos a personas mayores de 16 años. No se
          recopilan conscientemente datos de menores de 16 años. Si el titular tiene conocimiento
          de que un menor ha proporcionado datos personales, procederá a su eliminación inmediata.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>11. Modificaciones</h2>
        <p style={legal.p}>
          El titular se reserva el derecho de modificar esta política de privacidad. Cualquier
          cambio será publicado en esta página con la fecha de última actualización.
        </p>
        <p style={{ ...legal.p, color: '#666', fontSize: '0.82rem' }}>
          Última actualización: marzo 2026
        </p>
      </div>

    </LegalLayout>
  )
}
