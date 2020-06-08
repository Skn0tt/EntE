import { MakeSlotDateNullable1544015021618 } from "./1544015021618-MakeSlotDateNullable";
import { ReplaceIsAdultByBirthday1545584116000 } from "./1545584116000-ReplaceIsAdultByBirthday";
import { Init1514764800000 } from "./1514764800000-Init";
import { AlterEntryDatetimeColumnsToDate1545813658000 } from "./1545813658000-AlterEntryDatetimeColumnsToDate";
import { AddLanguageFieldToUser1545942329000 } from "./1545942329000-AddLanguageFieldToUser";
import { AddEntryReason1546417592000 } from "./1546417592000-AddEntryReason";
import { AddKeyValueStoreTable1551014417000 } from "./1551014417000-AddKeyValueStoreTable";
import { UseEnumType1551372175000 } from "./1551372175000-UseEnumType";
import { MakeKeyValueStoreTextType1551372598000 } from "./1551372598000-MakeKeyValueStoreTextType";
import { MakeKeyValueStoreNotNullable1551377199000 } from "./1551377199000-MakeKeyValueStoreNotNullable";
import { RemoveInconsistentUserAttributes1551534415000 } from "./1551534415000-RemoveInconsistentUserAttributes";
import { AddNewEntryReasonCategories1551552955000 } from "./1551552955000-AddNewEntryReasonCategories";
import { SaveSignatureDates1557748840000 } from "./1557748840000-SaveSignatureDates";
import { AddManagerNotesField1569158678000 } from "./1569158678000-AddManagerNotesField";
import { CreateRecordReviewalTable1573931612000 } from "./1573931612000-CreateRecordReviewalTable";
import { AddWeeklySummarySubscriptionFlag1577435990000 } from "./1577435990000-AddWeeklySummarySubscriptionFlag";
import { GradYearToClass1582734098000 } from "./1582734098000-GradYearToClass";
import { AddIsAdminField1585738676000 } from "./1585738676000-AddIsAdminField";
import { AddManagerReachedOutField1585989168000 } from "./1585989168000-AddManagerReachedOutField";
import { AddPrefiledSlots1586165238000 } from "./1586165238000-AddPrefiledSlots";
import { Add2FATotpSecret1587709969000 } from "./1587709969000-Add2FATotpSecret";
import { DontCascadeSlotDeletion1588167544000 } from "./1588167544000-DontCascadeSlotDeletion";
import { DeleteCascadePrefiledFor1591612977000 } from "./1591612977000-DeleteCascadePrefiledFor";

export const migrations = [
  MakeSlotDateNullable1544015021618,
  ReplaceIsAdultByBirthday1545584116000,
  Init1514764800000,
  AlterEntryDatetimeColumnsToDate1545813658000,
  AddLanguageFieldToUser1545942329000,
  AddEntryReason1546417592000,
  AddKeyValueStoreTable1551014417000,
  UseEnumType1551372175000,
  MakeKeyValueStoreTextType1551372598000,
  MakeKeyValueStoreNotNullable1551377199000,
  AddNewEntryReasonCategories1551552955000,
  RemoveInconsistentUserAttributes1551534415000,
  SaveSignatureDates1557748840000,
  AddManagerNotesField1569158678000,
  CreateRecordReviewalTable1573931612000,
  AddWeeklySummarySubscriptionFlag1577435990000,
  GradYearToClass1582734098000,
  AddIsAdminField1585738676000,
  AddManagerReachedOutField1585989168000,
  AddPrefiledSlots1586165238000,
  Add2FATotpSecret1587709969000,
  DontCascadeSlotDeletion1588167544000,
  DeleteCascadePrefiledFor1591612977000,
];
