/**
 * ERROR MIDDLEWARE CONCEPT:
 * Express has a default error handler, but we want our API to 
 * return clean JSON errors instead of HTML pages.
 * 
 * WHY USE THIS?
 * It keeps our controller code clean. We just throw errors, and 
 * this middleware catches them and formats the response.
 */

const errorHandler = (err, req, res, next) => {
    // If the status code is 200 (Success), we change it to 500 (Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode);
    res.json({
        message: err.message,
        // We only show the stack trace if we are NOT in production
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
