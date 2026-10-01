const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. Create - Tạo mới sản phẩm
router.post('/', async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;
    const existing = await Product.findOne({ pid });
    if (existing) {
      return res.status(400).json({ success: false, message: 'pid đã tồn tại' });
    }
    const product = new Product({ pid, pname, price, quantity });
    const saved = await product.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Read All - Lấy danh sách tất cả sản phẩm
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Read One - Lấy thông tin sản phẩm theo pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Update - Cập nhật sản phẩm theo pid
router.put('/:pid', async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;
    const updated = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      { pname, price, quantity },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Delete - Xóa sản phẩm theo pid
router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    return res.status(200).json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;