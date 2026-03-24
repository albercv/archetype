interface ArchetypeEntry {
  id: string
  name: string
  score: number
  description: string
}

interface ReportData {
  dominantArchetype: ArchetypeEntry
  secondaryArchetypes: ArchetypeEntry[]
  shadow: {
    description: string
    risks: string[]
  }
  analysis: string
  recommendations: string[]
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function generateReportEmail(report: ReportData): string {
  const dominant = report.dominantArchetype

  const secondaryRows = report.secondaryArchetypes
    .map(
      (arch) => `
      <tr>
        <td style="padding:16px 40px;border-bottom:1px solid #1e1e1e;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#F0EDE6;">${esc(arch.name.toUpperCase())}</span>
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#FF8C00;margin-left:10px;">${arch.score}%</span>
              </td>
            </tr>
            <tr>
              <td style="padding-top:6px;">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#999;line-height:1.6;">${esc(arch.description)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join('')

  const riskRows = report.shadow.risks
    .map(
      (risk) => `
      <tr>
        <td width="16" valign="top" style="padding-top:3px;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#FF8C00;font-weight:bold;">&#9642;</span>
        </td>
        <td style="padding-left:8px;padding-bottom:10px;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#F0EDE6;line-height:1.5;">${esc(risk)}</span>
        </td>
      </tr>`,
    )
    .join('')

  const recRows = report.recommendations
    .map(
      (rec, i) => `
      <tr>
        <td style="padding:16px 40px;border-bottom:1px solid #1e1e1e;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="48" valign="top">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:bold;color:#FF8C00;line-height:1;">${String(i + 1).padStart(2, '0')}</span>
              </td>
              <td valign="middle" style="padding-left:16px;padding-top:4px;">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#F0EDE6;line-height:1.7;">${esc(rec)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Tu arquetipo dominante: ${esc(dominant.name)}</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#050505">
    <tr>
      <td align="center" style="padding:20px 0;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#050505;" bgcolor="#050505">

          <!-- HEADER -->
          <tr>
            <td style="padding:40px 40px 30px;text-align:center;border-bottom:1px solid #1e1e1e;" bgcolor="#050505">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#666;letter-spacing:4px;text-transform:uppercase;margin:0;padding:0;">
                ARCHETYPEX
              </p>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="padding:40px;" bgcolor="#050505">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px 0;padding:0;">
                Tu arquetipo dominante
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:36px;font-weight:bold;color:#F0EDE6;margin:0 0 8px 0;padding:0;line-height:1.1;letter-spacing:-0.5px;">
                ${esc(dominant.name.toUpperCase())}
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:bold;color:#FF8C00;margin:0 0 20px 0;padding:0;">
                ${dominant.score}%
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#AAAAAA;line-height:1.7;margin:0;padding:0;">
                ${esc(dominant.description)}
              </p>
            </td>
          </tr>

          <!-- SECONDARY ARCHETYPES -->
          <tr>
            <td style="padding:30px 40px 10px;" bgcolor="#050505">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#666;letter-spacing:2px;text-transform:uppercase;margin:0;padding:0;">
                También eres
              </p>
            </td>
          </tr>
          ${secondaryRows}

          <!-- SHADOW -->
          <tr>
            <td style="padding:30px 40px;background-color:#1C1B1B;border-left:3px solid #FF8C00;" bgcolor="#1C1B1B">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#666;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0;padding:0;">
                Tu sombra
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#F0EDE6;margin:0 0 14px 0;padding:0;">
                LO QUE NO VES
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#AAAAAA;line-height:1.7;margin:0 0 20px 0;padding:0;">
                ${esc(report.shadow.description)}
              </p>
              <table cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  ${riskRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- ANALYSIS -->
          <tr>
            <td style="padding:30px 40px;" bgcolor="#050505">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#666;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0;padding:0;">
                Lectura cruda
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#F0EDE6;margin:0 0 14px 0;padding:0;">
                ASÍ TE VEO
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#AAAAAA;line-height:1.8;font-style:italic;margin:0;padding:0;">
                ${esc(report.analysis)}
              </p>
            </td>
          </tr>

          <!-- RECOMMENDATIONS -->
          <tr>
            <td style="padding:30px 40px 10px;" bgcolor="#050505">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#666;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0;padding:0;">
                Acción
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#F0EDE6;margin:0;padding:0;">
                QUÉ HACER AHORA
              </p>
            </td>
          </tr>
          ${recRows}

          <!-- FOOTER -->
          <tr>
            <td style="padding:40px;border-top:1px solid #1e1e1e;text-align:center;" bgcolor="#050505">
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#555;margin:0 0 8px 0;padding:0;">
                Este informe ha sido generado por IA basándose en tus respuestas.
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#666;margin:0 0 20px 0;padding:0;">
                archetypex.es
              </p>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#444;margin:0;padding:0;">
                Si no solicitaste este informe, puedes ignorar este email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
