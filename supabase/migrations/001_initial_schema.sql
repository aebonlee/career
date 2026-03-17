-- ============================================
-- 상담공간 (Counseling Space) - Database Schema
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
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
CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
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
CREATE TABLE public.services (
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
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(mentor_id, start_time)
);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID NOT NULL REFERENCES public.profiles(id),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id),
  service_id UUID NOT NULL REFERENCES public.services(id),
  time_slot_id UUID REFERENCES public.time_slots(id),
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
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  imp_uid TEXT UNIQUE,
  merchant_uid TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded','cancelled')),
  pg_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitter_id UUID NOT NULL REFERENCES public.profiles(id),
  reviewer_id UUID REFERENCES public.profiles(id),
  booking_id UUID REFERENCES public.bookings(id),
  type TEXT NOT NULL CHECK (type IN ('resume','cover_letter')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','in_review','reviewed')),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  receiver_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
CREATE INDEX idx_mentors_profile_id ON public.mentors(profile_id);
CREATE INDEX idx_mentors_is_active ON public.mentors(is_active);
CREATE INDEX idx_time_slots_mentor_id ON public.time_slots(mentor_id);
CREATE INDEX idx_time_slots_start_time ON public.time_slots(start_time);
CREATE INDEX idx_bookings_mentee_id ON public.bookings(mentee_id);
CREATE INDEX idx_bookings_mentor_id ON public.bookings(mentor_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_merchant_uid ON public.payments(merchant_uid);
CREATE INDEX idx_documents_submitter_id ON public.documents(submitter_id);
CREATE INDEX idx_documents_reviewer_id ON public.documents(reviewer_id);
CREATE INDEX idx_reviews_mentor_id ON public.reviews(mentor_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- ============================================
-- REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Update mentor rating on new review
CREATE OR REPLACE FUNCTION public.update_mentor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.mentors SET
    rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE mentor_id = NEW.mentor_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE mentor_id = NEW.mentor_id)
  WHERE id = NEW.mentor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_inserted
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mentor_rating();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, user can update own
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Mentors: anyone can read active, mentor can update own
CREATE POLICY "mentors_select" ON public.mentors FOR SELECT USING (is_active = true);
CREATE POLICY "mentors_update" ON public.mentors FOR UPDATE USING (profile_id = auth.uid());

-- Services: anyone can read active
CREATE POLICY "services_select" ON public.services FOR SELECT USING (is_active = true);

-- Time Slots: anyone can read, mentor can manage own
CREATE POLICY "time_slots_select" ON public.time_slots FOR SELECT USING (true);
CREATE POLICY "time_slots_insert" ON public.time_slots FOR INSERT WITH CHECK (
  mentor_id IN (SELECT id FROM public.mentors WHERE profile_id = auth.uid())
);
CREATE POLICY "time_slots_update" ON public.time_slots FOR UPDATE USING (
  mentor_id IN (SELECT id FROM public.mentors WHERE profile_id = auth.uid())
);
CREATE POLICY "time_slots_delete" ON public.time_slots FOR DELETE USING (
  mentor_id IN (SELECT id FROM public.mentors WHERE profile_id = auth.uid())
);

-- Bookings: mentee sees own, mentor sees theirs
CREATE POLICY "bookings_select_mentee" ON public.bookings FOR SELECT USING (mentee_id = auth.uid());
CREATE POLICY "bookings_select_mentor" ON public.bookings FOR SELECT USING (
  mentor_id IN (SELECT id FROM public.mentors WHERE profile_id = auth.uid())
);
CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT WITH CHECK (mentee_id = auth.uid());

-- Payments: via booking ownership
CREATE POLICY "payments_select" ON public.payments FOR SELECT USING (
  booking_id IN (SELECT id FROM public.bookings WHERE mentee_id = auth.uid())
);

-- Documents: submitter can manage own, reviewer can read/update assigned
CREATE POLICY "documents_select_submitter" ON public.documents FOR SELECT USING (submitter_id = auth.uid());
CREATE POLICY "documents_select_reviewer" ON public.documents FOR SELECT USING (reviewer_id = auth.uid());
CREATE POLICY "documents_insert" ON public.documents FOR INSERT WITH CHECK (submitter_id = auth.uid());
CREATE POLICY "documents_update_reviewer" ON public.documents FOR UPDATE USING (reviewer_id = auth.uid());

-- Reviews: anyone can read, reviewer can insert
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Messages: sender and receiver can see own
CREATE POLICY "messages_select" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Notifications: user can read/update own
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- SEED DATA: Services
-- ============================================
INSERT INTO public.services (name, slug, description, durations, base_price) VALUES
  ('진로상담', 'career-counseling', '적성과 흥미를 분석하여 최적의 진로 방향을 제시합니다.', '{30,50,80}', 50000),
  ('이력서/자소서 진단', 'resume-review', '전문가의 시선으로 이력서와 자기소개서를 진단하고 피드백합니다.', '{30,50}', 40000),
  ('커리어 컨설팅', 'career-consulting', '경력 개발 전략과 커리어 로드맵을 함께 설계합니다.', '{50,80}', 60000),
  ('모의면접', 'mock-interview', '실전과 동일한 환경에서 면접을 연습하고 피드백을 받습니다.', '{50,80}', 70000);
