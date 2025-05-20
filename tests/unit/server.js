const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 8000;

// 中间件
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json({ limit: '10mb' })); // 解析 JSON 格式的请求体，设置最大限制为 10MB
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // 解析 URL 编码的请求体
// 中间件：解析 JSON 请求体
app.use(express.json());


// 定义上传接口
app.post('/upload', (req, res) => {
    const transactionData = req.body; // 获取上传的交易数据
    console.log('收到的交易数据:', transactionData); // 输出交易数据
  
    // 返回成功响应
    res.json({ message: 1});
  });

// 模拟的查询接口
app.post('/query', (req, res) => {
  const { username, minAmount } = req.body;

  // 模拟返回的数据
  const responseData = {
    state: 200,
    data: {
        nodes: [
            { id: '0', text: '朴英华', color: 'rgba(178, 34, 34, 1)', width: 150, height: 150},
            { id: '1', text: '洪日', color: 'rgba(0, 0, 255, 1)' , width: 100, height: 100},
            { id: '2', text: '朴永春', color: 'rgba(0, 0, 255, 1)' , width: 50, height: 50}
        ],
        lines: [
            { from: '0', to: '1', text: '93924.00' },
            { from: '0', to: '2', text: '87800.00' }
        ]
    }
  };

  res.json(responseData);
});


// 配置 multer 存储选项
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // 指定文件上传的目录
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // 使用原始文件名
    }
  });
  
// 创建 multer 实例
const upload = multer({ storage: storage });

// 创建文件上传路由
app.post('/file', upload.single('file'), (req, res) => {
if (req.file) {
    console.log('File received:', req.file);
    res.json({ message: '文件上传成功', file: req.file });
} else {
    res.status(400).json({ message: '文件上传失败' });
}
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://127.0.0.1:${PORT}`);
});