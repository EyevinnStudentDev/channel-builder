// src/app/entities/Channel.ts
import "reflect-metadata";
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Channel {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    type: 'Loop' | 'Playlist' | 'Webhook';

    @Column()
    url: string;

    @Column({ type: 'text', nullable: true })
    playlist?: string;

    constructor(data: Partial<Channel> = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.type = data.type || 'Loop';
        this.url = data.url || '';
        this.playlist = data.playlist;
    }
}