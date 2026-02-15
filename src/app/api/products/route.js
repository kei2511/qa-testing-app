import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

// GET /api/products — List products with search, filter, pagination, sort
export async function GET(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const sort = searchParams.get('sort') || 'created_at';
        const order = searchParams.get('order') || 'desc';

        // Validate sort column
        const allowedSorts = ['name', 'price', 'stock', 'created_at', 'updated_at'];
        const safeSort = allowedSorts.includes(sort) ? sort : 'created_at';
        const safeOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        const offset = (page - 1) * limit;

        let conditions = [];
        let values = [];
        let paramIndex = 1;

        if (search) {
            conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
            values.push(`%${search}%`);
            paramIndex++;
        }

        if (category) {
            conditions.push(`p.category_id = $${paramIndex}`);
            values.push(parseInt(category, 10));
            paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Count total
        const countResult = await query(
            `SELECT COUNT(*) as total FROM products p ${whereClause}`,
            values
        );
        const total = parseInt(countResult.rows[0].total, 10);

        // Get products
        const dataValues = [...values, limit, offset];
        const result = await query(
            `SELECT p.*, c.name as category_name, u.name as creator_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.created_by = u.id 
       ${whereClause}
       ORDER BY p.${safeSort} ${safeOrder}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            dataValues
        );

        return NextResponse.json({
            products: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/products — Create a new product
export async function POST(request) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, price, stock, category_id } = body;

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
            `INSERT INTO products (name, description, price, stock, category_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [name, description || null, price, stock || 0, category_id || null, authUser.id]
        );

        return NextResponse.json(
            { message: 'Product created successfully', product: result.rows[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
