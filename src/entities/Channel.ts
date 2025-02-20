import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  type Relation
} from 'typeorm';
import { Playlist } from './Playlist';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @Column({ type: 'varchar', length: 255 })
  public description!: string;

  @OneToMany(() => Playlist, (playlist) => playlist.channel, {
    cascade: ['insert', 'update'],
    eager: true,
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE'
  })
  public playlists!: Relation<Playlist>[];
}
