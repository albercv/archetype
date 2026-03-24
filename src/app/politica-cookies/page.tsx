import { LegalLayout, legal } from '@/components/ui/LegalLayout'

export default function PoliticaCookiesPage() {
  return (
    <LegalLayout title="POLÍTICA DE COOKIES">

      <div style={legal.section}>
        <h2 style={legal.h2}>1. ¿Qué son las Cookies?</h2>
        <p style={legal.p}>
          Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo
          del usuario al navegar por internet. Sirven para recordar información sobre la visita del
          usuario.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>2. Cookies Utilizadas en este Sitio Web</h2>
        <p style={legal.p}>
          Este sitio web utiliza exclusivamente cookies técnicas estrictamente necesarias para el
          funcionamiento del servicio. En concreto:
        </p>
        <ul style={legal.ul}>
          <li style={legal.li}>Cookies de sesión: necesarias para mantener la sesión del usuario durante la realización del test. Se eliminan automáticamente al cerrar el navegador.</li>
          <li style={legal.li}>Cookies de preferencias: almacenan preferencias técnicas del navegador necesarias para la correcta visualización del sitio.</li>
        </ul>
        <p style={legal.p}>Este sitio web NO utiliza:</p>
        <ul style={legal.ul}>
          <li style={legal.li}>Cookies de análisis o medición (Google Analytics, etc.).</li>
          <li style={legal.li}>Cookies de publicidad o remarketing.</li>
          <li style={legal.li}>Cookies de redes sociales.</li>
          <li style={legal.li}>Cookies de seguimiento de terceros.</li>
          <li style={legal.li}>Ningún otro tipo de cookie no esencial.</li>
        </ul>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>3. Base Legal</h2>
        <p style={legal.p}>
          Las cookies técnicas estrictamente necesarias están exentas de la obligación de
          consentimiento según el artículo 22.2 de la LSSI-CE, ya que son imprescindibles para la
          prestación del servicio solicitado por el usuario.
        </p>
        <p style={legal.p}>
          Al no utilizar cookies no esenciales, no es necesario recabar el consentimiento del
          usuario para el uso de cookies.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>4. Gestión de Cookies</h2>
        <p style={legal.p}>
          El usuario puede configurar su navegador para rechazar o eliminar cookies. A continuación
          se facilitan enlaces a las instrucciones de los navegadores más comunes:
        </p>
        <ul style={legal.ul}>
          <li style={legal.li}>
            Google Chrome:{' '}
            <a href="https://support.google.com/chrome/answer/95647" style={legal.a} target="_blank" rel="noopener noreferrer">
              https://support.google.com/chrome/answer/95647
            </a>
          </li>
          <li style={legal.li}>
            Mozilla Firefox:{' '}
            <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" style={legal.a} target="_blank" rel="noopener noreferrer">
              https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias
            </a>
          </li>
          <li style={legal.li}>
            Safari:{' '}
            <a href="https://support.apple.com/es-es/guide/safari/sfri11471" style={legal.a} target="_blank" rel="noopener noreferrer">
              https://support.apple.com/es-es/guide/safari/sfri11471
            </a>
          </li>
          <li style={legal.li}>
            Microsoft Edge:{' '}
            <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" style={legal.a} target="_blank" rel="noopener noreferrer">
              https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09
            </a>
          </li>
        </ul>
        <p style={legal.p}>
          Nota: la desactivación de cookies técnicas puede afectar al correcto funcionamiento del
          sitio web.
        </p>
      </div>

      <div style={legal.section}>
        <h2 style={legal.h2}>5. Modificaciones</h2>
        <p style={legal.p}>
          El titular se reserva el derecho de modificar esta política de cookies. Cualquier cambio
          será publicado en esta página.
        </p>
        <p style={{ ...legal.p, color: '#666', fontSize: '0.82rem' }}>
          Última actualización: marzo 2026
        </p>
      </div>

    </LegalLayout>
  )
}
