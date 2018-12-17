exports.generateErrorJSON = (message, details) => {
  return {error: message, details: details}
}