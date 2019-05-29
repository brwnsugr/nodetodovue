const path = require('path');

module.exports = {
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer:{ 
        proxy:{ // server를 proxy로 설정하여 클라이언트에서도 서버에 접속할 수 있게 함 
          '/api':{  
            target:'http://localhost:5000'
          }  
        }
    }
};