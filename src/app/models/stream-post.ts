export class StreamPost {

    private _stream_post_id: number; // (11)
    private _original_post_id: number; // (11)
    private _original_stream_by: number; // (11)
    private _belongs_to_stream: number; // (1)
    private _stream_by: number; // (11)
    private _stream_content: string; // (1000)
    private _extra_media: number; // (1)
    private _status: number; // (1)
    private _loc_x: string;
    private _loc_y: string;
    private _last_update: string;
    public _stream_actions : boolean = false;
    private _stream_link: string;
    private _dated : string;
    private _stream_by_info : any;
    private _extra_media_obj : any;
    private _stream_post_likes : any;
    private _stream_post_comments : any;

    constructor() {}

    get dated(): string { return this._dated; }
    set dated(value: string) { this._dated = value; }

    get stream_post_comments(): any { return this._stream_post_comments; }
    set stream_post_comments(value: any) { this._stream_post_comments = value; }

    get stream_post_likes(): any { return this._stream_post_likes; }
    set stream_post_likes(value: any) { this._stream_post_likes = value; }

    get extra_media_obj(): any { return this._extra_media_obj; }
    set extra_media_obj(value: any) { this._extra_media_obj = value; }

    get stream_by_info() : any { return this._stream_by_info; }
    set stream_by_info(value : any) { this._stream_by_info = value; }

    get stream_post_id(): number { return this._stream_post_id; }
    set stream_post_id(value: number) { this._stream_post_id = value; }

    get belongs_to_stream(): number { return this._belongs_to_stream; }
    set belongs_to_stream(value: number) { this._belongs_to_stream = value; }

    get stream_by(): number { return this._stream_by; }
    set stream_by(value: number) { this._stream_by = value; }

    get stream_content(): string { return this._stream_content; }
    set stream_content(value: string) { this._stream_content = value; }

    get extra_media(): number { return this._extra_media; }
    set extra_media(value: number) { this._extra_media = value; }

    get status(): number { return this._status; }
    set status(value: number) { this._status = value; }

    get loc_x(): string { return this._loc_x; }
    set loc_x(value: string) { this._loc_x = value; }

    get loc_y(): string { return this._loc_y; }
    set loc_y(value: string) { this._loc_y = value; }

    get last_update(): string { return this._last_update; }
    set last_update(value: string) { this._last_update = value; }

    get stream_actions(): boolean { return this._stream_actions; }
    set stream_actions(value: boolean) { this._stream_actions = value; }

    get stream_link(): string { return this._stream_link; }
    set stream_link(value: string) { this._stream_link = value; }

    get original_post_id(): number { return this._original_post_id; }
    set original_post_id(value: number) { this._original_post_id = value; }

    get original_stream_by(): number { return this._original_stream_by; }
    set original_stream_by(value: number) { this._original_stream_by = value; }
}
