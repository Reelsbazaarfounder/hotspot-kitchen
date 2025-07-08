-- Complete Restaurant Management System Schema
-- This migration creates all tables, policies, and data in one shot

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS restaurant_settings CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;

-- Create menu_items table
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL CHECK (price > 0),
  category text NOT NULL,
  description text,
  image text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  items jsonb NOT NULL,
  total integer NOT NULL CHECK (total > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create restaurant_settings table
CREATE TABLE restaurant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_number text NOT NULL DEFAULT '9035698277',
  offer_banner text NOT NULL DEFAULT 'Special Offer: Get 20% off on orders above ₹500!',
  app_name_image text,
  address text DEFAULT 'Karatagi, City',
  updated_at timestamptz DEFAULT now()
);

-- Create coupons table
CREATE TABLE coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount integer NOT NULL CHECK (discount > 0 AND discount <= 100),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a restaurant app)
CREATE POLICY "Public access to menu items" ON menu_items FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access to orders" ON orders FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access to restaurant settings" ON restaurant_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public access to coupons" ON coupons FOR ALL TO public USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(available);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_coupons_active ON coupons(active);

-- Insert default restaurant settings
INSERT INTO restaurant_settings (contact_number, offer_banner, address)
VALUES ('9035698277', 'Special Offer: Get 20% off on orders above ₹500!', 'Karatagi, City');

-- Insert default coupons
INSERT INTO coupons (code, discount) VALUES 
  ('WELCOME20', 20),
  ('SAVE10', 10);

-- Insert all menu items including Shawarma category
INSERT INTO menu_items (name, price, category, description, available) VALUES
  -- VEG STARTERS
  ('Gobi Manchurian Full', 120, 'Veg Starters', 'Crispy cauliflower in tangy Manchurian sauce', true),
  ('Gobi Manchurian Half', 80, 'Veg Starters', 'Crispy cauliflower in tangy Manchurian sauce', true),
  ('Gobi Chilli Full', 120, 'Veg Starters', 'Spicy cauliflower with bell peppers and onions', true),
  ('Gobi Chilli Half', 80, 'Veg Starters', 'Spicy cauliflower with bell peppers and onions', true),
  ('Gobi 65 Full', 130, 'Veg Starters', 'Deep fried spiced cauliflower', true),
  ('Gobi 65 Half', 90, 'Veg Starters', 'Deep fried spiced cauliflower', true),
  ('Pakoda/Pepper Dry Full', 120, 'Veg Starters', 'Crispy fritters with pepper seasoning', true),
  ('Pakoda/Pepper Dry Half', 80, 'Veg Starters', 'Crispy fritters with pepper seasoning', true),
  ('Paneer Manchurian', 130, 'Veg Starters', 'Cottage cheese in Manchurian sauce', true),
  ('Paneer Chilli', 130, 'Veg Starters', 'Spicy paneer with capsicum and onions', true),
  ('Paneer 65', 140, 'Veg Starters', 'Deep fried spiced cottage cheese', true),
  ('Paneer Pepper Dry', 140, 'Veg Starters', 'Paneer with black pepper seasoning', true),
  ('Paneer Majestic', 150, 'Veg Starters', 'Special paneer preparation with herbs', true),
  ('Mushroom Manchuria/65/Chilly', 130, 'Veg Starters', 'Mushroom in various spicy preparations', true),
  ('Mushroom Pakoda/Pepper Dry', 130, 'Veg Starters', 'Crispy mushroom fritters', true),
  ('Kaju Roast', 140, 'Veg Starters', 'Roasted cashews with spices', true),
  ('Finger Chips', 40, 'Veg Starters', 'Crispy potato fries', true),
  ('Aloo 65', 60, 'Veg Starters', 'Spiced potato preparation', true),
  ('Masala Papad', 35, 'Veg Starters', 'Crispy papad with onion and tomato topping', true),
  ('Roasted Papad', 35, 'Veg Starters', 'Plain roasted papad', true),
  ('Peanut Masala', 40, 'Veg Starters', 'Spiced roasted peanuts', true),
  ('Onion Pakoda', 40, 'Veg Starters', 'Crispy onion fritters', true),
  ('Capsicum Pakoda', 70, 'Veg Starters', 'Crispy capsicum fritters', true),
  ('Green Salad', 30, 'Veg Starters', 'Fresh mixed green salad', true),
  ('Cucumber Salad', 30, 'Veg Starters', 'Fresh cucumber salad', true),

  -- EGG STARTERS
  ('Boiled Eggs (2 pcs)', 25, 'Egg Starters', 'Two perfectly boiled eggs', true),
  ('Egg Burji', 40, 'Egg Starters', 'Scrambled eggs with spices', true),
  ('Egg 65', 60, 'Egg Starters', 'Spicy fried egg preparation', true),
  ('Egg Chilly', 70, 'Egg Starters', 'Eggs with bell peppers and onions', true),
  ('Egg Pepper Dry', 70, 'Egg Starters', 'Eggs with black pepper seasoning', true),
  ('Egg Omlet', 30, 'Egg Starters', 'Classic egg omelet', true),
  ('Egg Pakoda', 80, 'Egg Starters', 'Egg fritters in gram flour batter', true),

  -- MUTTON STARTERS
  ('Mutton Masala', 200, 'Mutton Starters', 'Spicy mutton preparation', true),
  ('Mutton Fry', 190, 'Mutton Starters', 'Dry fried mutton pieces', true),
  ('Mutton Ghee Roast', 230, 'Mutton Starters', 'Mutton roasted in ghee with spices', true),
  ('Mutton Pepper Dry', 230, 'Mutton Starters', 'Mutton with black pepper', true),
  ('Mutton 65', 220, 'Mutton Starters', 'Spicy fried mutton', true),

  -- NON VEG STARTERS
  ('Chicken 555', 150, 'Non Veg Starters', 'Special chicken preparation', true),
  ('Dragon Chicken', 150, 'Non Veg Starters', 'Spicy chicken with unique flavor', true),
  ('Chicken Lollipop (5 pcs)', 120, 'Non Veg Starters', 'Chicken drumettes shaped like lollipops', true),
  ('Chicken Majestic', 150, 'Non Veg Starters', 'Special chicken preparation with herbs', true),
  ('Schezwan Chicken', 130, 'Non Veg Starters', 'Chicken in spicy Schezwan sauce', true),
  ('Chicken Drumsticks (5 pcs)', 140, 'Non Veg Starters', 'Marinated chicken drumsticks', true),
  ('Lemon Chicken', 140, 'Non Veg Starters', 'Chicken with tangy lemon flavor', true),
  ('Garlic Chicken', 120, 'Non Veg Starters', 'Chicken with garlic seasoning', true),
  ('Ginger Chicken', 120, 'Non Veg Starters', 'Chicken with ginger flavor', true),
  ('Cashew Chicken', 150, 'Non Veg Starters', 'Chicken with cashew nuts', true),
  ('Hot Wings (6 pcs)', 110, 'Non Veg Starters', 'Spicy chicken wings', true),

  -- TANDOOR
  ('Tandoor Chicken Full', 380, 'Tandoor', 'Full chicken cooked in tandoor', true),
  ('Tandoor Chicken Half', 210, 'Tandoor', 'Half chicken cooked in tandoor', true),
  ('Chicken Teeka (6 pcs)', 140, 'Tandoor', 'Marinated chicken pieces', true),
  ('Afghani Chicken', 150, 'Tandoor', 'Creamy marinated chicken', true),
  ('Malai Teeka', 150, 'Tandoor', 'Creamy chicken tikka', true),
  ('Pudina Teeka', 150, 'Tandoor', 'Mint flavored chicken tikka', true),
  ('Reshmi Kabab', 160, 'Tandoor', 'Silky smooth chicken kabab', true),
  ('Harihali Kabab', 140, 'Tandoor', 'Green herb marinated kabab', true),
  ('Tangadi Kabab Full', 300, 'Tandoor', 'Full chicken leg kabab', true),
  ('Tangadi Kabab Half', 160, 'Tandoor', 'Half chicken leg kabab', true),
  ('Tandoor Plater Kabab', 450, 'Tandoor', 'Mixed tandoor platter', true),
  ('Chicken Kabab', 100, 'Tandoor', 'Classic chicken kabab', true),
  ('Paneer Teeka', 150, 'Tandoor', 'Marinated cottage cheese', true),
  ('Mushroom Teeka', 120, 'Tandoor', 'Marinated mushroom pieces', true),
  ('Gobi Teeka Veg Plater', 260, 'Tandoor', 'Mixed vegetarian tandoor platter', true),

  -- TANDOOR ROTTIES
  ('Butter Naan', 45, 'Tandoor Rotties', 'Soft bread with butter', true),
  ('Plain Naan', 35, 'Tandoor Rotties', 'Traditional Indian bread', true),
  ('Garlic Naan', 50, 'Tandoor Rotties', 'Naan with garlic topping', true),
  ('Cheese Naan', 60, 'Tandoor Rotties', 'Naan stuffed with cheese', true),
  ('Tandoor Roti', 25, 'Tandoor Rotties', 'Whole wheat bread from tandoor', true),
  ('Butter Roti', 30, 'Tandoor Rotties', 'Tandoor roti with butter', true),

  -- ROLLS
  ('Veg Rolls', 40, 'Rolls', 'Vegetable wrap in roti', true),
  ('Egg Rolls', 50, 'Rolls', 'Egg wrap in roti', true),
  ('Paneer Rolls', 80, 'Rolls', 'Paneer wrap in roti', true),
  ('Chicken Rolls', 80, 'Rolls', 'Chicken wrap in roti', true),

  -- SHAWARMA (NEW CATEGORY)
  ('Chicken Shawarma', 120, 'Shawarma', 'Tender chicken wrapped in pita bread with vegetables and sauce', true),
  ('Mutton Shawarma', 150, 'Shawarma', 'Juicy mutton wrapped in pita bread with fresh vegetables', true),
  ('Chicken Shawarma Plate', 180, 'Shawarma', 'Chicken shawarma served with rice and salad', true),
  ('Mutton Shawarma Plate', 220, 'Shawarma', 'Mutton shawarma served with rice and salad', true),
  ('Mixed Shawarma', 160, 'Shawarma', 'Combination of chicken and mutton shawarma', true),
  ('Shawarma Roll', 100, 'Shawarma', 'Shawarma wrapped in soft roti with vegetables', true),
  ('Chicken Shawarma Bowl', 140, 'Shawarma', 'Deconstructed shawarma served in a bowl with rice', true),
  ('Mutton Shawarma Bowl', 170, 'Shawarma', 'Deconstructed mutton shawarma served in a bowl', true),
  ('Shawarma Salad', 130, 'Shawarma', 'Fresh salad topped with shawarma meat', true),
  ('Mini Shawarma (3 pcs)', 90, 'Shawarma', 'Three mini shawarma wraps perfect for sharing', true),

  -- RICE ITEMS
  ('Special Rice', 120, 'Rice Items', 'Chef special rice preparation', true),
  ('Ghee Rice', 90, 'Rice Items', 'Aromatic rice cooked in ghee', true),
  ('Jeera Rice', 70, 'Rice Items', 'Cumin flavored rice', true),
  ('Masala Rice', 70, 'Rice Items', 'Spiced rice preparation', true),
  ('Veg Fried Rice', 80, 'Rice Items', 'Fried rice with vegetables', true),
  ('Jeera Fried Rice', 80, 'Rice Items', 'Cumin flavored fried rice', true),
  ('Paneer Fried Rice', 100, 'Rice Items', 'Fried rice with paneer', true),
  ('Mushroom Fried Rice', 100, 'Rice Items', 'Fried rice with mushroom', true),
  ('Kaju Paneer Fried Rice', 110, 'Rice Items', 'Fried rice with cashew and paneer', true),
  ('Schezwan Fried Rice', 110, 'Rice Items', 'Spicy Schezwan fried rice', true),
  ('Schezwan Paneer Fried Rice', 110, 'Rice Items', 'Schezwan rice with paneer', true),
  ('Schezwan Mushroom Fried Rice', 110, 'Rice Items', 'Schezwan rice with mushroom', true),
  ('Gobi Fried Rice', 90, 'Rice Items', 'Fried rice with cauliflower', true),
  ('Lemon Rice', 70, 'Rice Items', 'Tangy lemon flavored rice', true),
  ('Tomato Rice', 70, 'Rice Items', 'Tomato flavored rice', true),
  ('Andhra Chilli Fried Rice', 110, 'Rice Items', 'Spicy Andhra style fried rice', true),
  ('Egg Rice', 85, 'Rice Items', 'Rice with scrambled eggs', true),
  ('Boiled Egg Rice', 70, 'Rice Items', 'Rice with boiled eggs', true),
  ('Special Curd Rice', 70, 'Rice Items', 'Yogurt rice with tempering', true),
  ('Plain White Rice', 50, 'Rice Items', 'Steamed white rice', true),
  ('Biryani Rice (Khushka)', 70, 'Rice Items', 'Plain biryani rice', true),

  -- VEG CURRIES
  ('Dal Fry', 70, 'Veg Curries', 'Tempered lentil curry', true),
  ('Dal Tadka', 90, 'Veg Curries', 'Spiced lentil curry', true),
  ('Tomato Dall', 70, 'Veg Curries', 'Tomato flavored lentil curry', true),
  ('Mix Veg Curry', 90, 'Veg Curries', 'Mixed vegetable curry', true),
  ('Dall Kolhapuri', 90, 'Veg Curries', 'Spicy Kolhapuri style dal', true),
  ('Veg Kolhapuri', 110, 'Veg Curries', 'Spicy Kolhapuri vegetable curry', true),
  ('Chenna Masala', 110, 'Veg Curries', 'Chickpea curry', true),
  ('Chenna Fry', 90, 'Veg Curries', 'Dry chickpea preparation', true),
  ('Paneer Masala', 130, 'Veg Curries', 'Cottage cheese in spicy gravy', true),
  ('Veg Kadai', 110, 'Veg Curries', 'Mixed vegetables in kadai style', true),
  ('Palak Paneer', 130, 'Veg Curries', 'Paneer in spinach gravy', true),
  ('Paneer Butter Masala', 160, 'Veg Curries', 'Paneer in rich tomato gravy', true),
  ('Panner Kadai', 160, 'Veg Curries', 'Paneer in kadai style gravy', true),
  ('Andhra Panner Masala', 160, 'Veg Curries', 'Spicy Andhra style paneer', true),
  ('Kaju Panner Masala', 170, 'Veg Curries', 'Paneer with cashew gravy', true),
  ('Panner Tikka Masala', 160, 'Veg Curries', 'Grilled paneer in masala gravy', true),
  ('Mushroom Kadai', 160, 'Veg Curries', 'Mushroom in kadai style gravy', true),
  ('Andhra Mushroom Masala', 160, 'Veg Curries', 'Spicy Andhra style mushroom', true),

  -- NON VEG CURRIES
  ('Chicken Curry', 130, 'Non Veg Curries', 'Traditional chicken curry', true),
  ('Chicken Masala', 130, 'Non Veg Curries', 'Spicy chicken masala', true),
  ('Chicken Kadai', 150, 'Non Veg Curries', 'Chicken in kadai style gravy', true),
  ('Chicken Tikka Masala', 150, 'Non Veg Curries', 'Grilled chicken in masala gravy', true),
  ('Punjabi Curry', 150, 'Non Veg Curries', 'Punjabi style chicken curry', true),
  ('Butter Chicken', 150, 'Non Veg Curries', 'Chicken in rich butter gravy', true),
  ('Guntur Chicken', 150, 'Non Veg Curries', 'Spicy Guntur style chicken', true),
  ('Chicken Masala (Bone)', 130, 'Non Veg Curries', 'Bone-in chicken masala', true),
  ('Chicken Masala (Boneless)', 160, 'Non Veg Curries', 'Boneless chicken masala', true),
  ('Andhra Chicken Curry (Bone)', 130, 'Non Veg Curries', 'Spicy Andhra style bone-in chicken', true),
  ('Andhra Chicken Curry (Boneless)', 160, 'Non Veg Curries', 'Spicy Andhra style boneless chicken', true),
  ('Palak Chicken (Bone)', 130, 'Non Veg Curries', 'Bone-in chicken in spinach gravy', true),
  ('Palak Chicken (Boneless)', 160, 'Non Veg Curries', 'Boneless chicken in spinach gravy', true),
  ('Kadai Chicken (Bone)', 150, 'Non Veg Curries', 'Bone-in chicken kadai', true),
  ('Kadai Chicken (Boneless)', 170, 'Non Veg Curries', 'Boneless chicken kadai', true),
  ('Punjabi Chicken (Bone)', 150, 'Non Veg Curries', 'Bone-in Punjabi chicken', true),
  ('Punjabi Chicken (Boneless)', 170, 'Non Veg Curries', 'Boneless Punjabi chicken', true),
  ('Butter Spicy Chicken (Bone)', 150, 'Non Veg Curries', 'Spicy bone-in butter chicken', true),
  ('Butter Chicken (Boneless)', 170, 'Non Veg Curries', 'Boneless butter chicken', true),
  ('Chicken Mughalai', 170, 'Non Veg Curries', 'Rich Mughlai style chicken', true),
  ('Kaju Chicken Masala', 170, 'Non Veg Curries', 'Chicken with cashew gravy', true),

  -- NON VEG BIRYANI
  ('Chicken Biryani', 110, 'Non Veg Biryani', 'Aromatic chicken biryani', true),
  ('Chicken Fry Biryani', 130, 'Non Veg Biryani', 'Biryani with fried chicken', true),
  ('Chicken 65 Biryani', 130, 'Non Veg Biryani', 'Biryani with chicken 65', true),
  ('Chicken Manchurian Biryani', 140, 'Non Veg Biryani', 'Biryani with Manchurian chicken', true),
  ('Tandoor Biryani', 160, 'Non Veg Biryani', 'Biryani with tandoor chicken', true),
  ('Mutton Biryani', 180, 'Non Veg Biryani', 'Aromatic mutton biryani', true),
  ('Chilly Chicken Biryani', 130, 'Non Veg Biryani', 'Biryani with chilly chicken', true),

  -- VEG BIRYANI
  ('Mushroom 65 Biryani', 110, 'Veg Biryani', 'Biryani with mushroom 65', true),
  ('Veg Biryani', 90, 'Veg Biryani', 'Mixed vegetable biryani', true),
  ('Mushroom Biryani', 110, 'Veg Biryani', 'Aromatic mushroom biryani', true),
  ('Baby Corn Biryani', 90, 'Veg Biryani', 'Biryani with baby corn', true),
  ('Gobi Biryani', 90, 'Veg Biryani', 'Cauliflower biryani', true),
  ('Gobi Manchurian Biryani', 130, 'Veg Biryani', 'Biryani with Gobi Manchurian', true),
  ('Chenna Biryani', 110, 'Veg Biryani', 'Chickpea biryani', true),
  ('Baby Corn 65 Biryani', 130, 'Veg Biryani', 'Biryani with baby corn 65', true),
  ('Mushroom Fry Biryani', 120, 'Veg Biryani', 'Biryani with fried mushroom', true);