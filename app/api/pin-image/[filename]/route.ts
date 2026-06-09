import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await context.params
        const filepath = path.join('/tmp/pins', filename)
        const file = await readFile(filepath)
        return new NextResponse(file, {
            headers: { 'Content-Type': 'image/png' }
        })
    } catch {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
}