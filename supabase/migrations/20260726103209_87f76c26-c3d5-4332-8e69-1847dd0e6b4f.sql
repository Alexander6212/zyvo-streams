
drop policy "anyone can submit" on public.support_messages;
create policy "anyone can submit" on public.support_messages
  for insert to anon, authenticated
  with check (length(coalesce(message,'')) > 0 and length(coalesce(email,'')) > 0);

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
