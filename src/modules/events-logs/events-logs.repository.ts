import { EntityRepository, Repository } from 'typeorm';
import { EventLog } from '../events-logs/events-logs.entity';

@EntityRepository(EventLog)
export class EventLogRepository extends Repository<EventLog> {}
