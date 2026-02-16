import { NextResponse } from 'next/server';
import swaggerJson from '@/lib/swagger.json';

export async function GET() {
    return NextResponse.json(swaggerJson);
}
