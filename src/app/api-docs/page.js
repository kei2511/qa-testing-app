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
                /* REVERT TO DEFAULT SWAGGER LOOK (Light Mode) */
                
                /* Force all text to start as dark gray (override App's global white text) */
                .swagger-container .swagger-ui,
                .swagger-container .swagger-ui * {
                    color: #333 !important;
                }

                /* Ensure Input/Select backgrounds are white */
                .swagger-container .swagger-ui input,
                .swagger-container .swagger-ui select, 
                .swagger-container .swagger-ui textarea {
                    background-color: white !important;
                    border: 1px solid #d9d9d9 !important;
                }

                /* Fix specific colored elements (Methods, Links) so they aren't just black */
                .swagger-container .swagger-ui .opblock-summary-method {
                    color: white !important; /* Method badges (GET/POST) need white text */
                    text-shadow: none !important;
                }
                .swagger-container .swagger-ui a.nostyle {
                    color: #333 !important;
                }
                .swagger-container .swagger-ui .btn {
                    color: #333 !important;
                    border-color: #333 !important;
                }
                .swagger-container .swagger-ui .btn.authorize {
                    color: #49cc90 !important;
                    border-color: #49cc90 !important;
                }
                .swagger-container .swagger-ui .btn.authorize svg {
                    fill: #49cc90 !important;
                }
                
                /* Syntax Highlighting overrides if needed */
                .swagger-container .swagger-ui .sc-string { color: #008000 !important; }
                .swagger-container .swagger-ui .sc-number { color: #008000 !important; }
                .swagger-container .swagger-ui .sc-boolean { color: #b22222 !important; }
                .swagger-container .swagger-ui .sc-key { color: #a52a2a !important; }
            `}</style>
            <SwaggerUI spec={swaggerJson} />
        </div>
    );
}
