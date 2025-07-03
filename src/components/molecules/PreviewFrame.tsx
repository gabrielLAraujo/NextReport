interface PreviewFrameProps {
  htmlContent: string;
  cssContent: string;
}

export function PreviewFrame({ htmlContent, cssContent }: PreviewFrameProps) {
  const iframeContent = `
    <!DOCTYPE html>
    <html style="height: 100%;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Reset básico */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          width: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          background: #ffffff;
          overflow-x: hidden;
        }
        
        body {
          padding: 10px;
          min-height: 100vh;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        
        .container {
          flex: 1;
          width: 100%;
        }
        
        /* Estilos base para elementos */
        h1, h2, h3, h4, h5, h6 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        
        p {
          margin-bottom: 10px;
          color: #34495e;
        }
        
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 10px 0;
          font-size: 14px;
        }
        
        th, td {
          border: 1px solid #bdc3c7;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #ecf0f1;
          font-weight: bold;
          color: #2c3e50;
        }
        
        /* Estilos para métricas */
        .metricas {
          display: flex;
          gap: 15px;
          margin: 15px 0;
          flex-wrap: wrap;
        }
        
        .metric {
          flex: 1;
          min-width: 150px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
        }
        
        .metric h3 {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        
        .metric .valor {
          font-size: 18px;
          font-weight: bold;
          color: #007bff;
        }
        
        /* Responsividade */
        @media (max-width: 600px) {
          .metricas {
            flex-direction: column;
          }
          
          table {
            font-size: 12px;
          }
          
          th, td {
            padding: 6px;
          }
        }
        
        /* CSS personalizado do usuário */
        ${cssContent}
      </style>
    </head>
    <body>
      <div class="container">
        ${htmlContent}
      </div>
    </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={iframeContent}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
        flex: "1 1 auto",
      }}
      title="Preview do Relatório"
    />
  );
}
