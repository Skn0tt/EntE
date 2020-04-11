import { Injectable, Inject } from "@nestjs/common";
import { RecordReviewalRepo } from "../db/recordReviewal.repo";

@Injectable()
export class ReviewedRecordsService {
  constructor(
    @Inject(RecordReviewalRepo)
    private readonly recordReviewalRepo: RecordReviewalRepo
  ) {}

  getReviewedRecords(userId: string) {
    return this.recordReviewalRepo.getReviewedRecords(userId);
  }

  addToReviewedRecords(userId: string, recordId: string) {
    return this.recordReviewalRepo.addToReviewedRecord(userId, recordId);
  }
}
