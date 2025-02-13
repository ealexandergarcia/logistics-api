import semver from "semver";

/**
 * Middleware for version control of API requests.
 * 
 * Checks the `x-version` header in the request and compares it with the required application version.
 * If the version matches, the request proceeds to the next middleware. Otherwise, the request is skipped.
 * 
 * @param {string} version - The required version to match against the `x-version` header.
 * @returns {function} Express middleware function that performs versioning check.
 */
export const versioning = (version) => {
  return (req, res, next) => {
    const requestedVersion = req.headers["x-version"];

    // If the version header is present
    if (requestedVersion) {
      // Check if the version is valid and matches the required version
      if (semver.valid(requestedVersion) && semver.eq(requestedVersion, version)) {
        return next();  // Allow the request to proceed
      } else {
        // If version doesn't match or is invalid, log the error and skip the request
        console.log(`Version mismatch: requested ${requestedVersion}, expected ${version}`);
        return res.status(400).json({
          status: 400,
          message: `API version mismatch. Expected version ${version}, but received ${requestedVersion}.`
        });
      }
    }

    // If the version header is not provided, continue to the next route
    return next("route");
  };
};

