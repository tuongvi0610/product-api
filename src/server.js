require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/productdb';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[Database] Đã kết nối thành công tới MongoDB: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[Server] API đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[Database Error] Không thể kết nối MongoDB:', err.message);
    process.exit(1);
  });