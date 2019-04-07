-- MySQL dump 10.17  Distrib 10.3.12-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: ente
-- ------------------------------------------------------
-- Server version	10.3.12-MariaDB-1:10.3.12+maria~bionic

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `entry`
--

DROP TABLE IF EXISTS `entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entry` (
  `_id` varchar(255) NOT NULL,
  `signedManager` tinyint(4) NOT NULL,
  `signedParent` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `student_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `dateEnd` date DEFAULT NULL,
  `reasonCategory` enum('examen','field_trip','competition','other_educational','other_non_educational','illness') NOT NULL,
  `reasonFrom` smallint(6) DEFAULT NULL,
  `reasonTo` smallint(6) DEFAULT NULL,
  `reasonDescription` varchar(255) DEFAULT NULL,
  `teacher_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `UQ_e6d65e4c7be913dd7d04aef046e` (`_id`),
  KEY `entry` (`student_id`),
  KEY `FK_925d8713d20ce43b3ae368ed64d` (`teacher_id`),
  CONSTRAINT `FK_925d8713d20ce43b3ae368ed64d` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`_id`) ON DELETE SET NULL,
  CONSTRAINT `entry` FOREIGN KEY (`student_id`) REFERENCES `user` (`_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entry`
--

LOCK TABLES `entry` WRITE;
/*!40000 ALTER TABLE `entry` DISABLE KEYS */;
/*!40000 ALTER TABLE `entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `key_value_store`
--

DROP TABLE IF EXISTS `key_value_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `key_value_store` (
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `key_value_store`
--

LOCK TABLES `key_value_store` WRITE;
/*!40000 ALTER TABLE `key_value_store` DISABLE KEYS */;
INSERT INTO `key_value_store` VALUES ('INSTANCE_CONFIG__DEFAULT_LANGUAGE','en'),('INSTANCE_CONFIG__PARENT_SIGNATURE_EXPIRY_TIME','1209600000'),('INSTANCE_CONFIG__PARENT_SIGNATURE_NOTIFICATION_TIME','604800000');
/*!40000 ALTER TABLE `key_value_store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1514764800000,'Init1514764800000'),(2,1544015021618,'MakeSlotDateNullable1544015021618'),(3,1545584116000,'ReplaceIsAdultByBirthday1545584116000'),(4,1545813658000,'AlterEntryDatetimeColumnsToDate1545813658000'),(5,1545942329000,'AddLanguageFieldToUser1545942329000'),(6,1546417592000,'AddEntryReason1546417592000'),(7,1551014417000,'AddKeyValueStoreTable1551014417000'),(8,1551372175000,'UseEnumType1551372175000'),(9,1551372598000,'MakeKeyValueStoreTextType1551372598000'),(10,1551377199000,'MakeKeyValueStoreNotNullable1551377199000'),(11,1551534415000,'RemoveInconsistentUserAttributes1551534415000'),(12,1551534415000,'RemoveInconsistentUserAttributes1551534415000'),(13,1551552955000,'AddNewEntryReasonCategories1551552955000');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slot`
--

DROP TABLE IF EXISTS `slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slot` (
  `_id` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `hour_from` tinyint(4) NOT NULL,
  `hour_to` tinyint(4) NOT NULL,
  `teacher_id` varchar(255) DEFAULT NULL,
  `entry_id` varchar(255) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `UQ_75400f58eb34de1383736f53da7` (`_id`),
  KEY `FK_33de2e84d20042dda4005548f00` (`entry_id`),
  KEY `FK_85ff52214939e16bf3a4614a635` (`teacher_id`),
  CONSTRAINT `FK_33de2e84d20042dda4005548f00` FOREIGN KEY (`entry_id`) REFERENCES `entry` (`_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_85ff52214939e16bf3a4614a635` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slot`
--

LOCK TABLES `slot` WRITE;
/*!40000 ALTER TABLE `slot` DISABLE KEYS */;
/*!40000 ALTER TABLE `slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `displayname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('parent','student','teacher','admin','manager') DEFAULT NULL,
  `graduationYear` smallint(6) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `language` varchar(255) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `UQ_457bfa3e35350a716846b03102d` (`_id`),
  UNIQUE KEY `UQ_78a916df40e02a9deb1c4b75edb` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('021e1712-d34b-4541-bb50-2ceddc1ff2fe','candaceparis','Candace Paris','test@test.com','parent',NULL,'$2b$12$i2g1NRx/f7apjc8ETJLeCOBHZhh5fr0EUicYY3M4dvvbziG75tZXu',NULL,'en'),('08328be8-b1c3-4cb1-80e3-4a37126eeb77','rufuskay','Rufus Kay','test@test.com','manager',2019,'$2b$12$Qi7oyOaPAqzudv0vygbJqeVvYat0OoDfYNEpWGTrekgFrrOBAoO9y',NULL,'en'),('55e6f243-c7e7-4851-add0-387bd651fe85','montyabrams','Monty Abrams','test@test.com','student',2019,'$2b$12$GSmuEnmRfl/5BCtHlVd5rOIi21zLrmTfuPFmhd.PGYP9.4UbYqdI.','2100-04-02','en'),('61389166-026c-4f5d-abd4-5b2370d44820','penabrams','Pen Abrams','test@test.com','student',2021,'$2b$12$fffVZLg9k5rtCtqV2Mebt.DTCoVW7Ry.1IIdPmEg3.r68J4TkXHJy','2050-03-09','en'),('6223c5c7-5618-4634-a499-ad6db227bf0f','hermanabrams','Herman Abrams','test@test.com','parent',NULL,'$2b$12$6zemf2qaaw7rAaiREqCj.uKTyJ03xZ8u/TWaKtB2ZIskAG9IhzQ22',NULL,'en'),('80da55bd-ee7c-41c3-92d6-024f61938759','luannedavidson','Luanne Davidson','test@test.com','teacher',NULL,'$2b$12$eJowovH7kaHO2u8fmDWDwOMPw1S3WL7wN3rPSlvoBG2PN1tbeR8wy',NULL,'en'),('81b101c5-50ff-4bd6-ac40-e4b1feeed1f1','orvillekeighley','Orville Keighley','test@test.com','teacher',NULL,'$2b$12$/ksc2ilhz7oRAkgSdzjHW.FpI7HiGaZWKY7tWycWDwvXi8hUHEDB6',NULL,'en'),('b0679b43-923f-45c4-8738-39acd45555bf','marcusparis','Marcus Paris','test@test.com','student',2021,'$2b$12$LZ4hfpbKRUfU765dJllJBePFHaPxaAOBAeKtI74cvkph3rekhhpoy','2100-02-01','en'),('c1c1f7f7-1ef2-46c1-b31b-65e0e5c83eec','norahparis','Norah Paris','test@test.com','student',2019,'$2b$12$AF5dXW7a/Unq0TM4zXzj1OA8o2X6S8ZJn83oooT4Unyf9pkAIzuIu','2000-02-01','en'),('c9f02487-8b87-4303-994c-0bbb8e6a17a9','claudabrams','Claud Abrams','test@test.com','parent',NULL,'$2b$12$3N78/MHxRMSBU4si6kQR4OVBI9okFHZgcD0Z/jYrR5lW8nAeZoObi',NULL,'en'),('cb3e0f4e-ce84-4d9d-8f77-665cb2d15d60','admin','Administrator','admin@ente.de','admin',NULL,'$2b$12$.77TLVTJpB4TJTUJiXW22O/lZo0RQ8YzkmPn3Ns/RE3b7eW1UvDIG',NULL,'en'),('f10f780d-83c7-42e6-b7cf-547fd636167a','seymourparis','Seymour Paris','test@test.com','parent',NULL,'$2b$12$cryXWjse9jdWBuh07e2sz.CdPIXE8s35r9T98hIHwpYxBy21Iqcmq',NULL,'en'),('fc05bf92-8bd7-403a-bb6d-fcbdaeaa19b7','daytonkimberly','Dayton Kimberly','test@test.com','manager',2021,'$2b$12$G2UY0ahIbK8U04ZWe7zYEuZrUE2DnZ/M2GVPUIfV/RiPE8Go53NIm',NULL,'en');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_children_user`
--

DROP TABLE IF EXISTS `user_children_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_children_user` (
  `user_id_1` varchar(255) NOT NULL,
  `user_id_2` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id_1`,`user_id_2`),
  KEY `FK_c954fe69613431527e30c81734e` (`user_id_2`),
  CONSTRAINT `FK_c85340af33f82af1f2b63a22eb8` FOREIGN KEY (`user_id_1`) REFERENCES `user` (`_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_c954fe69613431527e30c81734e` FOREIGN KEY (`user_id_2`) REFERENCES `user` (`_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_children_user`
--

LOCK TABLES `user_children_user` WRITE;
/*!40000 ALTER TABLE `user_children_user` DISABLE KEYS */;
INSERT INTO `user_children_user` VALUES ('021e1712-d34b-4541-bb50-2ceddc1ff2fe','b0679b43-923f-45c4-8738-39acd45555bf'),('021e1712-d34b-4541-bb50-2ceddc1ff2fe','c1c1f7f7-1ef2-46c1-b31b-65e0e5c83eec'),('6223c5c7-5618-4634-a499-ad6db227bf0f','55e6f243-c7e7-4851-add0-387bd651fe85'),('6223c5c7-5618-4634-a499-ad6db227bf0f','61389166-026c-4f5d-abd4-5b2370d44820'),('c9f02487-8b87-4303-994c-0bbb8e6a17a9','55e6f243-c7e7-4851-add0-387bd651fe85'),('c9f02487-8b87-4303-994c-0bbb8e6a17a9','61389166-026c-4f5d-abd4-5b2370d44820'),('f10f780d-83c7-42e6-b7cf-547fd636167a','b0679b43-923f-45c4-8738-39acd45555bf'),('f10f780d-83c7-42e6-b7cf-547fd636167a','c1c1f7f7-1ef2-46c1-b31b-65e0e5c83eec');
/*!40000 ALTER TABLE `user_children_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-07 16:35:40
