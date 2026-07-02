const supabase = require("./supabase");
const supabaseAdmin = require("./supabaseAdmin");

// ======================================
// REGISTER
// ======================================

exports.register = async (userData) => {

    const {
        email,
        password,
        name,
        phone,
        role = "customer"
    } = userData;

    // Create authentication account
   const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
        name,
        phone,
        role
    }
});


    if (error) throw error;

    const user = data.user;

    if (!user) {
        throw new Error("Registration failed.");
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin
        .from("users")
        .insert({
            id: user.id,
            name,
            email,
            phone,
            role
        });

    if (profileError) throw profileError;

    return user;
};

// ======================================
// LOGIN
// ======================================

exports.login = async (email, password) => {

    const { data, error } =
        await supabase.auth.signInWithPassword({

            email: email.trim().toLowerCase(),

            password

        });

    if (error) throw error;

    const { data: profile } =
        await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

    return {

        token: data.session.access_token,

        user: profile

    };

};

// ======================================
// PROFILE
// ======================================

exports.getProfile = async (id) => {

    const { data, error } =
        await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;

};

// ======================================
// UPDATE PROFILE
// ======================================

exports.updateProfile = async (id, payload) => {

    const { data, error } =
        await supabaseAdmin
        .from("users")
        .update({

            ...payload,

            updated_at: new Date().toISOString()

        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;

};

// ======================================
// LOGOUT
// ======================================

exports.logout = async () => {

    await supabase.auth.signOut();

    return true;

};