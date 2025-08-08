import { instrument } from '@microlabs/otel-cf-workers';
import { trace } from '@opentelemetry/api';
async function fetch(request, env, ctx) {
    console.log('Request received:', request.method, request.url);
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    try {
        const body = await request.json();
        // Validate required fields
        if (!body.firstName || !body.lastName || !body.userId) {
            return new Response(JSON.stringify({
                authenticated: false,
                message: 'Missing required fields: firstName, lastName, userId'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // Mock authentication logic - authenticate users with specific criteria
        const isAuthenticated = mockAuthenticate(body.firstName, body.lastName, body.userId);
        console.log('Authentication result:', isAuthenticated);
        // Add trace attributes
        trace.getActiveSpan()?.setAttributes({
            'user.id': body.userId,
            'auth.result': isAuthenticated
        });
        const response = {
            authenticated: isAuthenticated,
            message: isAuthenticated ? 'Authentication successful' : 'Authentication failed'
        };
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error) {
        return new Response(JSON.stringify({
            authenticated: false,
            message: 'Invalid JSON in request body'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
function mockAuthenticate(firstName, lastName, userId) {
    // Mock authentication rules:
    // 1. User ID must be numeric
    // 2. First name must be at least 2 characters
    // 3. Last name must be at least 2 characters
    // 4. User ID must not start with '0'
    if (!/^\d+$/.test(userId)) {
        return false;
    }
    if (userId.startsWith('0')) {
        return false;
    }
    if (firstName.length < 2 || lastName.length < 2) {
        return false;
    }
    return true;
}
const configResolver = (env, _trigger) => {
    let parsedHeaders = {};
    if (env.OTEL_EXPORTER_OTLP_TRACES_HEADERS) {
        try {
            parsedHeaders = JSON.parse(env.OTEL_EXPORTER_OTLP_TRACES_HEADERS);
            if (env.DD_API_KEY) {
                parsedHeaders['dd-api-key'] = env.DD_API_KEY;
            }
        }
        catch (e) {
            console.warn('Failed to parse OTEL_EXPORTER_OTLP_TRACES_HEADERS:', e);
            parsedHeaders = {};
        }
    }
    const config = {
        exporter: {
            url: env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || '',
            headers: parsedHeaders
        },
        service: {
            name: env.OTEL_SERVICE_NAME || 'dd-otel-traces',
            version: env.OTEL_SERVICE_VERSION || '1.0.0'
        }
    };
    console.log('OpenTelemetry Config:', {
        url: config.exporter.url,
        hasHeaders: Object.keys(config.exporter.headers).length > 0,
        headerKeys: Object.keys(config.exporter.headers),
        headerValues: Object.values(config.exporter.headers),
        serviceName: config.service.name,
        apiKey: env.DD_API_KEY ? env.DD_API_KEY.slice(-4) : undefined
    });
    return config;
};
const handler = {
    fetch: fetch,
};
export default instrument(handler, configResolver);
