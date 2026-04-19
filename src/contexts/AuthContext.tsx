import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, setSharedSession, getSharedSession, clearSharedSession } from '../lib/supabase';
import { ADMIN_EMAILS } from '../config/admin';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import ProfileCompleteModal from '../components/ProfileCompleteModal';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accountBlock, setAccountBlock] = useState(null);

  const clearAccountBlock = () => setAccountBlock(null);

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setProfile(data);
      setIsMentor(data.role === 'mentor');

      // signup_domain / visited_sites 자동 처리 (user_profiles 공유 테이블)
      const currentDomain = window.location.hostname;
      const { data: upData } = await supabase
        .from('user_profiles')
        .select('signup_domain, visited_sites')
        .eq('id', userId)
        .single();
      if (upData) {
        const updates = {};
        if (!(upData as any).signup_domain) (updates as any).signup_domain = currentDomain;
        const sites = Array.isArray((upData as any).visited_sites) ? (upData as any).visited_sites : [];
        if (!sites.includes(currentDomain)) {
          (updates as any).visited_sites = [...sites, currentDomain];
        }
        if (Object.keys(updates).length > 0) {
          supabase.from('user_profiles').update(updates).eq('id', userId).then(() => {});
        }
      }

      // 계정 상태 체크
      try {
        const { data: statusData } = await supabase.rpc('check_user_status', {
          target_user_id: userId,
          current_domain: currentDomain,
        });
        if (statusData && statusData.status && statusData.status !== 'active') {
          setAccountBlock({
            status: statusData.status,
            reason: statusData.reason || '',
            suspended_until: statusData.suspended_until || null,
          });
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          return;
        }
      } catch {
        // check_user_status 함수 미존재 시 무시
      }
    }
  }, []);

  const handleAuthChange = useCallback(async (currentSession) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    if (currentSession?.user) {
      setIsAdmin(ADMIN_EMAILS.includes(currentSession.user.email?.toLowerCase() || ''));
      await fetchProfile(currentSession.user.id);
    } else {
      setProfile(null);
      setIsMentor(false);
      setIsAdmin(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (mounted) {
        if (s?.refresh_token) {
          setSharedSession(s.refresh_token);
        } else {
          const rt = getSharedSession();
          if (rt) {
            try {
              const { data } = await supabase!.auth.refreshSession({ refresh_token: rt });
              if (!data.session) clearSharedSession();
            } catch { clearSharedSession(); }
          }
        }
        handleAuthChange(s).then(() => setLoading(false));
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (mounted) {
          if (s?.refresh_token) setSharedSession(s.refresh_token);
          if (event === 'SIGNED_OUT') clearSharedSession();

          if (event === 'SIGNED_IN' && s?.user) {
            const hostname = window.location.hostname;
            // Update last sign-in and visited_sites tracking
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('visited_sites')
              .eq('id', s.user.id)
              .single();
            const sites = Array.isArray(profileData?.visited_sites) ? (profileData as any).visited_sites : [];
            const updates = { last_sign_in_at: new Date().toISOString() };
            if (!sites.includes(hostname)) {
              (updates as any).visited_sites = [...sites, hostname];
            }
            supabase.from('user_profiles')
              .update(updates)
              .eq('id', s.user.id)
              .then(() => {});
          }
          await handleAuthChange(s);
          setLoading(false);
        }
      }
    );
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [handleAuthChange]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;

    // Create user_profiles record after successful signUp
    if (data?.user) {
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName || '',
        signup_domain: window.location.hostname,
        visited_sites: [window.location.hostname],
      }, { onConflict: 'id' });
    }

    return data;
  };

  const signInWithOAuth = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsMentor(false);
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No authenticated user');
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  };


  // 10분 무동작 세션 타임아웃
  useIdleTimeout({
  enabled: !!user,
  onTimeout: () => {
  supabase.auth.signOut();
  clearSharedSession();
  },
  });
  const refreshProfile = useCallback(async () => { if (user) { const p = await fetchProfile(user.id); setProfile(p); } }, [user, fetchProfile]);
  const needsProfileCompletion = !!user && !!profile && !profile.name;


  return (
    <AuthContext.Provider value={{
      session, user, profile, loading, isMentor, isAdmin,
      accountBlock, clearAccountBlock,
      signIn, signUp, signInWithOAuth, signOut, updateProfile,
    }}>
      {children}
      {needsProfileCompletion && user && (
        <ProfileCompleteModal user={user} onComplete={refreshProfile} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
