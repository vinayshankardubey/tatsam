import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import { ProfileManager } from "./profile-manager";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getCurrentProfile();
  if (!profile) {
    return (
      <div className="max-w-xl">
        <p className="text-brown/55">Loading…</p>
      </div>
    );
  }

  return <ProfileManager profile={profile} />;
}
