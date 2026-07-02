const BaseService = require("./BaseService");
const supabase = require("./supabase");

class ProductService extends BaseService {

    constructor() {
        super("products", supabase);
    }

    // ======================================
    // GET PRODUCTS
    // ======================================
    async getProducts(filters = {}) {

        let query = this.supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (filters.available !== undefined) {
            query = query.eq("available", filters.available);
        }

        if (filters.vendor_id) {
            query = query.eq("vendor_id", filters.vendor_id);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data;

    }

    // ======================================
    // GET PRODUCT
    // ======================================
    async getProduct(id) {

        return await this.getById(id);

    }

    // ======================================
    // CREATE PRODUCT
    // ======================================
    async createProduct(payload) {

        return await this.create({

            ...payload,

            created_at: new Date().toISOString()

        });

    }

    // ======================================
    // UPDATE PRODUCT
    // ======================================
    async updateProduct(id, payload) {

        return await this.update(id, payload);

    }

    // ======================================
    // DELETE PRODUCT
    // ======================================
    async deleteProduct(id) {

        return await this.delete(id);

    }

}

module.exports = new ProductService();