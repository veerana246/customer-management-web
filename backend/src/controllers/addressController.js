const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Get addresses by customerId
exports.getAddresses = async (req, res, next) => {
  try {
    const { customerId } = req.query;
    if(!customerId) return res.status(400).json({ message: 'customerId required' });
    const result = await db.query('SELECT * FROM addresses WHERE customer_id=$1', [customerId]);
    res.json(result.rows);
  } catch(err){ next(err); }
};

// Update address
exports.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { address_line, city, state, pincode, country, is_primary } = req.body;
    await db.query(
      `UPDATE addresses SET address_line=$1, city=$2, state=$3, pincode=$4, country=$5, is_primary=$6, updated_at=now() WHERE id=$7`,
      [address_line, city, state, pincode, country || 'IN', is_primary || false, id]
    );
    res.json({ message:'Address updated successfully' });
  } catch(err){ next(err); }
};

// Create new address
exports.createAddress = async (req, res, next) => {
  try {
    const { customer_id, address_line, city, state, pincode, country, is_primary } = req.body;
    const id = uuidv4();
    await db.query(
      `INSERT INTO addresses (id, customer_id, address_line, city, state, pincode, country, is_primary) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, customer_id, address_line, city, state, pincode, country || 'IN', is_primary || false]
    );
    res.status(201).json({ message:'Address created successfully' });
  } catch(err){ next(err); }
};

// Delete address
exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM addresses WHERE id=$1', [id]);
    res.json({ message:'Address deleted successfully' });
  } catch(err){ next(err); }
};
