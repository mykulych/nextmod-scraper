function errorsHandler(error) {
    const { response, request } = error
    console.log(`[ERROR] 
    Status: ${response?.status}
    Status Text: ${response?.statusText}
    Message: ${error?.message}
    --- --- ---
    Headers: 
${request?._header}`)
}

module.exports = errorsHandler