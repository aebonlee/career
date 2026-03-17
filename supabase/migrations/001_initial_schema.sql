-- ============================================
-- 상담공간 (Counseling Space) - Database Schema
-- 모든 테이블에 career_ 접두사 사용 (공유 Supabase)
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.career_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'mentee' CHECK (role IN ('mentee', 'mentor', 'admin')),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mentors
CREATE TABLE IF NOT EXISTS public.career_mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.career_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  credentials TEXT,
  institution TEXT,
  specialties TEXT[] DEFAULT '{}',
  hourly_rate INTEGER NOT NULL DEFAULT 50000,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  zoom_account_email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Services
CREATE TABLE IF NOT EXISTS public.career_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  durations INTEGER[] NOT NULL,
  base_price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Time Slots
CREATE TABLE IF NOT EXISTS public.career_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.career_mentors(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(mentor_id, start_time)
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.career_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID NOT NULL REFERENCES public.career_profiles(id),
  mentor_id UUID NOT NULL REFERENCES public.career_mentors(id),
  service_id UUID NOT NULL REFERENCES public.career_services(id),
  time_slot_id UUID REFERENCES public.career_time_slots(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled','no_show')),
  duration INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  zoom_meeting_url TEXT,
  zoom_meeting_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.career_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.career_bookings(id) ON DELETE CASCADE,
  imp_uid TEXT UNIQUE,
  merchant_uid TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded','cancelled')),
  pg_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Documents
CREATE TABLE IF NOT EXISTS public.career_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitter_id UUID NOT NULL REFERENCES public.career_profiles(id),
  reviewer_id UUID REFERENCES public.career_profiles(id),
  booking_id UUID REFERENCES public.career_bookings(id),
  type TEXT NOT NULL CHECK (type IN ('resume','cover_letter')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','in_review','reviewed')),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.career_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.career_bookings(id),
  reviewer_id UUID NOT NULL REFERENCES public.career_profiles(id),
  mentor_id UUID NOT NULL REFERENCES public.career_mentors(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS public.career_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.career_profiles(id),
  receiver_id UUID NOT NULL REFERENCES public.career_profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.career_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.career_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  sms_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_career_mentors_profile_id ON public.career_mentors(profile_id);
CREATE INDEX IF NOT EXISTS idx_career_mentors_is_active ON public.career_mentors(is_active);
CREATE INDEX IF NOT EXISTS idx_career_time_slots_mentor_id ON public.career_time_slots(mentor_id);
CREATE INDEX IF NOT EXISTS idx_career_time_slots_start_time ON public.career_time_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_career_bookings_mentee_id ON public.career_bookings(mentee_id);
CREATE INDEX IF NOT EXISTS idx_career_bookings_mentor_id ON public.career_bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_career_bookings_status ON public.career_bookings(status);
CREATE INDEX IF NOT EXISTS idx_career_payments_booking_id ON public.career_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_career_payments_merchant_uid ON public.career_payments(merchant_uid);
CREATE INDEX IF NOT EXISTS idx_career_documents_submitter_id ON public.career_documents(submitter_id);
CREATE INDEX IF NOT EXISTS idx_career_documents_reviewer_id ON public.career_documents(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_career_reviews_mentor_id ON public.career_reviews(mentor_id);
CREATE INDEX IF NOT EXISTS idx_career_messages_sender_id ON public.career_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_career_messages_receiver_id ON public.career_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_career_notifications_user_id ON public.career_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_career_notifications_is_read ON public.career_notifications(is_read);

-- ============================================
-- REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.career_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.career_notifications;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_career_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.career_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_career_user_created ON auth.users;
CREATE TRIGGER on_career_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_career_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.career_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_career_profiles_updated_at ON public.career_profiles;
CREATE TRIGGER update_career_profiles_updated_at
  BEFORE UPDATE ON public.career_profiles FOR EACH ROW EXECUTE FUNCTION public.career_update_updated_at();

DROP TRIGGER IF EXISTS update_career_bookings_updated_at ON public.career_bookings;
CREATE TRIGGER update_career_bookings_updated_at
  BEFORE UPDATE ON public.career_bookings FOR EACH ROW EXECUTE FUNCTION public.career_update_updated_at();

DROP TRIGGER IF EXISTS update_career_documents_updated_at ON public.career_documents;
CREATE TRIGGER update_career_documents_updated_at
  BEFORE UPDATE ON public.career_documents FOR EACH ROW EXECUTE FUNCTION public.career_update_updated_at();

-- Update mentor rating on new review
CREATE OR REPLACE FUNCTION public.career_update_mentor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.career_mentors SET
    rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM public.career_reviews WHERE mentor_id = NEW.mentor_id),
    review_count = (SELECT COUNT(*) FROM public.career_reviews WHERE mentor_id = NEW.mentor_id)
  WHERE id = NEW.mentor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_career_review_inserted ON public.career_reviews;
CREATE TRIGGER on_career_review_inserted
  AFTER INSERT ON public.career_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.career_update_mentor_rating();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_notifications ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "career_profiles_select" ON public.career_profiles;
CREATE POLICY "career_profiles_select" ON public.career_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "career_profiles_update" ON public.career_profiles;
CREATE POLICY "career_profiles_update" ON public.career_profiles FOR UPDATE USING (auth.uid() = id);

-- Mentors
DROP POLICY IF EXISTS "career_mentors_select" ON public.career_mentors;
CREATE POLICY "career_mentors_select" ON public.career_mentors FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "career_mentors_update" ON public.career_mentors;
CREATE POLICY "career_mentors_update" ON public.career_mentors FOR UPDATE USING (profile_id = auth.uid());

-- Services
DROP POLICY IF EXISTS "career_services_select" ON public.career_services;
CREATE POLICY "career_services_select" ON public.career_services FOR SELECT USING (is_active = true);

-- Time Slots
DROP POLICY IF EXISTS "career_time_slots_select" ON public.career_time_slots;
CREATE POLICY "career_time_slots_select" ON public.career_time_slots FOR SELECT USING (true);
DROP POLICY IF EXISTS "career_time_slots_insert" ON public.career_time_slots;
CREATE POLICY "career_time_slots_insert" ON public.career_time_slots FOR INSERT WITH CHECK (
  mentor_id IN (SELECT id FROM public.career_mentors WHERE profile_id = auth.uid())
);
DROP POLICY IF EXISTS "career_time_slots_update" ON public.career_time_slots;
CREATE POLICY "career_time_slots_update" ON public.career_time_slots FOR UPDATE USING (
  mentor_id IN (SELECT id FROM public.career_mentors WHERE profile_id = auth.uid())
);
DROP POLICY IF EXISTS "career_time_slots_delete" ON public.career_time_slots;
CREATE POLICY "career_time_slots_delete" ON public.career_time_slots FOR DELETE USING (
  mentor_id IN (SELECT id FROM public.career_mentors WHERE profile_id = auth.uid())
);

-- Bookings
DROP POLICY IF EXISTS "career_bookings_select_mentee" ON public.career_bookings;
CREATE POLICY "career_bookings_select_mentee" ON public.career_bookings FOR SELECT USING (mentee_id = auth.uid());
DROP POLICY IF EXISTS "career_bookings_select_mentor" ON public.career_bookings;
CREATE POLICY "career_bookings_select_mentor" ON public.career_bookings FOR SELECT USING (
  mentor_id IN (SELECT id FROM public.career_mentors WHERE profile_id = auth.uid())
);
DROP POLICY IF EXISTS "career_bookings_insert" ON public.career_bookings;
CREATE POLICY "career_bookings_insert" ON public.career_bookings FOR INSERT WITH CHECK (mentee_id = auth.uid());

-- Payments
DROP POLICY IF EXISTS "career_payments_select" ON public.career_payments;
CREATE POLICY "career_payments_select" ON public.career_payments FOR SELECT USING (
  booking_id IN (SELECT id FROM public.career_bookings WHERE mentee_id = auth.uid())
);

-- Documents
DROP POLICY IF EXISTS "career_documents_select_submitter" ON public.career_documents;
CREATE POLICY "career_documents_select_submitter" ON public.career_documents FOR SELECT USING (submitter_id = auth.uid());
DROP POLICY IF EXISTS "career_documents_select_reviewer" ON public.career_documents;
CREATE POLICY "career_documents_select_reviewer" ON public.career_documents FOR SELECT USING (reviewer_id = auth.uid());
DROP POLICY IF EXISTS "career_documents_insert" ON public.career_documents;
CREATE POLICY "career_documents_insert" ON public.career_documents FOR INSERT WITH CHECK (submitter_id = auth.uid());
DROP POLICY IF EXISTS "career_documents_update_reviewer" ON public.career_documents;
CREATE POLICY "career_documents_update_reviewer" ON public.career_documents FOR UPDATE USING (reviewer_id = auth.uid());

-- Reviews
DROP POLICY IF EXISTS "career_reviews_select" ON public.career_reviews;
CREATE POLICY "career_reviews_select" ON public.career_reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "career_reviews_insert" ON public.career_reviews;
CREATE POLICY "career_reviews_insert" ON public.career_reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Messages
DROP POLICY IF EXISTS "career_messages_select" ON public.career_messages;
CREATE POLICY "career_messages_select" ON public.career_messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
DROP POLICY IF EXISTS "career_messages_insert" ON public.career_messages;
CREATE POLICY "career_messages_insert" ON public.career_messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Notifications
DROP POLICY IF EXISTS "career_notifications_select" ON public.career_notifications;
CREATE POLICY "career_notifications_select" ON public.career_notifications FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "career_notifications_update" ON public.career_notifications;
CREATE POLICY "career_notifications_update" ON public.career_notifications FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- SEED DATA: Services
-- ============================================
INSERT INTO public.career_services (name, slug, description, durations, base_price) VALUES
  ('진로상담', 'career-counseling', '적성과 흥미를 분석하여 최적의 진로 방향을 제시합니다.', '{30,50,80}', 50000),
  ('이력서/자소서 진단', 'resume-review', '전문가의 시선으로 이력서와 자기소개서를 진단하고 피드백합니다.', '{30,50}', 40000),
  ('커리어 컨설팅', 'career-consulting', '경력 개발 전략과 커리어 로드맵을 함께 설계합니다.', '{50,80}', 60000),
  ('모의면접', 'mock-interview', '실전과 동일한 환경에서 면접을 연습하고 피드백을 받습니다.', '{50,80}', 70000)
ON CONFLICT (slug) DO NOTHING;
