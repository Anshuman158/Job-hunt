/**
 * validate(schema, source)
 * source: 'body' | 'query' | 'params' (defaults to 'body')
 */
export const validate = (schema, source = "body") => {
    return async (req, res, next) => {
        try {
            const dataToValidate = req[source];
            const parsed = await schema.parseAsync(dataToValidate);
            // In Express 5, req.query is a getter-only property and cannot be directly reassigned
            if (source === "query") {
                // Mutate the query object properties directly instead of reassigning req.query
                for (const key of Object.keys(parsed)) {
                    req.query[key] = parsed[key];
                }
            } else {
                req[source] = parsed;
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
