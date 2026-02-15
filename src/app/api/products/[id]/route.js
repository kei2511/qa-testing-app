import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

// GET /api/products/:id — Get product detail
export async function GET(request, { params }) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const result = await query(
            `SELECT p.*, c.name as category_name, u.name as creator_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.created_by = u.id 
       WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product: result.rows[0] });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/products/:id — Update product
export async function PUT(request, { params }) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, description, price, stock, category_id } = body;

        // Check if product exists
        const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Validation
        if (!name || price === undefined || price === null) {
            return NextResponse.json(
                { error: 'Name and price are required' },
                { status: 400 }
            );
        }

        if (typeof price !== 'number' || price < 0) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            );
        }

        if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
            return NextResponse.json(
                { error: 'Stock must be a non-negative number' },
                { status: 400 }
            );
        }

        const result = await query(
            `UPDATE products 
       SET name = $1, description = $2, price = $3, stock = $4, category_id = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
            [name, description || null, price, stock || 0, category_id || null, id]
        );

        return NextResponse.json({
            message: 'Product updated successfully',
            product: result.rows[0],
        });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/products/:id — Delete product
export async function DELETE(request, { params }) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const result = await query(
            'DELETE FROM products WHERE id = $1 RETURNING id, name',
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Product deleted successfully',
            product: result.rows[0],
        });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
