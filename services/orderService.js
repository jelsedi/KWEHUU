const supabase = require("./supabase");

// ======================================
// GET ALL ORDERS
// ======================================
exports.getAllOrders = async () => {

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
};

// ======================================
// GET ORDER BY ID
// ======================================
exports.getOrderById = async (id) => {

    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items(
                *,
                products(*)
            )
        `)
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
};

// ======================================
// GET VENDOR ORDERS
// ======================================
exports.getVendorOrders = async (vendorId) => {

    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items(
                quantity,
                unit_price,
                line_total,
                products(
                    id,
                    name,
                    image_url
                )
            )
        `)
        .eq("vendor_id", vendorId)
        .order("created_at", {
            ascending: false
        });

    if (error) throw error;

    return data;
};

// ======================================
// GET CUSTOMER ORDERS
// ======================================
exports.getCustomerOrders = async (customerId) => {

    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            vendors(
                id,
                name
            ),
            order_items(
                quantity,
                unit_price,
                line_total,
                products(
                    id,
                    name,
                    image_url
                )
            )
        `)
        .eq("customer_id", customerId)
        .order("created_at", {
            ascending: false
        });

    if (error) throw error;

    return data;
};

// ======================================
// UPDATE ORDER STATUS
// ======================================
// ======================================
// UPDATE ORDER STATUS
// ======================================
exports.updateOrderStatus = async (id, status) => {

    const { data, error } = await supabase
        .from("orders")
        .update({
            status,
            updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
};

// ======================================
// ASSIGN RIDER
// ======================================
exports.assignRider = async (id, rider_id) => {

    const { data, error } = await supabase
        .from("orders")
        .update({
            rider_id,
            status: "delivering",
            updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
};

// ======================================
// AVAILABLE RIDERS
// ======================================
exports.getAvailableRiders = async () => {

    const { data, error } = await supabase
        .from("users")
        .select("id,name,phone")
        .eq("role", "rider");

    if (error) throw error;

    return data;
};

// ======================================
// CREATE ORDER
// ======================================

// Validate incoming order
function validateOrder(data) {

    if (!data.customer_id)
        throw new Error("Customer is required");

    if (!data.vendor_id)
        throw new Error("Vendor is required");

    if (!data.items || data.items.length === 0)
        throw new Error("Cart is empty");

}

// Fetch products from database
async function fetchProducts(items) {

    const productIds = items.map(item => item.product_id);

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

    if (error) throw error;

    return data;

}

// Build order items and calculate subtotal
function buildOrderItems(products, cartItems) {

    let subtotal = 0;

    const orderItems = cartItems.map(item => {

        const product = products.find(
            p => p.id === item.product_id
        );

        if (!product) {
            throw new Error(`Product not found: ${item.product_id}`);
        }

        const line_total =
            Number(product.price) * Number(item.quantity);

        subtotal += line_total;

        return {

            product_id: item.product_id,

            quantity: item.quantity,

            unit_price: product.price,

            line_total

        };

    });

    return {

        orderItems,

        subtotal

    };

}

// Calculate totals
function calculateTotals(subtotal) {

    const delivery_fee = 100;

    return {

        subtotal,

        delivery_fee,

        total: subtotal + delivery_fee

    };

}

// Save order
async function saveOrder(payload) {

    const { data, error } = await supabase
        .from("orders")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;

    return data;

}

// Save order items
async function saveOrderItems(orderId, items) {

    const payload = items.map(item => ({

        order_id: orderId,

        ...item

    }));

    const { error } = await supabase
        .from("order_items")
        .insert(payload);

    if (error) throw error;

}

// Exported function
exports.createOrder = async (payload) => {

    if (!payload.customer_id) {
        throw new Error("Customer is required");
    }

    if (!payload.vendors || payload.vendors.length === 0) {
        throw new Error("Cart is empty");
    }

    const createdOrders = [];

    for (const vendor of payload.vendors) {

        if (!vendor.vendor_id) {
            throw new Error("Vendor is required");
        }

        if (!vendor.items || vendor.items.length === 0) {
            continue;
        }

        const products = await fetchProducts(vendor.items);

        const {
            orderItems,
            subtotal
        } = buildOrderItems(products, vendor.items);

        const totals = calculateTotals(subtotal);

        const order = await saveOrder({

            customer_id: payload.customer_id,

            vendor_id: vendor.vendor_id,

            delivery_address: payload.delivery_address,

            payment_method: payload.payment_method,

            subtotal: totals.subtotal,

            delivery_fee: totals.delivery_fee,

            total: totals.total,

            payment_status: "pending",

            status: "pending",

            created_at: new Date().toISOString()

        });

        await saveOrderItems(order.id, orderItems);

        createdOrders.push(order);

    }

    return createdOrders;

};