import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class KeyValueStore {
  @PrimaryColumn("varchar")
  key: string;

  @Column("text", { nullable: false })
  value: string;
}
