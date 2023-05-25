const fs = require('fs')

function writeDataFile(data, filePath) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), error => {
        if (error) {
            console.log('Write file error!: ', error)
            return
        }
        // console.log('File was written successfully!')
    })
}

module.exports = writeDataFile