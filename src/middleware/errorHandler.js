const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
    }

    if (err.name === 'OpenRouterError') {
        return res.status(503).json({
            error: 'AI Service Error',
            message: 'Unable to generate workout plan at this time'
        });
    }

    if (err.name === 'RateLimitError') {
        return res.status(429).json({
            error: 'Too Many Requests',
            message: 'Please try again later'
        });
    }

    // Default error
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

module.exports = errorHandler;
