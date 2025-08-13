import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Test backend connection
        const response = await fetch('http://localhost:5000/api/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            return NextResponse.json({
                status: 'ok',
                backend: 'connected',
                timestamp: new Date().toISOString()
            })
        } else {
            return NextResponse.json({
                status: 'error',
                backend: 'disconnected',
                error: 'Backend not responding'
            }, { status: 503 })
        }
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            backend: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 503 })
    }
}
