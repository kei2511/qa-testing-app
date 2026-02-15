import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

// GET /api/categories — List all categories
export async function GET(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await query(
            'SELECT c.*, COUNT(p.id)::int as product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.name ASC'
        );

        return NextResponse.json({ categories: result.rows });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/categories — Create new category
export async function POST(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        // Check duplicate
        const existing = await query('SELECT id FROM categories WHERE name = $1', [name]);
        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: 'Category already exists' },
                { status: 409 }
            );
        }

        const result = await query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description || null]
        );

        return NextResponse.json(
            { message: 'Category created successfully', category: result.rows[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create category error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
