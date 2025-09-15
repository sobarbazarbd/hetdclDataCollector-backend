/**
 * Utility functions for the GUID Gatherer application
 */

/**
 * Generates a standardized API response format
 * @param {boolean} success - Whether the request was successful
 * @param {string} message - Response message
 * @param {any} data - Response data
 * @param {any} error - Error information (if any)
 * @returns {Object} Standardized response object
 */
const createResponse = (success, message, data = null, error = null) => {
  return {
    success,
    message,
    data,
    error
  };
};

/**
 * Handles database errors and returns appropriate response
 * @param {Error} error - The database error
 * @param {string} entity - The entity being operated on (e.g., 'contractor', 'supplier')
 * @param {string} operation - The operation being performed (e.g., 'create', 'update', 'delete')
 * @returns {Object} Error response object
 */
const handleDatabaseError = (error, entity, operation) => {
  console.error(`Database error during ${operation} ${entity}:`, error);
  
  // Handle specific error codes
  if (error.code === '23505') { // Unique violation
    return createResponse(
      false, 
      `${entity.charAt(0).toUpperCase() + entity.slice(1)} with these details already exists`,
      null,
      { code: 'DUPLICATE_ENTRY', details: error.detail }
    );
  }
  
  if (error.code === '23503') { // Foreign key violation
    return createResponse(
      false, 
      `Related record not found`,
      null,
      { code: 'RELATED_RECORD_NOT_FOUND', details: error.detail }
    );
  }
  
  // Generic error response
  return createResponse(
    false, 
    `Failed to ${operation} ${entity}`,
    null,
    { code: 'DATABASE_ERROR', details: error.message }
  );
};

/**
 * Generates a sequential number for new records
 * @param {string} table - The table name to get the next sequence for
 * @param {Object} pool - The database connection pool
 * @returns {Promise<number>} The next sequential number
 */
const getNextSequence = async (table, pool) => {
  try {
    // Get the maximum s_no value from the table
    const result = await pool.query(`SELECT MAX(s_no) as max_s_no FROM ${table}`);
    const maxSNo = result.rows[0].max_s_no;
    
    // Return the next sequence number
    return maxSNo ? maxSNo + 1 : 1;
  } catch (error) {
    console.error(`Error getting next sequence for ${table}:`, error);
    throw error;
  }
};

/**
 * Validates contact number format
 * @param {string} contactNo - The contact number to validate
 * @returns {boolean} Whether the contact number is valid
 */
const isValidContactNo = (contactNo) => {
  const contactRegex = /^[0-9+\-\s()]{10,15}$/;
  return contactRegex.test(contactNo);
};

/**
 * Sanitizes input data to prevent XSS attacks
 * @param {any} data - The data to sanitize
 * @returns {any} Sanitized data
 */
const sanitizeInput = (data) => {
  if (typeof data === 'string') {
    // Remove potentially dangerous characters
    return data.replace(/[<>]/g, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeInput(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const key in data) {
      sanitized[key] = sanitizeInput(data[key]);
    }
    return sanitized;
  }
  
  return data;
};

/**
 * Formats data for CSV export
 * @param {Array} data - The data to format
 * @param {Array} headers - The CSV headers
 * @returns {string} CSV formatted string
 */
const formatCSV = (data, headers) => {
  const headerRow = headers.join(',');
  const dataRows = data.map(item => {
    return headers.map(header => {
      const value = item[header.toLowerCase().replace(/\s+/g, '_')] || '';
      // Escape quotes and wrap in quotes if contains commas
      return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Paginates array data
 * @param {Array} data - The data to paginate
 * @param {number} page - The page number
 * @param {number} limit - The number of items per page
 * @returns {Object} Paginated result
 */
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const result = data.slice(startIndex, endIndex);
  
  return {
    data: result,
    currentPage: page,
    totalPages: Math.ceil(data.length / limit),
    totalItems: data.length,
    hasNext: endIndex < data.length,
    hasPrev: startIndex > 0
  };
};

/**
 * Generates a random password
 * @param {number} length - The length of the password
 * @returns {string} Generated password
 */
const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * Logs API requests for debugging and monitoring
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {number} startTime - The start time of the request
 */
const logRequest = (req, res, startTime) => {
  const duration = Date.now() - startTime;
  const logMessage = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress
  };
  
  console.log(JSON.stringify(logMessage));
};

module.exports = {
  createResponse,
  handleDatabaseError,
  getNextSequence,
  isValidContactNo,
  sanitizeInput,
  formatCSV,
  paginate,
  generatePassword,
  logRequest
};