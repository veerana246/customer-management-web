CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name STRING NOT NULL,
  last_name STRING NOT NULL,
  phone STRING NOT NULL UNIQUE,
  email STRING UNIQUE,
  account_type STRING DEFAULT 'standard',
  only_one_address BOOL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_line STRING NOT NULL,
  city STRING,
  state STRING,
  pincode STRING,
  country STRING DEFAULT 'IN',
  is_primary BOOL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
