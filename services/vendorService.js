const BaseService = require("./BaseService");
const supabase = require("./supabase");

class VendorService extends BaseService {

    constructor() {
        super("vendors", supabase);
    }

    // Get approved vendors
    async getApproved() {

        const { data, error } = await this.supabase
            .from("vendors")
            .select("*")
            .eq("approved", true)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data;
    }

    // Approve vendor
    async approve(id) {

        return await this.update(id, {
            approved: true
        });

    }

}

module.exports = new VendorService();