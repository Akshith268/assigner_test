const rateLimitMap = new Map(); // In-memory store

const rateLimiter = (req, res, next) => {
  const ip = req.ip; // Get user IP
  const now = Date.now();
  const timeWindow = 60 * 1000; // 1 minute
  const maxRequests = 10; // Limit

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  // Get timestamps for the IP
  const requestTimes = rateLimitMap.get(ip);
  
  // Remove timestamps older than 1 minute
  while (requestTimes.length > 0 && requestTimes[0] < now - timeWindow) {
    requestTimes.shift();
  }

  console.log(`IP: ${ip}, Requests: ${requestTimes.length}, Timestamps:`, requestTimes);

  if (requestTimes.length >= maxRequests) {
    return res.status(429).json({ message: "Too many requests. Try again later." });
  }

  // Add new request timestamp
  requestTimes.push(now);
  rateLimitMap.set(ip, requestTimes);

  next(); // Allow request
};

module.exports = rateLimiter;
