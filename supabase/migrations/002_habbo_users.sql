-- Cache de nome e avatar dos usuários descobertos (para exibir no ranking).
-- Atualizado sempre que um perfil é buscado.
-- Execute no SQL Editor do Supabase.

create table if not exists public.habbo_users (
  hotel_id text not null,
  habbo_user_id text not null,
  name text not null,
  figure_string text not null default '',
  last_seen_at timestamptz not null default now(),
  primary key (hotel_id, habbo_user_id)
);

create index if not exists idx_habbo_users_hotel
  on public.habbo_users (hotel_id);

comment on table public.habbo_users is 'Nome e avatar dos usuários já consultados no site (para ranking emblemáticos).';

-- Ranking: TOP N usuários com mais emblemas descobertos no site (por hotel).
create or replace function public.get_emblematic_ranking(p_hotel_id text, p_limit int default 1000)
returns table (
  rank bigint,
  hotel_id text,
  habbo_user_id text,
  name text,
  figure_string text,
  badge_count bigint
)
language sql
stable
as $$
  with counts as (
    select hub.hotel_id, hub.habbo_user_id, count(*) as cnt
    from public.habbo_user_badges hub
    where hub.hotel_id = p_hotel_id
    group by hub.hotel_id, hub.habbo_user_id
    order by cnt desc
    limit p_limit
  ),
  ranked as (
    select c.*, row_number() over (order by c.cnt desc) as rn
    from counts c
  )
  select r.rn::bigint, r.hotel_id, r.habbo_user_id, coalesce(hu.name, '?'), coalesce(hu.figure_string, ''), r.cnt::bigint
  from ranked r
  left join public.habbo_users hu on hu.hotel_id = r.hotel_id and hu.habbo_user_id = r.habbo_user_id
  order by r.rn;
$$;
