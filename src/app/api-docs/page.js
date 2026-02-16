'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import swaggerJson from '@/lib/swagger.json';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
    return (
        <div className="swagger-container" style={{ background: 'white', minHeight: '100vh', padding: '2rem 1rem' }}>
            <style jsx global>{`
                /* === FORCE EVERYTHING TO WHITE BACKGROUND MODE === */
                
                /* 1. Reset Text Colors */
                .swagger-container .swagger-ui,
                .swagger-container .swagger-ui * {
                    color: #333 !important;
                    text-shadow: none !important;
                }

                /* 2. AGGRESSIVE BACKGROUND RESET (Kill the Navy!) */
                /* Target every possible container that might have a background */
                .swagger-container .swagger-ui .opblock-body,
                .swagger-container .swagger-ui .opblock-section,
                .swagger-container .swagger-ui .table-container,
                .swagger-container .swagger-ui .responses-table,
                .swagger-container .swagger-ui .parameters-table,
                .swagger-container .swagger-ui table,
                .swagger-container .swagger-ui thead,
                .swagger-container .swagger-ui tbody,
                .swagger-container .swagger-ui tr,
                .swagger-container .swagger-ui td,
                .swagger-container .swagger-ui th,
                .swagger-container .swagger-ui input,
                .swagger-container .swagger-ui select, 
                .swagger-container .swagger-ui textarea,
                .swagger-container .swagger-ui pre,
                .swagger-container .swagger-ui .highlight-code,
                .swagger-container .swagger-ui .microlight,
                .swagger-container .swagger-ui .dialog-ux .modal-ux {
                    background-color: white !important;
                    background: white !important;
                }

                /* 3. Button Styles (Keep readable) */
                .swagger-container .swagger-ui .btn {
                    background: white !important;
                    color: #333 !important;
                    border: 1px solid #888 !important;
                    box-shadow: none !important;
                }
                .swagger-container .swagger-ui .btn.authorize {
                    color: #49cc90 !important;
                    border-color: #49cc90 !important;
                }
                .swagger-container .swagger-ui .opblock-summary-method {
                    color: white !important; /* Keep method badges white text */
                }

                /* 4. Borders (Make them visible on white) */
                .swagger-container .swagger-ui table thead tr th, 
                .swagger-container .swagger-ui table tbody tr td { 
                    border-bottom: 1px solid #eee !important;
                }

                /* 5. Syntax Highlighting */
                .swagger-container .swagger-ui .sc-string { color: #008000 !important; }
                .swagger-container .swagger-ui .sc-number { color: #0000ff !important; }
                .swagger-container .swagger-ui .sc-boolean { color: #b22222 !important; }
                .swagger-container .swagger-ui .sc-key { color: #a52a2a !important; }
            `}</style>
            <SwaggerUI spec={swaggerJson} />
        </div>
    );
}
