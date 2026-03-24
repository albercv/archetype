import { LegalLayout, legal } from '@/components/ui/LegalLayout'

export default function AvisoLegalPage() {
  return (
    <LegalLayout title="AVISO LEGAL">

      <div style={legal.section}>
        <h2 style={legal.h2}>1. Datos Identificativos</h2>
        <p style={legal.p}>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
          Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa al usuario de
          los datos del titular:
        </p>
        <p style={legal.p}>
          Titular: Alberto Carrasco Vázquez<br />
          NIF: 51095475D<br />
          Domicilio: Calle Arquitectura 11, 28005, Madrid, España<br />
          Email de contacto:{' '}
          <a href="mailto:hello@evolve2digital.com" style={legal.a}>
            hello@evolve2digital.com
          </a>
          <br />
          Nombre comercial: Archetypex<br />
          Sitio web: https://archetypex.es
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>2. Objeto</h2>
        <p style={legal.p}>
          El presente sitio web tiene como finalidad ofrecer un test de arquetipos masculinos
          basado en modelos de psicología arquetipal. El servicio incluye un cuestionario gratuito
          de 12 preguntas y un informe personalizado generado por inteligencia artificial, cuyo
          acceso requiere un pago único de 1€.
        </p>
        <p style={legal.p}>
          Los resultados del test y el informe generado tienen carácter orientativo y de
          entretenimiento. En ningún caso constituyen un diagnóstico psicológico, médico o
          profesional, ni sustituyen la consulta con un profesional cualificado de la salud mental.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>3. Propiedad Intelectual e Industrial</h2>
        <p style={legal.p}>
          Todos los contenidos del sitio web, incluyendo sin limitación textos, imágenes, diseño
          gráfico, código fuente, logos, marcas y demás elementos, son propiedad de Alberto Carrasco
          Vázquez o de sus legítimos titulares, y se encuentran protegidos por la legislación
          española e internacional de propiedad intelectual e industrial.
        </p>
        <p style={legal.p}>
          Queda prohibida la reproducción, distribución, comunicación pública, transformación o
          cualquier otra forma de explotación de los contenidos sin la autorización expresa y por
          escrito del titular.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>4. Condiciones de Uso</h2>
        <p style={legal.p}>
          El usuario se compromete a utilizar el sitio web de conformidad con la ley, el presente
          aviso legal, las buenas costumbres y el orden público. Queda prohibido:
        </p>
        <ul style={legal.ul}>
          <li style={legal.li}>Utilizar el sitio web con fines ilícitos o contrarios al orden público.</li>
          <li style={legal.li}>Reproducir, copiar, distribuir o modificar los contenidos sin autorización.</li>
          <li style={legal.li}>Intentar acceder a áreas restringidas del sitio web o de sus sistemas informáticos.</li>
          <li style={legal.li}>Introducir virus, malware o cualquier otro elemento que pueda dañar los sistemas informáticos.</li>
          <li style={legal.li}>Suplantar la identidad de otro usuario.</li>
        </ul>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>5. Exclusión de Garantías y Responsabilidad</h2>
        <p style={legal.p}>
          El titular no garantiza la disponibilidad ni la continuidad del funcionamiento del sitio
          web. No será responsable de:
        </p>
        <ul style={legal.ul}>
          <li style={legal.li}>Interrupciones en el servicio por causas técnicas, de mantenimiento o ajenas a su voluntad.</li>
          <li style={legal.li}>Daños directos o indirectos derivados del uso del sitio web.</li>
          <li style={legal.li}>La precisión, exhaustividad o actualización de los contenidos.</li>
          <li style={legal.li}>Los resultados del test de arquetipos, que son generados por inteligencia artificial y tienen carácter orientativo y de entretenimiento.</li>
          <li style={legal.li}>Daños derivados de la interpretación personal que el usuario haga de los resultados del test.</li>
          <li style={legal.li}>Decisiones que el usuario tome basándose en el informe generado.</li>
        </ul>
        <p style={legal.p}>
          El informe generado por inteligencia artificial no constituye asesoramiento profesional
          de ningún tipo. El usuario acepta que los resultados son aproximaciones basadas en sus
          respuestas y en un modelo de arquetipos, y que no sustituyen la evaluación de un
          profesional cualificado.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>6. Condiciones de Compra</h2>
        <p style={legal.p}>
          El precio del informe completo es de 1€ (IVA incluido). El pago se procesa a través de
          Lemon Squeezy, que actúa como Merchant of Record (comerciante registrado) y es
          responsable del procesamiento del pago, la facturación y el cumplimiento tributario.
        </p>
        <p style={legal.p}>
          Una vez completado el pago, el informe se genera automáticamente y se entrega de forma
          inmediata en pantalla y por correo electrónico. Dado que el servicio digital se ejecuta
          de forma inmediata tras la confirmación del pago, el usuario renuncia expresamente al
          derecho de desistimiento previsto en el artículo 103.a) del Real Decreto Legislativo
          1/2007, de conformidad con lo establecido en dicha norma.
        </p>
        <p style={legal.p}>
          No se realizarán reembolsos una vez generado el informe, salvo en los casos en que la
          ley aplicable lo exija.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>7. Enlaces Externos</h2>
        <p style={legal.p}>
          El sitio web puede contener enlaces a sitios de terceros. El titular no asume
          responsabilidad alguna por el contenido, políticas de privacidad o prácticas de sitios
          web de terceros.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>8. Legislación Aplicable y Jurisdicción</h2>
        <p style={legal.p}>
          El presente aviso legal se rige por la legislación española. Para la resolución de
          cualquier controversia, las partes se someten a los Juzgados y Tribunales de Madrid,
          España, salvo que la normativa aplicable establezca otro fuero.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>9. Modificaciones</h2>
        <p style={legal.p}>
          El titular se reserva el derecho de modificar el presente aviso legal sin previo aviso.
          Las modificaciones entrarán en vigor desde su publicación en el sitio web.
        </p>
        <p style={{ ...legal.p, color: '#666', fontSize: '0.82rem' }}>
          Última actualización: marzo 2026
        </p>
      </div>

    </LegalLayout>
  )
}
