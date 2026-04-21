import { createClient } from "@supabase/supabase-js";
const admin=createClient("http://127.0.0.1:54421","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",{auth:{persistSession:false}});
const anon=createClient("http://127.0.0.1:54421","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",{auth:{persistSession:false}});
const link=await admin.auth.admin.generateLink({type:"magiclink",email:"anika@example.com"});
const v=await anon.auth.verifyOtp({token_hash:link.data.properties.hashed_token,type:"magiclink"});
const s=v.data.session;
const cookie=`sb-127-auth-token=${encodeURIComponent(JSON.stringify({access_token:s.access_token,token_type:"bearer",expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,refresh_token:s.refresh_token,user:v.data.user}))}`;

for (const [label, url, marker] of [
  ["Ask (no tool)",            "/dashboard/ask",                         "Ask the scriptures"],
  ["Ask · Shri Ram Shalaka",   "/dashboard/ask?tool=shri-ram-shalaka",   "Shri Ram Shalaka"],
  ["Ask · Chanakya Niti",      "/dashboard/ask?tool=chanakya-niti",      "Chanakya Niti"],
  ["Ask · Gita Shalaka",       "/dashboard/ask?tool=gita-shalaka",       "Gita Shalaka"],
  ["Public /tatsam",           "/tatsam",                                "Tatsam's tools"],
]) {
  const r = await fetch(`http://127.0.0.1:3000${url}`, { headers: { cookie }, redirect: "manual" });
  const t = await r.text();
  const ok = r.status === 200 && t.includes(marker);
  console.log(`${ok ? "✅" : "❌"} ${label.padEnd(28)} ${url.padEnd(45)} ${r.status}  ${t.length}b`);
}
