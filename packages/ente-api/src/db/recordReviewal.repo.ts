import { Repository } from "typeorm";
import { RecordReviewal } from "./recordReviewal.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class RecordReviewalRepo {
  constructor(
    @InjectRepository(RecordReviewal)
    private readonly repo: Repository<RecordReviewal>
  ) {}

  async addToReviewedRecord(userId: string, recordId: string): Promise<void> {
    await this.repo.insert({
      user: { _id: userId } as User,
      recordId
    });
  }

  async getReviewedRecords(userId: string): Promise<Set<string>> {
    const rows = await this.repo.find({
      where: { user: userId },
      select: ["recordId"]
    });
    return new Set(rows.map(r => r.recordId));
  }
}
