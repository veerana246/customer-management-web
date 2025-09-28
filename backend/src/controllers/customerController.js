const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Create Customer
exports.createCustomer = async (req, res, next) => {
  try {
    const { first_name, last_name, phone, email, addresses } = req.body;
    if(!first_name || !last_name || !phone) return res.status(400).json({ message: 'Missing required fields' });

    const id = uuidv4();
    const result = await db.query(
      `INSERT INTO customers (id, first_name, last_name, phone, email, only_one_address)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [id, first_name, last_name, phone, email || null, addresses?.length === 1]
    );

    // Insert addresses if any
    if(addresses?.length){
      for(const addr of addresses){
        const addrId = uuidv4();
        await db.query(
          `INSERT INTO addresses (id, customer_id, address_line, city, state, pincode, country, is_primary)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [addrId, id, addr.address_line, addr.city, addr.state, addr.pincode, addr.country || 'IN', addr.is_primary || false]
        );
      }
    }

    res.status(201).json({ message: 'Customer created successfully', customer: result.rows[0] });
  } catch(err){ next(err); }
};

// Get Customers (with optional filters)
exports.getCustomers = async (req, res, next) => {
  try {
    const { city, state, pincode, page=1, pageSize=20 } = req.query;
    let query = `SELECT c.*, array_agg(json_build_object('id', a.id,'address_line',a.address_line,'city',a.city,'state',a.state,'pincode',a.pincode,'country',a.country,'is_primary',a.is_primary)) as addresses
                 FROM customers c
                 LEFT JOIN addresses a ON a.customer_id = c.id`;
    let conditions = [], params=[];
    if(city){ params.push(city); conditions.push(`a.city=$${params.length}`); }
    if(state){ params.push(state); conditions.push(`a.state=$${params.length}`); }
    if(pincode){ params.push(pincode); conditions.push(`a.pincode=$${params.length}`); }
    if(conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' GROUP BY c.id ORDER BY c.created_at DESC';
    query += ` LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(parseInt(pageSize), (parseInt(page)-1)*parseInt(pageSize));

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch(err){ next(err); }
};

// Get Single Customer
exports.getCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT c.*, array_agg(json_build_object('id', a.id,'address_line',a.address_line,'city',a.city,'state',a.state,'pincode',a.pincode,'country',a.country,'is_primary',a.is_primary)) as addresses
       FROM customers c
       LEFT JOIN addresses a ON a.customer_id = c.id
       WHERE c.id=$1 GROUP BY c.id`, [id]
    );
    if(result.rows.length===0) return res.status(404).json({ message:'Customer not found' });
    res.json(result.rows[0]);
  } catch(err){ next(err); }
};

// Update Customer
exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, email, addresses } = req.body;
    const only_one_address = addresses?.length === 1;

    await db.query(
      `UPDATE customers SET first_name=$1,last_name=$2,phone=$3,email=$4,only_one_address=$5,updated_at=now() WHERE id=$6`,
      [first_name, last_name, phone, email || null, only_one_address, id]
    );

    // Update addresses
    if(addresses?.length){
      for(const addr of addresses){
        if(addr.id){
          await db.query(
            `UPDATE addresses SET address_line=$1,city=$2,state=$3,pincode=$4,country=$5,is_primary=$6,updated_at=now() WHERE id=$7`,
            [addr.address_line, addr.city, addr.state, addr.pincode, addr.country || 'IN', addr.is_primary || false, addr.id]
          );
        } else {
          const addrId = uuidv4();
          await db.query(
            `INSERT INTO addresses (id, customer_id, address_line, city, state, pincode, country, is_primary)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [addrId, id, addr.address_line, addr.city, addr.state, addr.pincode, addr.country || 'IN', addr.is_primary || false]
          );
        }
      }
    }

    res.json({ message: 'Customer updated successfully' });
  } catch(err){ next(err); }
};

// Delete Customer
exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM customers WHERE id=$1', [id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch(err){ next(err); }
};
