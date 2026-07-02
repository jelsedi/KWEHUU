require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

(async () => {

    const { data, error } =
        await supabase.auth.signInWithPassword({

            email: "jelsedi33@gmail.com",

            password: "YOUR_PASSWORD"

        });

    console.log(data);
    console.log(error);

})();