const express = require('express');
const supabase = require("../services/supabase");
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();


router.use(requireAuth, requireRole('admin'));

router.get('/dashboard', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const [ordersToday, revenue, activeRiders, disputes, pendingVendors, pendingRiders] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact' }).gte('created_at', today),
    supabase.from('orders').select('total').eq('payment_status', 'paid').gte('created_at', today),
    supabase.from('riders').select('id', { count: 'exact' }).eq('available', true),
    supabase.from('disputes').select('id', { count: 'exact' }).eq('status', 'open'),
    supabase.from('vendors').select('id', { count: 'exact' }).eq('approved', false),
    supabase.from('riders').select('id', { count: 'exact' }).eq('approved', false),
  ]);

  const revenueTotal = (revenue.data || []).reduce((s, o) => s + Number(o.total), 0);

  res.json({
    orders_today: ordersToday.count || 0,
    revenue_today: revenueTotal,
    active_riders: activeRiders.count || 0,
    open_disputes: disputes.count || 0,
    pending_vendor_approvals: pendingVendors.count || 0,
    pending_rider_approvals: pendingRiders.count || 0,
  });
});

router.patch('/vendors/:id/approve', async (req, res) => {
  const { approved } = req.body;
  const { data, error } = await supabase.from('vendors')
    .update({ approved, updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ vendor: data, message: approved ? 'Vendor approved' : 'Vendor rejected' });
});

router.patch('/riders/:id/approve', async (req, res) => {
  const { approved } = req.body;
  const { data, error } = await supabase.from('riders')
    .update({ approved, updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ rider: data, message: approved ? 'Rider approved' : 'Rider rejected' });
});

router.get('/users', async (req, res) => {
  const { role, search } = req.query;
  let query = supabase.from('users').select('*').order('created_at', { ascending: false });
  if (role) query = query.eq('role', role);
  if (search) query = query.ilike('phone', `%${search}%`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ users: data });
});

router.get('/analytics/revenue', async (req, res) => {
  const days = Number(req.query.days) || 7;
  const from = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase
    .from('orders')
    .select('total, created_at')
    .eq('payment_status', 'paid')
    .gte('created_at', from);
  if (error) return res.status(500).json({ error: error.message });

  const byDate = {};
  data.forEach(o => {
    const date = o.created_at.split('T')[0];
    byDate[date] = (byDate[date] || 0) + Number(o.total);
  });

  res.json({ revenue_by_date: byDate });
});

router.post('/disputes/:id/resolve', async (req, res) => {
  const { resolution, refund_amount } = req.body;
  const { data, error } = await supabase.from('disputes')
    .update({ status: 'resolved', resolution, refund_amount, resolved_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ dispute: data });
});


module.exports = router;