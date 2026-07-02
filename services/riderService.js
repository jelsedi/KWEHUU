const supabase = require("./supabase");

// ======================================
// GET ALL RIDERS
// ======================================
exports.getRiders = async () => {

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "rider")
        .order("created_at", {
            ascending: false
        });

    if (error) throw error;

    return data;

};

// ======================================
// GET RIDER
// ======================================
exports.getRiderById = async (id) => {

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .eq("role", "rider")
        .single();

    if (error) throw error;

    return data;

};

// ======================================
// UPDATE RIDER STATUS
// ======================================
exports.updateAvailability = async (id, available) => {

    const { data, error } = await supabase
        .from("users")
        .update({

            available,

            updated_at: new Date().toISOString()

        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;

};

// ======================================
// GET RIDER ORDERS
// ======================================
exports.getOrders = async (riderId) => {

    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            customers(
                id,
                name,
                phone
            ),
            vendors(
                id,
                name
            )
        `)
        .eq("rider_id", riderId)
        .order("created_at", {
            ascending: false
        });

    if (error) throw error;

    return data;

};

// ======================================
// COMPLETE DELIVERY
// ======================================
exports.completeDelivery = async (orderId) => {

    const { data, error } = await supabase
        .from("orders")
        .update({

            status: "delivered",

            updated_at: new Date().toISOString()

        })
        .eq("id", orderId)
        .select()
        .single();

    if (error) throw error;

    return data;

};