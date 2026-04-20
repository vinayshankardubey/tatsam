-- Scripture-grounded Q&A chat log. Flat per-user stream for MVP; we'll add
-- `conversation_id` for multi-thread support once Gemini Vertex is wired.

create table public.ask_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null check (length(content) between 1 and 8000),
  -- Citation when role='assistant'. Shape:
  --   { "source": "Bhagavad Gita", "ref": "2.47", "passage": "optional" }
  citation   jsonb,
  created_at timestamptz not null default now()
);

create index ask_messages_user_created_at_idx
  on public.ask_messages (user_id, created_at asc);

alter table public.ask_messages enable row level security;

create policy "ask_messages: read own"
  on public.ask_messages for select
  using (auth.uid() = user_id);

create policy "ask_messages: insert own"
  on public.ask_messages for insert
  with check (auth.uid() = user_id);

create policy "ask_messages: delete own"
  on public.ask_messages for delete
  using (auth.uid() = user_id);
