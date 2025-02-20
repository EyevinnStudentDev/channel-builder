import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  type Relation
} from 'typeorm';
import { Channel } from './Channel';

@Entity('playlist')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255 })
  public fileName!: string;

  @Column({ type: 'text' })
  public fileUrl!: string;

  @ManyToOne(() => Channel, (channel) => channel.playlists, {
    onDelete: 'CASCADE',
    nullable: true
  })
  public channel!: Relation<Channel>;
}
