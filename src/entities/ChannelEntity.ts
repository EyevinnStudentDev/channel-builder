import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('channel_entity')
export class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', nullable: true })
  public name?: string | null;

  @Column({ type: 'varchar', nullable: true })
  public description?: string | null;
}
