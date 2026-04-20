import { createClient } from "@supabase/supabase-js";
const admin=createClient("http://127.0.0.1:54421","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",{auth:{persistSession:false}});
const anon=createClient("http://127.0.0.1:54421","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",{auth:{persistSession:false}});
const link=await admin.auth.admin.generateLink({type:"magiclink",email:"anika@example.com"});
const v=await anon.auth.verifyOtp({token_hash:link.data.properties.hashed_token,type:"magiclink"});
const s=v.data.session;
const cookie=`sb-127-auth-token=${encodeURIComponent(JSON.stringify({access_token:s.access_token,token_type:"bearer",expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,refresh_token:s.refresh_token,user:v.data.user}))}`;
const t=await (await fetch("http://127.0.0.1:3000/dashboard",{headers:{cookie},redirect:"manual"})).text();
const m=t.match(/-mt-5 rounded-full bg-maroon/g) || [];
console.log("FAB count in dashboard:", m.length);
// Check tab order
for (const label of ["Today","Kundli","Ask","Readings","Me"]) {
  console.log((t.includes(`>${label}<`)?"✅":"❌")+" "+label);
}
