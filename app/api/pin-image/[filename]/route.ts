import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
    req: NextRequest,
    { params }: { params: { filename: string } }
) {
    try {
        const filepath = path.join('/tmp/pins', params.filename)
        const file = await readFile(filepath)
        return new NextResponse(file, {
            headers: { 'Content-Type': 'image/png' }
        })
    } catch {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
}