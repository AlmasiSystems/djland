INSERT INTO `djland`.`membership` (`id`, `lastname`, `firstname`, `canadian_citizen`, `member_type`) VALUES ('1', 'Almighty', 'Admin', '1', 'Staff');
INSERT INTO `djland`.`membership_years` (`id`, `member_id`, `membership_year`, `paid`, `sports`, `news`, `arts`, `music`, `show_hosting`, `live_broadcast`, `tech`, `programming_committee`, `ads_psa`, `promotions_outreach`, `discorder`, `discorder_2`, `digital_library`, `photography`, `tabling`, `dj`, `other`, `create_date`) VALUES ('1', '1', '2016/2017', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', NULL);
INSERT INTO `djland`.`user` (`id`, `member_id`, `username`, `password`, `status`, `create_date`, `edit_date`, `login_fails`) VALUES ('1', '1', 'Admin', '$2y$10$hza8F199V5ADR2yRdXXbs.bs6zOi5.CJeqDJYzyT3yc7/2LSfqePu', 'enabled', '2016-07-05 21:35:00', '2016-07-05 21:35:00', '0');
INSERT INTO `djland`.`group_members` (`user_id`, `operator`, `administrator`, `staff`, `workstudy`, `volunteer_leader`, `volunteer`, `dj`, `member`) VALUES ('1', '1', '0', '0', '0', '0', '0', '0', '0');