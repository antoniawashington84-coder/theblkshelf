async function requireAdmin() {
  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    window.location.href = "login.html";
    return null;
  }

  const user = sessionData.session.user;

  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
    return null;
  }

  return { user, profile };
}

async function signOutAdmin() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}