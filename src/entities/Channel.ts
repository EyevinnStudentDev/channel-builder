import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation} from 'typeorm';
import { Playlist } from './Playlist';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @Column({ type: 'varchar', length: 255 })
  public description!: string;

  @OneToMany(type => Playlist, (playlist) => playlist.channel)
  public playlists!: Relation<Playlist>[];
}
