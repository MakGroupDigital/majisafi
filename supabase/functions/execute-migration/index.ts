import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { sql, name } = await req.json();

    if (!sql) {
      return new Response(JSON.stringify({ error: "SQL statement required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get Supabase client initialized with service role key for unrestricted access
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create Fetch request to Postgres endpoint
    const { createClient } = await import("jsr:@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Execute the SQL via RPC or direct query
    const result = await supabase.rpc("exec_sql", {
      sql_query: sql,
    });

    if (result.error) {
      console.error("SQL Error:", result.error);
      return new Response(
        JSON.stringify({
          error: "Migration failed",
          details: result.error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        migration: name || "migrations",
        message: "Migration executed successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
