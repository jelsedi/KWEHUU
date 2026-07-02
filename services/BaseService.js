class BaseService {

    constructor(table, supabase) {
        this.table = table;
        this.supabase = supabase;
    }

    async getAll(orderBy = "created_at") {

        const { data, error } = await this.supabase
            .from(this.table)
            .select("*")
            .order(orderBy, { ascending: false });

        if (error) throw error;

        return data;
    }

    async getById(id) {

        const { data, error } = await this.supabase
            .from(this.table)
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        return data;
    }

    async create(payload) {

        const { data, error } = await this.supabase
            .from(this.table)
            .insert(payload)
            .select()
            .single();

        if (error) throw error;

        return data;
    }

    async update(id, payload) {

        const { data, error } = await this.supabase
            .from(this.table)
            .update({
                ...payload,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    }

    async delete(id) {

        const { error } = await this.supabase
            .from(this.table)
            .delete()
            .eq("id", id);

        if (error) throw error;

        return true;
    }

}

module.exports = BaseService;