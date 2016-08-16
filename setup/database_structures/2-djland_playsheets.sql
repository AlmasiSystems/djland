CREATE TABLE `playsheets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `show_id` int(10) unsigned DEFAULT NULL,
  `host` tinytext CHARACTER SET latin1,
  `host_id` int(10) unsigned DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `end` time DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `create_name` tinytext CHARACTER SET latin1,
  `edit_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `title` tinytext CHARACTER SET latin1,
  `edit_name` tinytext CHARACTER SET latin1,
  `summary` mediumtext CHARACTER SET latin1,
  `spokenword_duration` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `unix_time` int(11) DEFAULT NULL,
  `star` tinyint(4) DEFAULT NULL,
  `crtc` int(11) DEFAULT NULL,
  `lang` text CHARACTER SET latin1,
  `type` varchar(45) CHARACTER SET latin1z DEFAULT NULL,
  `show_name` tinytext CHARACTER SET latin1,
  `socan` varchar(1) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_2` (`id`),
  KEY `recent` (`id`,`edit_date`,`status`),
  KEY `playsheet_show_id_idx` (`show_id`),
  CONSTRAINT `playsheet_show_id` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=144031 DEFAULT CHARSET=utf8;