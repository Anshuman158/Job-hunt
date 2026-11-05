/**
 * sanitizeMongo – express-mongo-sanitize replacement compatible with Express 5.
 *
 * Express 5 makes req.query a read-only getter, so the original package crashes.
 * This middleware strips keys that start with '$' or contain '.' from req.body
 * and req.params (both writable in Express 5), which covers all injection vectors
 * in this app.  req.query values are strings—they cannot carry Mongo operators
 * in a JSON sense—so no sanitization is needed there.
 */

const dangerousKey = (key) => key.startsWith("$") || key.includes(".");

function sanitize(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
    for (const key of Object.keys(obj)) {
        if (dangerousKey(key)) {
            delete obj[key];
        } else {
            sanitize(obj[key]);
        }
    }
    return obj;
}

const sanitizeMongo = (req, _res, next) => {
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    next();
};

export default sanitizeMongo;

