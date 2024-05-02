// async function createProduct(req, res) {
//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getProducts(req, res) {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getProduct(req, res) {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function updateProduct(req, res) {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     Object.assign(product, req.body);
//     await product.save();
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function deleteProduct(req, res) {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     await product.remove();
//     res.json({ message: 'Product deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }
