import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
    const { title, category, rating, image, slug } = await req.json()

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verdict.maplehub.cloud'
    const templateUrl = `${baseUrl}/pin-template?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}&rating=${encodeURIComponent(rating)}&image=${encodeURIComponent(image)}`

    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        headless: true,
    })

    try {
        const page = await browser.newPage()
        await page.setViewport({ width: 1000, height: 1500 })
        await page.goto(templateUrl, { waitUntil: 'networkidle0' })

        const screenshotBuffer = await page.screenshot({ type: 'png' })

        const pinsDir = '/tmp/pins'
        await mkdir(pinsDir, { recursive: true })

        const filename = `pin-${slug}-${Date.now()}.png`
        const filepath = path.join(pinsDir, filename)
        await writeFile(filepath, screenshotBuffer)

        return NextResponse.json({
            success: true,
            pin_image_url: `${baseUrl}/api/pin-image/${filename}`
        })
    } catch (err) {
        console.error('Pin generation error:', err)
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
    } finally {
        await browser.close()
    }
}