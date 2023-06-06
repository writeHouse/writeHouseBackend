import { Injectable } from '@nestjs/common';
import { EventLogRepository } from './events-logs.repository';
import { EventLog } from './events-logs.entity';

@Injectable()
export class EventLogService {
  constructor(public readonly logRepository: EventLogRepository) {}

  saveEvent(data: Partial<EventLog>) {
    return this.logRepository.save({
      ...data,
      data: JSON.stringify(data.data),
    });
  }
}
