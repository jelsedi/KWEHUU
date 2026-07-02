const BaseService = require("./BaseService");
const supabase = require("./supabase");

class VendorService extends BaseService {

    constructor() {
        super("vendors", supabase);
    }

    // ======================================
    // GET ALL VENDORS
    // ======================================
    async getVendors(approved = true) {

        let query = this.supabase
            .from("vendors")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (approved !== undefined) {
            query = query.eq("approved", approved);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data;

    }

    // ======================================
    // GET SINGLE VENDOR
    // ======================================
    async getVendor(id) {

    const vendor = await this.getById(id);

    return vendor;

}

    // ======================================
    // REGISTER VENDOR
    // ======================================
    async registerVendor(payload) {

        return await this.create({

            ...payload,

            approved: false,

            created_at: new Date().toISOString()

        });

    }

    // ======================================
    // APPROVE / REJECT VENDOR
    // ======================================
    async updateVendorStatus(id, approved) {

        return await this.update(id, {

            approved

        });

    }

    // ======================================
    // DELETE VENDOR
    // ======================================
    async deleteVendor(id) {

        return await this.delete(id);

    }

}

module.exports = new VendorService();