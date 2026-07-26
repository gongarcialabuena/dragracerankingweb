create table queen (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table season (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  franchise text,
  year int
);

create table participate (
  season_id uuid references season(id),
  queen_id uuid references queen(id),
  image_url text,
  primary key (season_id, queen_id)
);

create table episode (
  id uuid primary key default gen_random_uuid(),
  season_id uuid references season(id),
  number int not null,
  title text
);

create table point_type (
  id text primary key,
  label text not null,
  value numeric not null
);

create table client (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null
);

create table points_per_episode (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references auth.users(id),
  queen_id uuid references queen(id),
  season_id uuid references season(id),
  episode_id uuid references episode(id),
  point_type_id text references point_type(id)
);

ALTER TABLE points_per_episode
ADD CONSTRAINT unique_points
UNIQUE (client_id, season_id, episode_id, queen_id);