import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class KeyValueStore {
  @PrimaryColumn("varchar")
  key: string;

  @Column("varchar", { nullable: true })
  value: string | null;
}
