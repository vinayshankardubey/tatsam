import { createClient } from "@supabase/supabase-js";
const URL="http://127.0.0.1:54421";
const SR="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const admin=createClient(URL,SR,{auth:{persistSession:false}});
const anon=createClient(URL,ANON,{auth:{persistSession:false}});
const link=await admin.auth.admin.generateLink({type:"magiclink",email:"anika@example.com"});
const v=await anon.auth.verifyOtp({token_hash:link.data.properties.hashed_token,type:"magiclink"});
const s=v.data.session;
const cookie=`sb-127-auth-token=${encodeURIComponent(JSON.stringify({access_token:s.access_token,token_type:"bearer",expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,refresh_token:s.refresh_token,user:v.data.user}))}`;
const t=await (await fetch("http://127.0.0.1:3000/dashboard",{headers:{cookie},redirect:"manual"})).text();
for (const m of [
  "Tithi","Nakshatra","Yoga","Moon","Rahu Kaal","Abhijit","Brahma Muhurat",
  "Lucky color","Mantra","A line for today",
  "Cast by your acharya","Janma Nakshatra","Mahadasha",
  "Life Path","Personal Year","Personal Year 2026",
  "Upcoming sky events","Akshaya Tritiya",
  "Quick actions","Book a reading","Kundli matching","Muhurat finder",
  "Your remedies",
]) console.log((t.includes(m)?"✅":"❌")+" "+m);
