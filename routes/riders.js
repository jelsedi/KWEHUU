const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

router.post('/register', async (req, res) => {
  const { user_id, name, phone, vehicle_type, license_number } = req.body;
  if (!user_id || !name || !phone || !vehicle_type) {
    return res.status(400).json({ error: 'user_id, name, phone, and vehicle_type are required' });
  }

  const { data, error } = await supabase.from('riders').insert({
    user_id,
    name,
    phone,
    vehicle_type,
    license_number,
    approved: false,
    available: false,
    created_at: new Date().toISOString(),
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ rider: data, message: 'Rider registration submitted for approval' });
});

router.get('/', async (req, res) => {
  const { approved = 'true', available } = req.query;
  let query = supabase.from('riders').select('*').order('created_at', { ascending: false });
  if (approved === 'true') query.eq('approved', true);
  if (available) query.eq('available', available === 'true');
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ riders: data });
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase.from('riders').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Rider not found' });
  res.json({ rider: data });
});

router.patch('/:id/status', requireAuth, requireRole('rider', 'admin'), async (req, res) => {
  const { available } = req.body;
  const { data, error } = await supabase.from('riders')
    .update({ available, updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ rider: data });
});

router.patch('/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  const { approved } = req.body;
  const { data, error } = await supabase.from('riders')
    .update({ approved, updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ rider: data });
});

module.exports = router;